import { Router } from "express";
import authenticateJWT from "../middlewares/jwt.middleware.js";
import { getProfile } from "../controllers/user.controller.js";

const router= Router()

router.get('/profile',authenticateJWT,getProfile)
