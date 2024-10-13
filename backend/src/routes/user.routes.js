import { Router } from "express";
import authenticateJWT from "../middlewares/jwt.middleware.js";
import { getProfile, joinClassroom, createClassroom, getClasses, } from "../controllers/user.controller.js";

const router= Router()

router.post('/join', authenticateJWT ,joinClassroom);

router.post('/create', authenticateJWT,createClassroom);

router.get('/classes', authenticateJWT, getClasses);

router.get('/profile',authenticateJWT,getProfile)
