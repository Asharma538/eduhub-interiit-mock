import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "./src/routes/auth.routes.js"
import classRouter from "./src/routes/class.routes.js"
import memberRouter from "./src/routes/member.routes.js"
import userRouter from "./src/routes/user.routes.js"
import todoRouter from "./src/routes/todo.routes.js"    

dotenv.config()

const app = express()


const PORT = process.env.PORT || 8080
const URL = process.env.MONGO_URL

app.use(cors())
app.use(express.json())
app.use(authRouter)
app.use(classRouter)
app.use(memberRouter)
app.use(todoRouter)
app.use(userRouter)

mongoose.connect(URL)
.then(()=>{
    console.log("connected to db.");

    app.listen(PORT,()=>{
        console.log("server running.")
    })
}).catch((err)=>{
    console.error("error : ",err);
})
