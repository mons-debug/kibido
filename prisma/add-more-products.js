const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    // Get category IDs
    const allCategories = await prisma.category.findMany();
    const categoryMap = allCategories.reduce((map, category) => {
      map[category.slug] = category.id;
      return map;
    }, {});

    // Create a large number of products
    const categoryIds = Object.values(categoryMap);
    const artists = [
      'Sarah Johnson', 'Mohammed Ali', 'Jane Doe', 'Alex Smith', 
      'Emily Chen', 'Karim Hassan', 'Sofia Gonzalez', 'David Kim',
      'Fatima El-Mansouri', 'Yuki Tanaka', 'Nora Larsen', 'Ahmed Bakir'
    ];
    
    // Product name prefixes
    const prefixes = [
      'Abstract', 'Modern', 'Contemporary', 'Traditional', 'Minimalist', 
      'Elegant', 'Vibrant', 'Moroccan', 'Geometric', 'Floral', 'Urban',
      'Natural', 'Expressive', 'Textured', 'Colorful'
    ];
    
    // Product name suffixes
    const suffixes = [
      'Painting', 'Composition', 'Artwork', 'Masterpiece', 'Creation',
      'Canvas', 'Design', 'Print', 'Illustration', 'Landscape', 'Portrait',
      'Patterns', 'Reflections', 'Series', 'Collection'
    ];

    // Create 90 products
    const productsToCreate = [];

    for (let i = 1; i <= 90; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const name = `${prefix} ${suffix} ${i}`;
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const price = Math.floor(Math.random() * 9000) + 1000; // Random price between 1000 and 10000
      const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
      const artist = artists[Math.floor(Math.random() * artists.length)];
      const featured = Math.random() < 0.2; // 20% chance of being featured
      const latest = Math.random() < 0.1; // 10% chance of being latest
      const stock = Math.floor(Math.random() * 20) + 1; // Random stock between 1 and 20

      // Choose a random image for the product
      const imageIndex = Math.floor(Math.random() * 4) + 1;
      let imagePath;
      
      switch (imageIndex) {
        case 1:
          imagePath = '/images/products/collection1.png';
          break;
        case 2:
          imagePath = '/images/products/collection2.png';
          break;
        case 3:
          imagePath = '/images/products/slideshow1.png';
          break;
        case 4:
          imagePath = '/images/products/slideshow2.png';
          break;
      }

      productsToCreate.push({
        name,
        slug,
        description: `Beautiful ${prefix.toLowerCase()} ${suffix.toLowerCase()} created by ${artist}. Perfect addition to your collection.`,
        price: price.toString(),
        images: [imagePath],
        gallery: [],
        stock,
        categoryId,
        artist,
        featured,
        latest
      });
    }

    // Check for existing products and add new ones
    for (const productData of productsToCreate) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug: productData.slug }
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: productData
        });
        console.log(`Created product: ${productData.name}`);
      } else {
        console.log(`Product ${productData.name} already exists`);
      }
    }

    console.log('Additional products created successfully');
  } catch (error) {
    console.error('Error adding products:', error);
  }
}

main()
  .catch((e) => {
    console.error('Error adding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 