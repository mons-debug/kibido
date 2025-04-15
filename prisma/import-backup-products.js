const fs = require('fs');
const { PrismaClient } = require('../app/generated/prisma');
const path = require('path');

const prisma = new PrismaClient();

async function importProducts() {
  try {
    console.log('Starting product import from backup...');
    
    // Read the backup file
    const backupFile = fs.readFileSync(path.join(__dirname, '..', 'kibido_database_backup.sql'), 'utf8');
    
    // Get categories from the backup file
    const categoryRegex = /COPY public\."Category"[\s\S]*?\\\.(?=\s*\n)/;
    const categoryMatch = backupFile.match(categoryRegex);
    
    if (!categoryMatch) {
      console.error('Could not find categories in the backup file.');
      return;
    }
    
    // Extract and parse category data
    const categoryData = categoryMatch[0]
      .replace(/COPY public\."Category".*?FROM stdin;\s*/s, '')
      .replace(/\\\./, '')
      .trim()
      .split('\n')
      .map(line => {
        const [id, name, createdAt, updatedAt, slug] = line.split(/\t/);
        return { id, name, slug };
      });
    
    console.log(`Found ${categoryData.length} categories in backup`);
    
    // Ensure categories exist in the database
    for (const category of categoryData) {
      await prisma.category.upsert({
        where: { id: category.id },
        update: {
          name: category.name,
          slug: category.slug
        },
        create: {
          id: category.id,
          name: category.name,
          slug: category.slug
        }
      });
    }
    
    console.log('Categories imported successfully');
    
    // Get products from the backup file
    const productRegex = /COPY public\."Product"[\s\S]*?\\\.(?=\s*\n)/;
    const productMatch = backupFile.match(productRegex);
    
    if (!productMatch) {
      console.error('Could not find products in the backup file.');
      return;
    }
    
    // Extract and parse product data
    const productData = productMatch[0]
      .replace(/COPY public\."Product".*?FROM stdin;\s*/s, '')
      .replace(/\\\./, '')
      .trim()
      .split('\n');
    
    console.log(`Found ${productData.length} products in backup`);
    
    // Import products
    let successCount = 0;
    for (const productLine of productData) {
      try {
        // Split line by tabs but preserve the actual data
        const parts = productLine.split('\t');
        
        if (parts.length < 13) {
          console.error('Invalid product data format:', productLine);
          continue;
        }
        
        const id = parts[0];
        const name = parts[1];
        const description = parts[2] || '';
        const price = parseFloat(parts[3]);
        
        // Parse the array fields
        const imagesMatch = parts[4].match(/{([^}]*)}/);
        const images = imagesMatch ? imagesMatch[1].split(',').map(img => img.replace(/["{}]/g, '')) : [];
        
        const stock = parseInt(parts[5]);
        const categoryId = parts[6];
        const featured = parts[7] === 't';
        const artist = parts[10] || null;
        
        const galleryMatch = parts[11].match(/{([^}]*)}/);
        const gallery = galleryMatch ? galleryMatch[1].split(',').map(img => img.replace(/["{}]/g, '')) : [];
        
        const slug = parts[12] || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        // Create the product
        await prisma.product.upsert({
          where: { id },
          update: {
            name,
            description,
            price,
            images: images.filter(img => img !== ''),
            stock,
            categoryId,
            featured,
            artist,
            gallery: gallery.filter(img => img !== ''),
            slug
          },
          create: {
            id,
            name,
            description,
            price,
            images: images.filter(img => img !== ''),
            stock,
            categoryId,
            featured,
            artist,
            gallery: gallery.filter(img => img !== ''),
            slug
          }
        });
        
        successCount++;
        if (successCount % 10 === 0) {
          console.log(`Imported ${successCount} products so far...`);
        }
      } catch (error) {
        console.error('Error importing product:', error);
      }
    }
    
    console.log(`Successfully imported ${successCount} out of ${productData.length} products`);
    
  } catch (error) {
    console.error('Error importing from backup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importProducts(); 