import express from 'express';
import session from 'express-session';
import cors from 'cors'
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000', // 프론트엔드 주소 (React 개발 서버)
  methods: ['GET', 'POST'], // 허용할 HTTP 메서드
  credentials: true, // 쿠키 전달 허용
}))

// 미들웨어 설정
app.use(express.json());  // 요청 본문을 JSON 형태로 파싱
app.use(session({
  secret: 'secret-key', // 세션 암호화에 사용되는 비밀 키
  resave: false,
  saveUninitialized: false,
  cookie: {  // 개발 환경에서는 false로 설정
    secure: false, // 개발 환경에서는 false
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,  // 쿠키의 만료 시간 (24시간)
  }  
}));

app.post('/signup', async (req, res) => {
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
      return res.status(400).json({ error: 'This userId is already taken.' });
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
});

// 로그인 API
app.post('/login', async (req, res) => {
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
});

//로그인 사용자 세션 정보 확인 API
app.get('/session' , (req, res) => {
  if (req.session.user) {
    return res.json({userId : req.session.user.userId});
  } else {
    return res.status(401).json({ message: '로그인 상태가 아닙니다.' });
  }
})


// 모든 user 조회
app.get('/userList' , async (req , res) => {
  const userList = await prisma.user.findMany()
  res.send(userList);
})

app.get('/userList/:id' , async (req , res) => {
  const { id } = req.params;
  console.log(id)
  const user = await prisma.user.findUnique({
    where : { userId : id}
  })
  res.send(user);
})

// 로그인된 사용자 정보 가져오기 (세션 확인)
app.get('/me', (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user); // 세션에 저장된 사용자 정보 반환
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// 로그아웃 API
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

// 로그인 상태 확인
app.get('/isLoggedIn', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ message: 'User is logged in', user: req.session.user });
  } else {
    res.status(401).json({ message: 'User is not logged in' });
  }
});


// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
