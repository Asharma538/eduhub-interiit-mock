import { Router } from "express";
import { getClassData, getClassWork, postAnnouncement, deleteClass, deleteAnnouncement} from "../controllers/class.controller.js";
import authenticateJWT  from "../middlewares/jwt.middleware.js";

const router= Router();


router.get('/',authenticateJWT, getClassData);

router.get('/classwork',authenticateJWT, getClassWork);

// route to post an announcement in a class
router.post('/postAnnouncement',authenticateJWT, postAnnouncement);

router.delete('/deleteClass',authenticateJWT, deleteClass);

router.delete('/deleteAnnouncement',authenticateJWT, deleteAnnouncement);

export default router;