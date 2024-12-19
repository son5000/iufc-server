import express from "express";
import { adminLogin, usersData, adminLogout, usersAll, userUnique, playerData, playerUnique } from "../controllers/adminController.js";

const router = express.Router();


router.post('/logout',adminLogout);
router.post('/login', adminLogin);
router.get('/userData',usersData);
router.get('/usersAll' , usersAll);
router.post('/userUnique' , userUnique);
router.get('/playerData',playerData);
router.post('/playerUnique',playerUnique);
export default router;