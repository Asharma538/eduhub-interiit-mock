import express from 'express';
import { postAssignment ,getAssignment} from '../controllers/assignment.controller.js';
import authenticateJWT from '../middlewares/jwt.middleware.js';

const router = express.Router()

router.get('/postAssignment',authenticateJWT, postAssignment);
router.get('/:assignmentId',authenticateJWT,getAssignment);


export default router