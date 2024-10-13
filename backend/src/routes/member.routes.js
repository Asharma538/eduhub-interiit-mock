import { Router } from "express";
import { addStudent, addTeacher, getMembers} from "../controllers/member.controller.js";
import authenticateJWT from "../middlewares/jwt.middleware.js";

const router= Router();

router.post('/add/student', authenticateJWT ,addStudent);
router.post('/add/teacher', authenticateJWT,addTeacher);




router.get('/members', authenticateJWT, getMembers);


export default router;