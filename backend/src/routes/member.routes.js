import { Router } from "express";
import { addStudent, addTeacher, getMembers} from "../controllers/member.controller.js";
import authenticateJWT from "../middlewares/jwt.middleware.js";

const router= Router();

router.post('/classes/:classId/add/student', authenticateJWT ,addStudent);
router.post('/classes/:classId/add/teacher', authenticateJWT,addTeacher);
router.get('/classes/:classId/members', authenticateJWT, getMembers);


export default router;