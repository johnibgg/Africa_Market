const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sellers = await prisma.user.findMany({
    where: { role: 'SELLER' },
    select: { id: true, name: true, shopName: true, shopSlug: true }
  });
  console.log('SELLERS:', JSON.stringify(sellers, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
