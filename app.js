import express from 'express';
import session from 'express-session';
import cors from 'cors'
import userRouter from './src/routes/userRoute.js'
import postRouter from './src/routes/postRoute.js'
import adminRouter from './src/routes/adminRoute.js'
import dotenv from 'dotenv'

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// CORS 설정
app.use(cors(
  {
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000'], // Netlify와 로컬 개발 환경 허용
  methods: ['GET', 'POST','DELETE','PATCH'], // 허용할 HTTP 메서드
  credentials: true, // 쿠키 전달 허용
}
))

// 미들웨어 설정
app.use(express.json());  // 요청 본문을 JSON 형태로 파싱

app.use(session({
  secret: 'secret-key', // 세션 암호화에 사용되는 비밀 키
  resave: false,
  saveUninitialized: false,
  cookie: {  // 개발 환경에서는 false로 설정
    secure: true, // 개발 환경에서는 false
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,  // 쿠키의 만료 시간 (24시간)
  }  
}));

// 로킹 미들웨어 모든 요청 로깅
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`); // 요청 메서드와 URL 로깅
  next(); 
});

app.get('/', (req, res) => {
    res.send('Welcome to the Express server!');
});

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});


app.use('/user',userRouter);
app.use('/post',postRouter);
app.use('/admin',adminRouter);

// 서버 실행
app.listen(PORT,() => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

