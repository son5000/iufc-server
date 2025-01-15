import express from 'express'
import { userLogin, userLogout, userSignUp, userDuplicatecheck , kakaoLogin, kakaoUserInfo } from '../controllers/userController.js';
import { userAccess, userRefresh } from '../../redis.js';
 const router = express.Router()



// 카카오 로그인
router.post('/kakaoLogin' , kakaoLogin );
// 카카오 유저 정보 불러오기
router.post('/kakaoUserInfo',kakaoUserInfo);
// user login 라우터
router.post('/login' , userLogin );
// user logout 라우터
router.post('/logout', userLogout );
// user signUp 라우터
router.post('/signUp' , userSignUp ) ;
// user id 중복확인  라우터
router.get('/duplicatecheck' , userDuplicatecheck );
// 액세스 토큰 유효성 확인
router.get('/checkingAccessToken',userAccess)
// 리프레쉬 토큰 유효성 확인
router.get('/checkingRefreshToken',userRefresh)


export default router;
