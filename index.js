import express from 'express';
import cors from 'cors';
import userRouter from './src/routes/userRoute.js';
import postRouter from './src/routes/postRoute.js';
import adminRouter from './src/routes/adminRoute.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import hpp from 'hpp';
import helmet from 'helmet';


dotenv.config();
const app = express();
const PORT = process.env.PORT;


// 미들웨어 설정
app.use(morgan("combined")); // 모든 요청 로깅 처리
app.use(hpp()); // 잘못된 path 값 수정
app.use(helmet()); // 자동으로 api content header 설정 보안 상승
app.use(express.json());  // 요청 본문을 JSON 형태로 파싱

// CORS 설정
app.use(cors({
  origin: [
    process.env.FRONTEND_URL, 
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'DELETE', 'PATCH'], // 허용할 HTTP 메서드
  credentials: true, // 쿠키 전달 허용
  allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더 설정
}));

app.get('/', (req, res) => {
    res.send('Welcome to the son5000  Express server!');
});

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

 