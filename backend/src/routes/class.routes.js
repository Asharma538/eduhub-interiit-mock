import { Router } from "express";
import { getClassData, getClassWork, deleteClass} from "../controllers/class.controller.js";
import authenticateJWT  from "../middlewares/jwt.middleware.js";

const router = Router({ mergeParams: true });


router.get('/',authenticateJWT, getClassData);

// route to get the classwork of a class
router.get('/classwork', authenticateJWT, getClassWork);

// route to post an announcement in a class

router.delete('/',authenticateJWT, deleteClass);

export default router;