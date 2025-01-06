import express from 'express';
import session from 'express-session';
import cors from 'cors';
import userRouter from './src/routes/userRoute.js';
import postRouter from './src/routes/postRoute.js';
import adminRouter from './src/routes/adminRoute.js';
import dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config();
const app = express();
const PORT = 3000;

// 32바이트의 세션 고유 비밀 키 생성
function generateSecretKey() {
  return crypto.randomBytes(32).toString('hex');
}
const secretKey = generateSecretKey();


// CORS 설정
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE', 'PATCH'], // 허용할 HTTP 메서드
  credentials: true, // 쿠키 전달 허용
  allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더 설정
}));

// 미들웨어 설정
app.use(express.json());  // 요청 본문을 JSON 형태로 파싱

// Express 세션 설정
app.use(session({
  secret: secretKey, // 세션 암호화에 사용되는 비밀 키
  resave: false,
  saveUninitialized: false,
  cookie: {  
    secure: true, // 개발 환경에서는 false
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,  // 쿠키의 만료 시간 (24시간)
  }
}));

app.use((req, res, next) => {
  console.log('Request received:', req.method, req.url);
  next();
});

app.get('/', (req, res) => {
    res.send('Welcome to the son5000  Express server!');
});


app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/admin', adminRouter);

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

