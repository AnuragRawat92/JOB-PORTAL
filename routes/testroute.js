import express from "express";
import { testPostController } from "../controllers/testcontrollers.js";
import userauth from "../middlewares/authMiddleware.js";
//router object
const router=express.Router()
//routes
router.post('/test-post',userauth,testPostController)
//export router
export default router