import { Router } from "express";
import { joinClassroom, createClassroom, getClasses, getClassData, getClassWork, postAnnouncement, postAssignment} from "../controllers/class.controller.js";
import authenticateJWT  from "../middlewares/jwt.middleware.js";

const router= Router();

router.post('/join', authenticateJWT ,joinClassroom);
router.post('/create', authenticateJWT,createClassroom);
router.get('/classes', authenticateJWT, getClasses);
router.get('/classes/:classId',authenticateJWT, getClassData);
router.get('/classes/:classId/classwork',authenticateJWT, getClassWork);

router.get('/classes/:classId/postAssignment',authenticateJWT, postAssignment);
router.get('/classes/:classId/postAnnouncement',authenticateJWT, postAnnouncement);


export default router;