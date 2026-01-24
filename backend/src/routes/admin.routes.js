import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { allowRoles } from '../middlewares/role.middleware.js';
import {
  getAdminProfile,
  getAdminSkills,
  addAdminSkill,
  updateAdminSkill
} from '../controllers/admin.controller.js';
import {
  updateAdminProfile,
  deleteAdminSkill
} from '../controllers/admin.controller.js';
const router = express.Router();

// admin profile
router.get(
  '/profile',
  authenticate,
  allowRoles('ADMIN'),
  getAdminProfile
);

// admin skills
router.get(
  '/skills',
  authenticate,
  allowRoles('ADMIN'),
  getAdminSkills
);

router.post(
  '/skills',
  authenticate,
  allowRoles('ADMIN'),
  addAdminSkill
);

router.put(
  '/skills/:id',
  authenticate,
  allowRoles('ADMIN'),
  updateAdminSkill
);
router.put(
  '/profile',
  authenticate,
  allowRoles('ADMIN'),
  updateAdminProfile
);

// DELETE admin skill
router.delete(
  '/skills/:id',
  authenticate,
  allowRoles('ADMIN'),
  deleteAdminSkill
);

export default router;

// import express from 'express';
// import { authenticate } from '../middlewares/auth.middleware.js';
// import { allowRoles } from '../middlewares/role.middleware.js';
// import {
//   getAdminProfile,
//   assignMentorController,
//   adminRegisterUser   // ✅ correct controller
// } from '../controllers/admin.controller.js';

// const router = express.Router();

// /* =========================
//    ADMIN PROFILE
// ========================= */
// router.get(
//   '/admin/profile/:employeeId',
//   authenticate,
//   allowRoles('ADMIN'),
//   getAdminProfile
// );

// /* =========================
//    ASSIGN MENTOR
// ========================= */
// router.post(
//   '/admin/assign-mentor',
//   authenticate,
//   allowRoles('ADMIN'),
//   assignMentorController
// );

// /* =========================
//    REGISTER USER (ADMIN ONLY)
// ========================= */
// router.post(
//   '/admin/register-user',
//   authenticate,
//   allowRoles('ADMIN'),
//   adminRegisterUser
// );

// export default router;
