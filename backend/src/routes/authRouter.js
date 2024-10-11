import express from "express"
import {googleLogin} from "../controllers/authController.js"

const router = express.Router()

router.get("/test",(req,res)=>{
    res.send("test")
})

router.get('/login',googleLogin)

export default router