const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const role = process.argv[4] || 'user';

  if (!email || !password) {
    console.log('Usage: node scripts/create-user.js <email> <password> [role]');
    return;
  }

  console.log(`Hashing password for ${email}...`);
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`Upserting user...`);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role
    },
    create: {
      email,
      password: hashedPassword,
      role,
      name: role.charAt(0).toUpperCase() + role.slice(1)
    }
  });

  console.log(`User ${user.email} created/updated with role ${user.role}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
