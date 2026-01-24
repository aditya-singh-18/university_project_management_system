import {
  getAdminProfileService,
  getAdminSkillsService,
  addAdminSkillService,
  updateAdminSkillService,
  updateAdminProfileService,
  deleteAdminSkillService
} from '../services/admin.service.js';


export const getAdminProfile = async (req, res, next) => {
  try {
    const employeeId = req.user.user_key;

    const profile = await getAdminProfileService(employeeId);

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

export const getAdminSkills = async (req, res, next) => {
  try {
    const employeeId = req.user.user_key;

    const skills = await getAdminSkillsService(employeeId);

    res.json({ success: true, data: skills });
  } catch (err) {
    next(err);
  }
};

export const addAdminSkill = async (req, res, next) => {
  try {
    const employeeId = req.user.user_key;
    const { skill_name, skill_type } = req.body;

    const skill = await addAdminSkillService(
      employeeId,
      skill_name,
      skill_type
    );

    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
};

export const updateAdminSkill = async (req, res, next) => {
  try {
    const employeeId = req.user.user_key;
    const { id } = req.params;
    const { skill_name } = req.body;

    const skill = await updateAdminSkillService(
      employeeId,
      id,
      skill_name
    );

    res.json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
};
export const updateAdminProfile = async (req, res, next) => {
  try {
    const employeeId = req.user.user_key;
    const {
      full_name,
      department,
      designation,
      contact_number
    } = req.body;

    const profile = await updateAdminProfileService(
      employeeId,
      full_name,
      department,
      designation,
      contact_number
    );

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminSkill = async (req, res, next) => {
  try {
    const employeeId = req.user.user_key;
    const { id } = req.params;

    await deleteAdminSkillService(employeeId, id);

    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (err) {
    next(err);
  }
};


// import {
//   getAdminProfileService,
//   assignMentorService,
//   adminRegisterUserService
// } from '../services/admin.service.js';

// /* =========================
//    ADMIN: REGISTER USER
// ========================= */
// export const adminRegisterUser = async (req, res, next) => {
//   try {
//     const result = await adminRegisterUserService(req.body);

//     res.status(201).json({
//       message: 'User registered successfully',
//       data: result
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// /* =========================
//    ADMIN PROFILE
// ========================= */
// export const getAdminProfile = async (req, res, next) => {
//   try {
//     const { employeeId } = req.params;

//     const data = await getAdminProfileService(employeeId);
//     res.json(data);
//   } catch (err) {
//     next(err);
//   }
// };

// /* =========================
//    ASSIGN MENTOR TO PROJECT
// ========================= */
// export const assignMentorController = async (req, res, next) => {
//   try {
//     const { projectId, mentorEmployeeId } = req.body;

//     const result = await assignMentorService({
//       projectId,
//       mentorEmployeeId
//     });

//     res.json({
//       message: 'Mentor assigned successfully',
//       data: result
//     });
//   } catch (err) {
//     next(err);
//   }
// };
