import express from 'express';
import { postAnnouncement ,deleteAnnouncement} from '../controllers/announcement.controller.js';
import authenticateJWT from '../middlewares/jwt.middleware.js';

const router = express.Router({ mergeParams: true });

router.post('/',authenticateJWT, postAnnouncement);
router.delete('/:announcementId',authenticateJWT, deleteAnnouncement);

export default router