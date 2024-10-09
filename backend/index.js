import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

const app = express()

const PORT = 8000
const URI = process.env.MONGO_URI

app.use(express.json())

mongoose.connect(URI)
.then(()=>{
    console.log("connected to db.");

    app.listen(PORT,()=>{
        console.log("server running.")
    })
}).catch((err)=>{
    console.error("error : ",err);
})