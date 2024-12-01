 import express from 'express'
 import { userLogin, userSession , userLogout , userSignUp , userDuplicatecheck , usersAll , userUnique } from '../controllers/userController.js';

 const router = express.Router()


// 유저 시점.


// user login 라우터
router.post('/login' , userLogin );
// user logout 라우터
router.post('/logout', userLogout );
// 현재 로그인 상태 확인 ( 세션 정보 확인 ) 라우터
router.get('session' , userSession );
// user signUp 라우터
router.post('/signUp' , userSignUp ) ;
// user id 중복확인  라우터
router.get('/duplicatecheck' , userDuplicatecheck );




// 관리자 시점.

// 모든 유저 조회 라우터
router.get('usersAll' , usersAll);
// 특정 유저 조회 라우터 (id 기반 )
router.get('userUnique' , userUnique);

export default router;
