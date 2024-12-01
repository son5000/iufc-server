import express from 'express';
import session from 'express-session';
import cors from 'cors'
import userRouter from './src/routes/userRoute.js'
import postRouter from './src/routes/postRoute.js'
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

app.use('/user',userRouter);
app.use('/post',postRouter)



// 서버 실행
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
