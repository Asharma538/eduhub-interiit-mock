import { Router } from "express";
import { getClassData, getClassWork, postAnnouncement, deleteClass} from "../controllers/class.controller.js";
import authenticateJWT  from "../middlewares/jwt.middleware.js";

const router= Router();


router.get('/',authenticateJWT, getClassData);

router.get('/classwork',authenticateJWT, getClassWork);

// route to post an announcement in a class
router.post('/postAnnouncement',authenticateJWT, postAnnouncement);

router.delete('/',authenticateJWT,deleteClass);

export default router;