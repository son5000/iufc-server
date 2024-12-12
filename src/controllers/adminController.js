import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

// 관리자 로그인 
export const adminLogin = async (req, res) => {
    const { adminId, adminPw } = req.body;
    console.log(req.body);
    try {
      const admin = await prisma.admin.findUnique({
        where: { adminId },
      });
      if (!admin) {
        return res.status(401).json({ message: '해당 아이디는 존재하지 않습니다.' });
      } 
      const isPasswordValid = await bcrypt.compare(adminPw, admin.adminPw);
  
      if (isPasswordValid) {
          // 세션에 사용자 정보 저장
          req.session.admin = { adminId: admin.adminId };  // 세션에 유저 아이디 저장
          console.log(req.session);
          return res.status(200).json({ adminId });
      } else {
          return res.status(401).json({ message: '비밀번호를 다시 확인해 주세요.' });
      }
    } catch (error) {
            console.error(error);
            return res.status(500).json({ message: '서버 연결에 문제가 발생했습니다.' });
        }
  };

  export const usersData = async (req,res) => {
    try{
        const usersData = await prisma.user.findMany({select: {
            favoritPlayer : true,
            selectedJob : true ,
            singleOrMarried : true ,
            advertisement : true ,
            createdAt : true
        }})
        if(usersData.length === 0){
            return res.status(404).send({message : '조회된 데이터가 없습니다.'})
        }
        res.status(200).send(usersData);
    } catch(error){
        console.log(error);
        res.status(404).send({message : error.message})
    }

  }