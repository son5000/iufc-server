import redis from 'redis';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

 const redisClient = redis.createClient({
  socket: {
    host:'localhost',
    port:process.env.REDIS_PORT,
  }
})

redisClient.on('connect', () => {
  console.log('Connect to Redis server');
})

redisClient.on('error', (err) => {
  console.log('Error connecting to Redis:', err);
});

redisClient.connect();

const SECRET_KEY = process.env.JWT_SECRET;
const ACCESS_EXPIRATION = 6 * 3600;  // Access Token 만료 시간 6시간
const REFRESH_EXPIRATION = 1440 * 3600;  // Refresh Token 만료 시간 2달

const makeAccessToken = (userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: ACCESS_EXPIRATION });
};

const makeRefreshToken = async (userId) => {
  const refreshToken = uuidv4();
  try {
    await redisClient.setEx('refreshToken:' + refreshToken, REFRESH_EXPIRATION, userId);
    console.log(`refreshToken이 Redis에 저장되었습니다.`);
  } catch (err) {
    console.error('Redis 저장 오류:', err);
  }
  return refreshToken;
};

const makeToken = async (userId) => {
  const accessToken = makeAccessToken(userId);
  const refreshToken = await makeRefreshToken(userId); // 비동기 처리로 대기
  return { accessToken, refreshToken };
};

const deleteToken = async (refreshToken) => {
  // 'refreshToken:' + refreshToken 형식으로 Redis에서 키를 삭제
  const result = await redisClient.del('refreshToken:' + refreshToken);
  return result > 0; // 삭제된 키가 있으면 true 반환
};


const userAccess = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '요청에 Access Token이 포함되지 않았습니다.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // 토큰이 유효하면 유저 정보 반환
    if(decoded){
      res.status(200).json({ userId: decoded.userId });
    } else{
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });  
    }
  } catch (err) {
    console.error("Token verification error:", err);  // 오류 로그 추가
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};


const userRefresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: '요청에 Refresh Token이 포함되지 않았습니다.' });
  }

  try {
    const userId = await new Promise((resolve, reject) => {
      redisClient.get(refreshToken, (err, result) => {
        if (err) { 
          return  reject(err);
        } else if (!result) { 
          return  reject(new Error('유효하지 않거나 만료된 Refresh Token 입니다.')); 
        } else {
          return resolve(result);
        }
      });
    });

    const newAccessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: ACCESS_EXPIRATION });

    res.status(200).json({ accessToken: newAccessToken, userId });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};





export { makeToken , deleteToken, userAccess, userRefresh } 