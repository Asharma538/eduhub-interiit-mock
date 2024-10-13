import { Router } from "express";
import { getClassData, getClassWork, postAnnouncement, deleteClass, deleteAnnouncement} from "../controllers/class.controller.js";
import authenticateJWT  from "../middlewares/jwt.middleware.js";

const router = Router({ mergeParams: true });


router.get('/:classId',authenticateJWT, getClassData);

// route to get the classwork of a class
router.get('/:classId/classwork', authenticateJWT, getClassWork);

// route to post an announcement in a class
router.post('/:classId/announcements/post',authenticateJWT, postAnnouncement);

router.delete('/deleteClass',authenticateJWT, deleteClass);

router.delete('/deleteAnnouncement',authenticateJWT, deleteAnnouncement);

export default router;