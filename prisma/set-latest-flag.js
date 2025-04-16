const { PrismaClient } = require('../app/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting to mark products as latest...');
    
    // Get the first 4 products from the database
    const products = await prisma.product.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Found ${products.length} products to mark as latest`);
    
    // Update each product to set the latest flag
    for (const product of products) {
      await prisma.product.update({
        where: { id: product.id },
        data: { latest: true }
      });
      console.log(`Marked product "${product.name}" (${product.id}) as latest`);
    }
    
    console.log('Successfully updated products');
  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 