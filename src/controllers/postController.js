import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 게시물목록 데이터 제공

export const getPostList = async (req, res) => {
  const { offset, count, type } = req.query;  

  try {

    const posts = await prisma.post.findMany({
      where: { type },  
      orderBy: {
        createdAt: 'desc',  
      },
      skip: parseInt(offset),  
      take: parseInt(count),  
    });

    if (posts.length === 0) {
      return res.status(404).send({ message: '조회된 데이터가 없습니다.' });
    } else {
      return res.status(200).send(posts); 
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: '서버 오류가 발생했습니다.' });
  }
};

// 특정 게시물 데이터 제공

export const getPost = async (req , res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where : { id : parseInt(id)}
    })
    if(!post){
      return res.status(404).send({message : '조회된 데이터가 없습니다.'})
    }
    return res.status(200).send(post)
  }catch(error){
    console.log(error);
    return res.status(500).send({message : '서버 오류가 발생했습니다.'})
  }
}

  