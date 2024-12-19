import { PrismaClient } from '@prisma/client';
import { USERS, POST, ADMIN , PLAYERS } from './mock.js';
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient();

async function hashPassword(pw) {
  const saltRounds= 10;
  return bcrypt.hash(pw,saltRounds);
}

async function main() {
  // 기존 데이터 삭제
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.player.deleteMany();


  // user 목 데이터 삽입
  await Promise.all(
    USERS.map(async (user) => {
      const hashedPassword = await hashPassword(user.userPw)
      await prisma.user.create({
        data: {
          userId: user.userId,
          userPw: hashedPassword,  // 해시된 비밀번호를 저장
          userPhoneNumber: user.userPhoneNumber,
          address: user.address,
          favoritPlayer: user.favoritPlayer,
          selectedJob: user.selectedJob,
          singleOrMarried: user.singleOrMarried,
          advertisement: user.advertisement,
        },
      });
    })
  );
  // post 목 데이터 삽입
  await Promise.all(
    Object.values(POST).map(async (category) => {
      await Promise.all(
        category.map(async (post) => {
          const postData = {
            type: post.type, // 수정된 type 값 사용
            title: post.title,
            views: post.views,
            author: post.author , 
          };
          // 데이터 삽입
          await prisma.post.create({
            data: postData,
          });
        })
      );
    })
  );

  await Promise.all(
    ADMIN.map( async(admin) => {
      const hashedPassword = await hashPassword(admin.adminPw)
      await prisma.admin.create({
        data:{
          adminId : admin.adminId,
          adminPw : hashedPassword
        }
      })
    })
  )
}

await Promise.all(
  PLAYERS.map(async (player) => {
    await prisma.player.create({
      data: {
        type: player.type,
        backNumber: player.backNumber,
        name: player.name,
        englishName: player.englishName,
        currentTeam: player.currentTeam,
        position: player.position,
      },
    });
  })
);



main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
