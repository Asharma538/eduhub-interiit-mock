import { Router } from "express";
import { joinClass, createClass, getClasses, getClassData} from "../controllers/class.controller.js";
import { authenticateJWT } from "../middlewares/jwt.middleware.js";

const router= Router();

router.post('/join', authenticateJWT ,joinClass);
router.post('/create', authenticateJWT,createClass);
router.get('/classes', authenticateJWT, getClasses);
router.get('/classes/:classId',authenticateJWT, getClassData)


export default router;