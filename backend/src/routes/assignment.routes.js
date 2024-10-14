import express from 'express';
import { postAssignment ,getAssignment, deleteAssignment, submitAssignment, getSubmission, getSubmissions} from '../controllers/assignment.controller.js';
import authenticateJWT from '../middlewares/jwt.middleware.js';

const router = express.Router({mergeParams:true})

router.post('/',authenticateJWT, postAssignment);
router.get('/:assignmentId',authenticateJWT,getAssignment);
router.delete('/:assignmentId',authenticateJWT,deleteAssignment);
router.post('/:assignmentId',authenticateJWT,submitAssignment);
router.get('/:assignmentId/submission',authenticateJWT,getSubmission);
router.get('/:assignmentId/submissions',authenticateJWT,getSubmissions);

export default router