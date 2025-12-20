import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding roles...');

  // 1. SEED ROLES (WAJIB JALAN DULUAN)
  const roles = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'KADER' },
    { id: 3, name: 'MOTHER' },
  ];

  for (const role of roles) {
    const result = await prisma.role.upsert({
      where: { id: role.id },
      update: { name: role.name },
      create: role,
    });
    console.log(`✅ Role ${result.name} created/updated`);
  }

  const commonPassword = await bcrypt.hash('admin123', 10);

  // 2. Seed Admin User
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: { passwordHash: commonPassword },
    create: {
      email: 'admin@test.com',
      name: 'Super Admin',
      passwordHash: commonPassword,
      phone: '0811111111',
      isActive: true,
      roles: { create: [{ roleId: 1 }] },
    },
  });
  console.log('✅ Admin user ready');

  // 3. Seed Kader User
  await prisma.user.upsert({
    where: { email: 'kader@test.com' },
    update: { passwordHash: commonPassword },
    create: {
      email: 'kader@test.com',
      name: 'Petugas Kader',
      passwordHash: commonPassword,
      phone: '0822222222',
      isActive: true,
      roles: { create: [{ roleId: 2 }] },
    },
  });
  console.log('✅ Kader user ready');

  console.log('✨ Seeding finished.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
