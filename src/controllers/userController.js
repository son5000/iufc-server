import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

// 유저 로그인 
export const userLogin = async (req, res) => {
  const { userId, userPw } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { userId },
    });
    if (!user) {
      return res.status(401).json({ message: '해당 아이디는 존재하지 않습니다.' });
    }
    
    const isPasswordValid = await bcrypt.compare(userPw, user.userPw);

    if (isPasswordValid) {
        // 세션에 사용자 정보 저장
        req.session.user = { userId: user.userId };  // 세션에 유저 아이디 저장
        return res.status(200).json({ userId });
    } else {
        return res.status(401).json({ message: '비밀번호를 다시 확인해 주세요.' });
    }
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 연결에 문제가 발생했습니다.' });
}
};

// 로그아웃 API
export const userLogout = (req, res) => {
  req.session.destroy(  (err) => {
    if (err) {
      return  res.status(500).json({ error: 'Failed to logout' });
    }
     res.status(200).json({ message: 'Logout successful' });
  });
};

//로그인 상태확인 사용자 세션 정보 확인 API
export const userSession =  (req, res) => {
  if (req.session.user) {
    return  res.json({userId : req.session.user.userId});
  } else {
    return  res.status(401).json({ message: '로그인 상태가 아닙니다.' });
  }
}

// 유저 회원가입 

export const userSignUp =  async (req, res) => {
    const { userId, userPw,  address, userPhoneNumber, favoritPlayer, singleOrMarried, selectedJob , advertisement } = req.body;
    try {
      // 중복 검사: 동일한 id가 이미 있는지 확인
      const existingUser = await prisma.user.findUnique({
        where: { userId: userId },
      });
  
      const existingPhoneNumber = await prisma.user.findUnique({
        where: { userPhoneNumber: userPhoneNumber },
      });
  
      if (existingUser) {
        return res.status(400).json({ error: 'This userId is already taken.' });
      }
  
      if (existingPhoneNumber) {
        return res.status(400).json({ error: 'This phoneNumber is already taken.' });
      }
      // 비밀번호 암호화
      const hashedPassword = await bcrypt.hash(userPw, 10);  // 10은 salt rounds
  
      // 중복이 없으면 새 유저 생성
      const newUser = await prisma.user.create({
        data: {
          userId, 
          userPw: hashedPassword, // 암호화된 비밀번호 저장     
          userPhoneNumber,  
          address,
          favoritPlayer,
          selectedJob ,
          singleOrMarried ,
          advertisement ,
        },
      });
  
      res.status(201).json(newUser);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating user' });
    }
  };
  
  // 중복확인 API

export const userDuplicatecheck = async (req, res) => {
    const { userId } = req.query; 
    if (!userId) {
      return res.status(400).json({ message: '사용자 아이디가 필요합니다.' });
    }
    const existence = await prisma.user.findUnique({
      where: { userId },
    });
    if (existence) {
      return res.status(200).json({
        isAvailable: false,
        message: '중복되는 아이디입니다. 다른 아이디를 입력하세요.',
      });
    } else {
      return res.status(200).json({
        isAvailable: true,
        message: '사용 가능한 아이디입니다.',
      });
    }
  };
  
  
  // 모든 user 조회

  export const usersAll =  async (req , res) => {
    const userList = await prisma.user.findMany()
    res.send(userList);
  };
  
  // 특정 user(id) 조회

  export const userUnique = async (req , res) => {
    const { id } = req.params;
    console.log(id)
    const user = await prisma.user.findUnique({
      where : { userId : id}
    })
    res.send(user);
  };
  
  
  