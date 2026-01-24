import pool from '../config/db.js'; // ← tum already use kar rahe ho

// ADMIN PROFILE
export const getAdminProfileService = async (employeeId) => {
  const query = `
    SELECT
      employee_id,
      full_name,
      official_email,
      department,
      designation,
      contact_number,
      is_active,
      created_at,
      updated_at
    FROM admin_profiles
    WHERE employee_id = $1
  `;

  const result = await pool.query(query, [employeeId]);

  if (result.rowCount === 0) {
    throw { status: 404, message: 'Admin profile not found' };
  }

  return result.rows[0];
};

// ADMIN SKILLS – GET
export const getAdminSkillsService = async (employeeId) => {
  const query = `
    SELECT id, skill_name, skill_type
    FROM admin_skills
    WHERE employee_id = $1
    ORDER BY created_at DESC
  `;

  const { rows } = await pool.query(query, [employeeId]);
  return rows;
};

// ADMIN SKILLS – ADD
export const addAdminSkillService = async (
  employeeId,
  skill_name,
  skill_type = 'CUSTOM'
) => {
  const query = `
    INSERT INTO admin_skills (employee_id, skill_name, skill_type)
    VALUES ($1, $2, $3)
    RETURNING id, skill_name, skill_type
  `;

  const { rows } = await pool.query(query, [
    employeeId,
    skill_name,
    skill_type
  ]);

  return rows[0];
};

// ADMIN SKILLS – UPDATE
export const updateAdminSkillService = async (
  employeeId,
  id,
  skill_name
) => {
  const query = `
    UPDATE admin_skills
    SET skill_name = $1
    WHERE id = $2 AND employee_id = $3
    RETURNING id, skill_name, skill_type
  `;

  const { rowCount, rows } = await pool.query(query, [
    skill_name,
    id,
    employeeId
  ]);

  if (rowCount === 0) {
    throw { status: 404, message: 'Skill not found' };
  }

  return rows[0];
};
// UPDATE ADMIN PROFILE
export const updateAdminProfileService = async (
  employeeId,
  full_name,
  department,
  designation,
  contact_number
) => {
  const query = `
    UPDATE admin_profiles
    SET
      full_name = $1,
      department = $2,
      designation = $3,
      contact_number = $4,
      updated_at = CURRENT_TIMESTAMP
    WHERE employee_id = $5
    RETURNING
      employee_id,
      full_name,
      official_email,
      department,
      designation,
      contact_number,
      is_active,
      updated_at
  `;

  const { rowCount, rows } = await pool.query(query, [
    full_name,
    department,
    designation,
    contact_number,
    employeeId
  ]);

  if (rowCount === 0) {
    throw { status: 404, message: 'Admin profile not found' };
  }

  return rows[0];
};

// DELETE ADMIN SKILL
export const deleteAdminSkillService = async (employeeId, id) => {
  const query = `
    DELETE FROM admin_skills
    WHERE id = $1 AND employee_id = $2
  `;

  const { rowCount } = await pool.query(query, [id, employeeId]);

  if (rowCount === 0) {
    throw { status: 404, message: 'Skill not found' };
  }
};

// import bcrypt from 'bcryptjs';

// import { getAdminProfileByEmployeeId } from '../repositories/admin.repo.js';
// import {
//   insertUser,
//   insertStudentProfile,
//   insertMentorProfile
// } from '../repositories/admin.repo.js';

// import { insertAdminProfile } from '../repositories/admin.repo.js';
// import { findProjectById, assignMentorToProject } from '../repositories/project.repo.js';

// /* =========================
//    ADMIN: REGISTER USER
// ========================= */
// export const adminRegisterUserService = async (payload) => {
//   const {
//     user_key,
//     role,
//     email,
//     password,
//     profile
//   } = payload;

//   if (!user_key || !role || !email || !password) {
//     throw new Error('Missing required fields');
//   }

//   const password_hash = await bcrypt.hash(password, 10);

//   /* 1️⃣ USERS TABLE */
//   await insertUser({
//     user_key,
//     role,
//     email,
//     password_hash
//   });

//   /* 2️⃣ ROLE PROFILES */
//   if (role === 'STUDENT') {
//     await insertStudentProfile({
//       enrollment_id: user_key,
//       student_email: email,
//       ...profile
//     });
//   }

//   if (role === 'MENTOR') {
//     await insertMentorProfile({
//       employee_id: user_key,
//       official_email: email,
//       ...profile
//     });
//   }

//   if (role === 'ADMIN') {
//     await insertAdminProfile({
//       employee_id: user_key,
//       official_email: email,
//       ...profile
//     });
//   }

//   return {
//     message: 'User registered successfully',
//     user_key,
//     role
//   };
// };

// /* =========================
//    ADMIN PROFILE
// ========================= */
// export const getAdminProfileService = async (employeeId) => {
//   if (!employeeId) {
//     throw new Error('employeeId is required');
//   }

//   const profile = await getAdminProfileByEmployeeId(employeeId);

//   if (!profile) {
//     throw new Error('Admin profile not found');
//   }

//   return profile;
// };

// /* =========================
//    ADMIN: ASSIGN MENTOR
// ========================= */
// export const assignMentorService = async ({
//   projectId,
//   mentorEmployeeId
// }) => {
//   if (!projectId || !mentorEmployeeId) {
//     throw new Error('projectId and mentorEmployeeId are required');
//   }

//   const project = await findProjectById(projectId);
//   if (!project) {
//     throw new Error('Project not found');
//   }

//   if (project.status !== 'PENDING') {
//     throw new Error(
//       `Mentor cannot be assigned in status ${project.status}`
//     );
//   }

//   await assignMentorToProject({
//     projectId,
//     mentorEmployeeId
//   });

//   return {
//     project_id: projectId,
//     mentor_employee_id: mentorEmployeeId,
//     status: 'ASSIGNED_TO_MENTOR'
//   };
// };
