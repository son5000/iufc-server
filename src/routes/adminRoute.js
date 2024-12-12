import express from "express";
import { adminLogin, usersData } from "../controllers/adminController.js";

const router = express.Router();


router.post('/login', adminLogin);
router.get('/userData',usersData);

export default router;