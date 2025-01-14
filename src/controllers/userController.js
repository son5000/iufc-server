import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'
import { makeToken, deleteToken } from "../../redis.js";
const prisma = new PrismaClient();

// 카카오 access_token 발급
export const kakaoLogin = async (req,res) => {
  console.log(req.body);
  const   code   = req.body.ACCESS_KEY;
  if(!code){
    console.log('액세스 키가 없습니다.')
    return res.status(400).json({message : 'ACCESS_KEY가 필요합니다.'});
  } 

  const data = {
    grant_type : 'authorization_code',
    client_id :  '458b4fe6ffff263f6868c1ce53e45011',
    code,
  }

  const queryString = Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');

  try {
    const getKakaoToken = await fetch(`https://kauth.kakao.com/oauth/token` , {
      method : 'POST',
      headers : {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body : queryString
    }
    )

    const Token = await getKakaoToken.json();

    if(getKakaoToken.ok){
      console.log(Token);
    }else{
      console.error('카카오 API 요청 실패 : ', Token);
    }

  } catch(error){
    console.log(error);
  }

}


// 로그인 
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
      const Token = await makeToken(userId);
        return res.status(200).json(Token);
    } else {
        return res.status(401).json({ message: '비밀번호를 다시 확인해 주세요.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 연결에 문제가 발생했습니다.' });
  }
};

// 로그아웃 API
export const userLogout = async (req, res) => {
  const {refreshToken} = req.body;
  if(!refreshToken){
    return res.status(400).json({message : '요청에 RefreshToken이 포함되지 않았습니다.'})
  }
  try {
    const isDeleted = await deleteToken(refreshToken);
    if(isDeleted){
      return res.status(200).json({message : "로그아웃에 성공했습니다."});
    }else{
      return res.status(400).json({message : "RefreshToken 삭제에 실패했습니다."})
    }
    
  } catch (error) {
    console.log(`로그아웃 API : ${error}`)
    return res.status(500).json({message : "서버 오류로 로그아웃 실패"})
  }
};

// 회원가입 
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
        return res.status(400).json({ error: '중복되는 아이디입니다..' });
      }
  
      if (existingPhoneNumber) {
        return res.status(400).json({ error: "이 전화번호는 이미 다른 계정에 등록되어 있습니다. 번호를 확인하거나, 새 번호를 입력해 주세요"});
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
      res.status(500).json({ error: '에러가 발생했습니다.' });
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



  
  
  
  