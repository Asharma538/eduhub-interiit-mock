import { Router } from "express";
import { joinClassroom, createClassroom, getClasses, getClassData} from "../controllers/class.controller.js";
import authenticateJWT  from "../middlewares/jwt.middleware.js";

const router= Router();

router.post('/join', authenticateJWT ,joinClassroom);
router.post('/create', authenticateJWT,createClassroom);
router.get('/classes', authenticateJWT, getClasses);
router.get('/classes/:classId',authenticateJWT, getClassData)


export default router;