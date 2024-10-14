import express from "express";
import { postCommentInAnnouncement, postCommentInAssignment, deleteCommentInAnnouncement, deleteCommentInAssignment} from "../controllers/comment.controller.js";
import authenticateJWT  from "../middlewares/jwt.middleware.js";

const router = express.Router({ mergeParams: true });


router.post('/assignments/:assignmentId/comment',authenticateJWT, postCommentInAssignment);
router.post('/announcements/:announcementId/comment',authenticateJWT, postCommentInAnnouncement);

router.delete('/assignments/:assignmentId/comment/:commentId',authenticateJWT, deleteCommentInAssignment);
router.delete('/announcements/:announcementId/comment/:commentId',authenticateJWT, deleteCommentInAnnouncement);

export default router;