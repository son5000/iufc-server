import express from "express";
import { adminLogin, usersData, adminLogout } from "../controllers/adminController.js";

const router = express.Router();


router.post('/logout',adminLogout);
router.post('/login', adminLogin);
router.get('/userData',usersData);

export default router;