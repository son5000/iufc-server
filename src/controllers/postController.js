import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// notice 데이터 제공

export const getPost = async (req, res) => {
    const { offset, count, type } = req.query;  // type을 req.query에서 가져옵니다.
    
    if (!type) {
      return res.status(400).send({ message: 'type 파라미터가 필요합니다.' });
    }
  
    try {
      const posts = await prisma.post.findMany({
        where: { type },  // type을 필터로 사용
        orderBy: {
          createdAt: 'desc',
        },
        skip: parseInt(offset),
        take: parseInt(count),
      });
  
      if (posts.length === 0) {
        return res.status(400).send({ message: '조회된 데이터가 없습니다.' });
      } else {
        return res.status(200).send(posts);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: '서버 오류가 발생했습니다.' });
    }
  };
