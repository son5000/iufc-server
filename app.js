import express from 'express';
import session from 'express-session';
import cors from 'cors';
import userRouter from './src/routes/userRoute.js';
import postRouter from './src/routes/postRoute.js';
import adminRouter from './src/routes/adminRoute.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// CORS 설정
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'https://icutd.netlify.app', 'http://localhost:3000'], // Netlify와 로컬 개발 환경 허용
  methods: ['GET', 'POST', 'DELETE', 'PATCH'], // 허용할 HTTP 메서드
  credentials: true, // 쿠키 전달 허용
  allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더 설정
}));

// 미들웨어 설정
app.use(express.json());  // 요청 본문을 JSON 형태로 파싱

// Express 세션 설정
app.use(session({
  secret: 'secret-key', // 세션 암호화에 사용되는 비밀 키
  resave: false,
  saveUninitialized: false,
  cookie: {  
    secure: true, // 개발 환경에서는 false
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,  // 쿠키의 만료 시간 (24시간)
  }
}));

// HTTP 요청을 HTTPS로 리다이렉트하는 중간 미들웨어 추가
app.use((req, res, next) => {
  if (!req.secure) {
    const secureUrl = `https://${req.headers.host}${req.url}`;
    return res.redirect(301, secureUrl);
  }
  next();
});

// 로깅 미들웨어 모든 요청 로깅
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`); // 요청 메서드와 URL 로깅
  next(); 
});

app.get('/', (req, res) => {
    res.send('Welcome to the Express server!');
});

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/admin', adminRouter);
>>>>>>> 037538f1237e6d4dd91641a4fb9fda49220a6537

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

