import express from 'express'
import { userLogin, userLogout, userSignUp, userDuplicatecheck } from '../controllers/userController.js';
import { userAccess, userRefresh } from '../../redis.js';
 const router = express.Router()


// 유저 시점.


// user login 라우터
router.post('/login' , userLogin );
// user logout 라우터
router.post('/logout', userLogout );
// user signUp 라우터
router.post('/signUp' , userSignUp ) ;
// user id 중복확인  라우터
router.get('/duplicatecheck' , userDuplicatecheck );

router.get('/checkingAccessToken',userAccess)
router.get('/checkingRefreshToken',userRefresh)


export default router;
