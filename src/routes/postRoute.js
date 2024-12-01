import express from "express";
import { getPost } from "../controllers/postController.js";
const router = express.Router();


// 게시판  : 공지사항 , 구단뉴스 , .utd 기자단 , 응원마당 데이터 불러오기
router.get('' , getPost );

export default router;