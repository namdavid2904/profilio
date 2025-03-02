import express from 'express';
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
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Message routes
router.post('/messages', createMessage);
router.get('/messages', getMessages);
router.put('/messages/:id/read', markMessageAsRead);

// Skills routes
router.get('/skills', getSkills);
router.post('/skills', createSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

export default router;