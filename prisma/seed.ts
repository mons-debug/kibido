import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@kibido.com' },
      update: {},
      create: {
        email: 'admin@kibido.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created:', admin);

    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Electronics' },
        update: {},
        create: { name: 'Electronics' },
      }),
      prisma.category.upsert({
        where: { name: 'Clothing' },
        update: {},
        create: { name: 'Clothing' },
      }),
      prisma.category.upsert({
        where: { name: 'Books' },
        update: {},
        create: { name: 'Books' },
      }),
      prisma.category.upsert({
        where: { name: 'Home & Kitchen' },
        update: {},
        create: { name: 'Home & Kitchen' },
      }),
    ]);
    console.log('Categories created successfully');

    // Create products
    const products = await Promise.all([
      prisma.product.upsert({
        where: { id: 'prod-1' },
        update: {},
        create: {
          id: 'prod-1',
          name: 'Wireless Headphones',
          description: 'Premium wireless headphones with noise cancellation',
          price: 149.99,
          stock: 50,
          categoryId: categories[0].id,
          images: ['/products/headphones.jpg'],
          featured: true,
        },
      }),
      prisma.product.upsert({
        where: { id: 'prod-2' },
        update: {},
        create: {
          id: 'prod-2',
          name: 'Smart Watch',
          description: 'Track your fitness and stay connected',
          price: 199.99,
          stock: 30,
          categoryId: categories[0].id,
          images: ['/products/smartwatch.jpg'],
          featured: true,
        },
      }),
    ]);
    console.log('Products created successfully');

    // Create a customer
    const customer = await prisma.customer.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
    });
    console.log('Customer created successfully');

    // Create an order
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        status: 'DELIVERED',
        total: 149.99,
        items: {
          create: {
            productId: products[0].id,
            quantity: 1,
            price: 149.99,
          },
        },
      },
    });
    console.log('Order created successfully');
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 