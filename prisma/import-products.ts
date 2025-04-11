// First line, synchronous console log
console.log('Script starting...');

import { PrismaClient } from '../app/generated/prisma';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

// Log before creating PrismaClient
console.log('About to initialize PrismaClient...');
const prisma = new PrismaClient();
console.log('PrismaClient initialized');

interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: string;
  description?: string;
  artist?: string;
  image?: string;
  gallery?: string;
  featured?: string;
  stock?: string;
  createdAt?: string;
  updatedAt?: string;
}

async function main() {
  try {
    console.log('Starting import process...');
    
    // Read the CSV file
    const csvFilePath = path.join(process.cwd(), 'products.csv');
    console.log(`Looking for CSV file at: ${csvFilePath}`);
    
    if (!fs.existsSync(csvFilePath)) {
      console.error(`CSV file not found at ${csvFilePath}`);
      console.log('Current directory contents:');
      const files = fs.readdirSync(process.cwd());
      console.log(files.join('\n'));
      throw new Error(`CSV file not found at ${csvFilePath}`);
    }
    
    console.log(`CSV file found. Reading content...`);
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    console.log(`CSV data read. First 100 characters: ${csvData.substring(0, 100)}`);
    
    // Parse the CSV data
    console.log('Parsing CSV data...');
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    }) as ProductRecord[];
    
    console.log(`Found ${records.length} products to import`);
    
    // Keep track of categories for reuse
    const categoriesMap = new Map();
    const stats = {
      processed: 0,
      skipped: 0,
      errors: 0,
      success: 0,
      created: {
        categories: 0,
        products: 0
      }
    };
    
    // Import each product
    for (const record of records) {
      stats.processed++;
      
      try {
        // First, make sure the category exists
        let category = categoriesMap.get(record.category);
        
        if (!category) {
          // Try to find the category in the database
          const existingCategory = await prisma.category.findFirst({
            where: {
              name: record.category,
            },
          });
          
          if (existingCategory) {
            category = existingCategory;
            categoriesMap.set(record.category, existingCategory);
          } else {
            // Create the category if it doesn't exist
            const categorySlug = record.category
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/[\s_-]+/g, '-')
              .replace(/^-+|-+$/g, '');
              
            const newCategory = await prisma.category.create({
              data: {
                name: record.category,
                slug: categorySlug,
              },
            });
            
            category = newCategory;
            categoriesMap.set(record.category, newCategory);
            console.log(`Created new category: ${record.category}`);
            stats.created.categories++;
          }
        }
        
        // Check if the product already exists (by slug)
        const existingProduct = await prisma.product.findUnique({
          where: {
            slug: record.slug,
          },
        });
        
        if (existingProduct) {
          console.log(`Product with slug ${record.slug} already exists. Skipping.`);
          stats.skipped++;
          continue;
        }
        
        // Process the images
        let images = [];
        if (record.image) {
          // If the image path starts with /images/products/, use it directly
          // Otherwise, we need to add the path
          const imagePath = record.image.startsWith('/images/products/')
            ? record.image
            : `/images/products/${record.image}`;
            
          // Check if the image file exists
          const publicImagePath = path.join(
            process.cwd(),
            'public',
            imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
          );
          
          if (fs.existsSync(publicImagePath)) {
            images.push(imagePath);
          } else {
            console.warn(`Warning: Image file ${publicImagePath} does not exist for product ${record.name}`);
          }
        }
        
        // Parse dates or use current date
        let createdAt = new Date();
        let updatedAt = new Date();
        
        try {
          if (record.createdAt) {
            createdAt = new Date(record.createdAt);
          }
          if (record.updatedAt) {
            updatedAt = new Date(record.updatedAt);
          }
        } catch (e) {
          console.warn(`Warning: Could not parse dates for product ${record.name}, using current date`);
        }
        
        // Parse stock or use default value
        let stock = 1; // Default stock value
        if (record.stock && !isNaN(parseInt(record.stock))) {
          stock = parseInt(record.stock);
        }
        
        // Parse price - exit with error if not a valid number
        const price = parseFloat(record.price);
        if (isNaN(price)) {
          throw new Error(`Invalid price format for product ${record.name}: ${record.price}`);
        }
        
        // Create the product
        await prisma.product.create({
          data: {
            name: record.name,
            slug: record.slug,
            description: record.description || '',
            price: price,
            images: images,
            gallery: [], // No gallery images in the CSV
            artist: record.artist || '',
            stock: stock,
            categoryId: category.id,
            featured: record.featured === 'true',
            createdAt,
            updatedAt,
          },
        });
        
        console.log(`Imported product: ${record.name}`);
        stats.success++;
        stats.created.products++;
      } catch (error) {
        console.error(`Error importing product ${record.name}:`, error);
        stats.errors++;
      }
    }
    
    // Print import summary
    console.log('\n====== Import Summary ======');
    console.log(`Total processed: ${stats.processed}`);
    console.log(`Successfully imported: ${stats.success}`);
    console.log(`Skipped (already exists): ${stats.skipped}`);
    console.log(`Errors: ${stats.errors}`);
    console.log(`New categories created: ${stats.created.categories}`);
    console.log(`New products created: ${stats.created.products}`);
    console.log('============================\n');
    
    console.log('Import completed!');
  } catch (error) {
    console.error('Error importing products:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 