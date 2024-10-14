import express from "express";
import { postCommentInAnnouncement, postCommentInAssignment} from "../controllers/comment.controller.js";
import authenticateJWT  from "../middlewares/jwt.middleware.js";

const router = express.Router({ mergeParams: true });


router.post('/assignments/:assignmentId/comment',authenticateJWT, postCommentInAssignment);
router.post('/announcements/:announcementId/comment',authenticateJWT, postCommentInAnnouncement);


export default router;