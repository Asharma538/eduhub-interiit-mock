import { Router } from "express";
import { getClassData, getClassWork, postAnnouncement} from "../controllers/class.controller.js";
import authenticateJWT  from "../middlewares/jwt.middleware.js";

const router= Router();


router.get('/',authenticateJWT, getClassData);

router.get('/classwork',authenticateJWT, getClassWork);
// route to get the classwork of a class
router.get('/classwork', authenticateJWT, getClassWork);

// route to post an announcement in a class
router.post('/postAnnouncement',authenticateJWT, postAnnouncement);


export default router;