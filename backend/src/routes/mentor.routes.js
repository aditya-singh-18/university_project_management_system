import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { allowRoles } from '../middlewares/role.middleware.js';
import { getMentorProfile } from '../controllers/mentor.controller.js';

import {
  getMentorSkills,
  addMentorSkill,
  updateMentorSkill,
  deleteMentorSkill
} from '../controllers/mentor.controller.js';

const router = express.Router();

// profile already exists
router.get('/profile', authenticate, allowRoles('MENTOR'), getMentorProfile);
// skills APIs
router.get('/skills', authenticate, allowRoles('MENTOR'), getMentorSkills);
router.post('/skills', authenticate, allowRoles('MENTOR'), addMentorSkill);
router.put('/skills/:id', authenticate, allowRoles('MENTOR'), updateMentorSkill);
router.delete('/skills/:id', authenticate, allowRoles('MENTOR'), deleteMentorSkill);

export default router;
