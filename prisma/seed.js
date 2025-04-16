const { PrismaClient } = require('../app/generated/prisma');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const hashedPassword = await hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@kibido.com' },
      update: {},
      create: {
        email: 'admin@kibido.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('Admin user created:', adminUser);

    // Create categories
    const categories = [
      { name: 'Abstract', slug: 'abstract' },
      { name: 'Moroccan', slug: 'moroccan' },
      { name: 'Minimalist', slug: 'minimalist' },
      { name: 'Nature', slug: 'nature' }
    ];

    for (const categoryData of categories) {
      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { slug: categoryData.slug }
      });

      if (!existingCategory) {
        await prisma.category.create({
          data: categoryData
        });
        console.log(`Created category: ${categoryData.name}`);
      } else {
        console.log(`Category ${categoryData.name} already exists`);
      }
    }

    // Get category IDs
    const allCategories = await prisma.category.findMany();
    const categoryMap = allCategories.reduce((map, category) => {
      map[category.slug] = category.id;
      return map;
    }, {});

    // Create example products
    const products = [
      {
        name: 'Abstract Blue Composition',
        slug: 'abstract-blue-composition',
        description: 'A stunning abstract composition with shades of blue',
        price: 1200,
        images: ['/images/products/collection2.png'],
        stock: 10,
        categoryId: categoryMap['abstract'],
        artist: 'Jane Doe',
        featured: true
      },
      {
        name: 'Moroccan Patterns',
        slug: 'moroccan-patterns',
        description: 'Traditional Moroccan patterns with vibrant colors',
        price: 1500,
        images: ['/images/products/collection1.png'],
        stock: 5,
        categoryId: categoryMap['moroccan'],
        artist: 'Mohammed Ali',
        featured: true
      },
      {
        name: 'Minimalist Composition',
        slug: 'minimalist-composition',
        description: 'Clean lines and subtle colors in a minimalist aesthetic',
        price: 900,
        images: ['/images/products/slideshow1.png'],
        stock: 8,
        categoryId: categoryMap['minimalist'],
        artist: 'Alex Smith',
        featured: false
      },
      {
        name: 'Natural Landscape',
        slug: 'natural-landscape',
        description: 'A breathtaking landscape with natural elements',
        price: 2200,
        images: ['/images/products/slideshow2.png'],
        stock: 3,
        categoryId: categoryMap['nature'],
        artist: 'Sarah Johnson',
        featured: true
      }
    ];

    for (const productData of products) {
      // Check if product exists - don't use 'latest' field
      const existingProduct = await prisma.product.findUnique({
        where: { slug: productData.slug }
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            ...productData,
            price: productData.price.toString(), // Convert to string for Decimal
            gallery: [] // Empty gallery
          }
        });
        console.log(`Created product: ${productData.name}`);
      } else {
        console.log(`Product ${productData.name} already exists`);
      }
    }

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 