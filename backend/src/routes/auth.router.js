import express from "express"
import {googleLogin} from "../controllers/auth.controller.js"

const router = express.Router()

router.get('/login',googleLogin)

export default router