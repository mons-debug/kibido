const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    // Clear all latest flags first
    await prisma.product.updateMany({
      data: {
        latest: false
      }
    });
    
    console.log('Cleared all latest flags');
    
    // Get 10 random products to mark as latest
    const products = await prisma.product.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Select 10 random products from the result
    const randomProducts = [];
    const productCount = products.length;
    const latestCount = 10;
    
    for (let i = 0; i < latestCount && i < productCount; i++) {
      const randomIndex = Math.floor(Math.random() * products.length);
      randomProducts.push(products[randomIndex]);
      // Remove the selected product to avoid duplicates
      products.splice(randomIndex, 1);
    }
    
    // Mark the selected products as latest
    for (const product of randomProducts) {
      await prisma.product.update({
        where: { id: product.id },
        data: { latest: true }
      });
      console.log(`Marked product as latest: ${product.name}`);
    }
    
    console.log('Latest products updated successfully');
  } catch (error) {
    console.error('Error updating latest products:', error);
  }
}

main()
  .catch((e) => {
    console.error('Error in script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 