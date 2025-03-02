import express, { RequestHandler } from 'express';
import { 
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  createMessage,
  getMessages,
  markMessageAsRead,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill
} from '../controllers/profilioController';

const router = express.Router();

// Project routes
router.get('/projects', getProjects as RequestHandler);
router.get('/projects/:id', getProjectById as RequestHandler);
router.post('/projects', createProject as RequestHandler);
router.put('/projects/:id', updateProject as RequestHandler);
router.delete('/projects/:id', deleteProject as RequestHandler);

// Message routes
router.post('/messages', createMessage as RequestHandler);
router.get('/messages', getMessages as RequestHandler);
router.put('/messages/:id/read', markMessageAsRead as RequestHandler);

// Skills routes
router.get('/skills', getSkills as RequestHandler);
router.post('/skills', createSkill as RequestHandler);
router.put('/skills/:id', updateSkill as RequestHandler);
router.delete('/skills/:id', deleteSkill as RequestHandler);

export default router;