import express from 'express';
import { postAssignment ,getAssignment, deleteAssignment} from '../controllers/assignment.controller.js';
import authenticateJWT from '../middlewares/jwt.middleware.js';

const router = express.Router()

router.get('/postAssignment',authenticateJWT, postAssignment);
router.get('/:assignmentId',authenticateJWT,getAssignment);
// router.post('/:assignmentId',authenticateJWT,postSubmission);

router.delete('/:assignmentId',authenticateJWT,deleteAssignment)
export default router