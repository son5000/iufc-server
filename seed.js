import { PrismaClient  , Prisma } from '@prisma/client';
import { USERS, POST} from './mock.js';

const prisma = new PrismaClient();

const ppost = POST;
console.log(ppost);


async function main() {
  // 기존 데이터 삭제
  await prisma.user.deleteMany();

  // user 목 데이터 삽입
  await Promise.all(
    USERS.map(async (user) => {
      await prisma.user.create({ data: user });
    })
  );
  // post 목 데이터 삽입
  await Promise.all(
    Object.values(POST).map(async (category) => {
      await Promise.all(
        category.map(async (post) => {
          // 'author'가 없는 경우는 기본값으로 null 처리
          const postData = {
            type: post.type, // 수정된 type 값 사용
            title: post.title,
            views: post.views,
            author: post.author || null, // author 필드가 없으면 null로 설정
          };
          // 데이터 삽입
          await prisma.post.create({
            data: postData,
          });
        })
      );
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
