import express from "express";
import userauth from "../middlewares/authMiddleware.js";
import { upadteuserController } from "../controllers/userController.js";
//router object
const router=express.Router();
//Get User
//Update User
router.put('/update-user',userauth,upadteuserController)
//export
export default router