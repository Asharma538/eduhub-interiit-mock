import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "./routes/authRouter.js"
import cors from "cors"
dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000
const URL = process.env.MONGO_URL

app.use(cors())
app.use(express.json())
app.use('/auth',authRouter)

mongoose.connect(URL)
.then(()=>{
    console.log("connected to db.");

    app.listen(PORT,()=>{
        console.log("server running.")
    })
}).catch((err)=>{
    console.error("error : ",err);
})
