const { PrismaClient } = require('./app/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  try {
    // Export categories
    const categories = await prisma.category.findMany();
    fs.writeFileSync(
      path.join(__dirname, 'categories_export.json'),
      JSON.stringify(categories, null, 2)
    );
    console.log(`Exported ${categories.length} categories to categories_export.json`);

    // Export products
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    
    // Create a simplified version for Firebase
    const firebaseProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      images: product.images,
      gallery: product.gallery || [],
      artist: product.artist,
      stock: product.stock,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      featured: product.featured,
      latest: product.latest,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }));

    fs.writeFileSync(
      path.join(__dirname, 'products_export.json'),
      JSON.stringify(firebaseProducts, null, 2)
    );
    console.log(`Exported ${products.length} products to products_export.json`);
    
    // Also export as Firebase importable format
    const firebaseFormatProducts = {};
    firebaseProducts.forEach(product => {
      firebaseFormatProducts[product.id] = product;
    });
    
    fs.writeFileSync(
      path.join(__dirname, 'firebase_products_export.json'),
      JSON.stringify(firebaseFormatProducts, null, 2)
    );
    console.log(`Exported Firebase format to firebase_products_export.json`);
    
  } catch (error) {
    console.error('Error exporting data:', error);
  }
}

main()
  .catch((e) => {
    console.error('Error in export script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 