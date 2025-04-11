const { PrismaClient } = require('../app/generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function addAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create or update admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@kibido.com' },
      update: {
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        email: 'admin@kibido.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created/updated successfully:');
    console.log(`- Email: admin@kibido.com`);
    console.log(`- Password: admin123`);
    console.log(`- ID: ${admin.id}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAdmin(); 