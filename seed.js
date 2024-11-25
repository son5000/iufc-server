import { PrismaClient  , Prisma } from '@prisma/client';
import { USERS,} from './mock.js';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.user.deleteMany();

  // 목 데이터 삽입
  await Promise.all(
    USERS.map(async (user) => {
      await prisma.user.create({ data: user });
    })
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
