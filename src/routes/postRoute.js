import express from "express";
import { getPostList , getPost } from "../controllers/postController.js";

const router = express.Router();


// 게시판  : 공지사항 , 구단뉴스 , .utd 기자단 , 응원마당 데이터 불러오기
router.get('/List' , getPostList );
router.get('/:id' , getPost );

export default router;