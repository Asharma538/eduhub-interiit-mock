import { Router } from "express";
import authenticateJWT from "../middlewares/jwt.middleware.js";
import {getToDo} from "../controllers/todo.controller.js"

const router= Router()

router.get('/todo',getToDo)

export default router;