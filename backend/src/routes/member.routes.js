import { Router } from "express";
import { addStudent, addTeacher, getMembers, deleteMember, getTeachers, getStudents} from "../controllers/member.controller.js";
import authenticateJWT from "../middlewares/jwt.middleware.js";

const router= Router();

router.post('/add/student', authenticateJWT ,addStudent);
router.post('/add/teacher', authenticateJWT,addTeacher);

router.get('/teachers',authenticateJWT,getTeachers);
router.get('/students',authenticateJWT,getStudents);

router.get('/members', authenticateJWT, getMembers);

router.delete('/:memberMail',authenticateJWT,deleteMember);
export default router;