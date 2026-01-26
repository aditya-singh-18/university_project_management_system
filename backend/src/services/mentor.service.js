import pool from '../config/db.js';

export const getMentorProfileService = async (employeeId) => {
  // mentor profile
  const mentorQuery = `
    SELECT 
      mp.employee_id,
      mp.full_name,
      mp.official_email,
      mp.department,
      mp.designation,
      mp.contact_number,
      mp.is_active,
      mp.created_at
    FROM mentor_profiles mp
    WHERE mp.employee_id = $1
  `;

  const mentorResult = await pool.query(mentorQuery, [employeeId]);

  if (mentorResult.rowCount === 0) {
    throw { status: 404, message: 'Mentor profile not found' };
  }

  // mentor skills
  const skillsQuery = `
    SELECT id, skill_name, skill_type
    FROM mentor_skills
    WHERE employee_id = $1
    ORDER BY created_at DESC
  `;

  const skillsResult = await pool.query(skillsQuery, [employeeId]);

  return {
    ...mentorResult.rows[0],
    skills: skillsResult.rows,
  };
};

// GET skills
export const getMentorSkillsService = async (employeeId) => {
  const query = `
    SELECT id, skill_name, skill_type
    FROM mentor_skills
    WHERE employee_id = $1
    ORDER BY created_at DESC
  `;
  const { rows } = await pool.query(query, [employeeId]);
  return rows;
};

// ADD skill
export const addMentorSkillService = async (
  employeeId,
  skill_name,
  skill_type = 'CUSTOM'
) => {
  const query = `
    INSERT INTO mentor_skills (employee_id, skill_name, skill_type)
    VALUES ($1, $2, $3)
    RETURNING id, skill_name, skill_type
  `;
  const { rows } = await pool.query(query, [
    employeeId,
    skill_name,
    skill_type,
  ]);

  return rows[0];
};

// UPDATE skill
export const updateMentorSkillService = async (
  employeeId,
  id,
  skill_name
) => {
  const query = `
    UPDATE mentor_skills
    SET skill_name = $1
    WHERE id = $2 AND employee_id = $3
    RETURNING id, skill_name, skill_type
  `;
  const { rowCount, rows } = await pool.query(query, [
    skill_name,
    id,
    employeeId,
  ]);

  if (rowCount === 0) {
    throw { status: 404, message: 'Skill not found' };
  }

  return rows[0];
};

// DELETE skill
export const deleteMentorSkillService = async (
  employeeId,
  id
) => {
  const query = `
    DELETE FROM mentor_skills
    WHERE id = $1 AND employee_id = $2
    RETURNING id, skill_name, skill_type
  `;
  const { rowCount, rows } = await pool.query(query, [
    id,
    employeeId,
  ]);

  if (rowCount === 0) {
    throw { status: 404, message: 'Skill not found' };
  }

  return rows[0];
};

// GET ALL ACTIVE MENTORS (FOR ADMIN)
export const getActiveMentorsService = async () => {
  const query = `
    SELECT
      mp.employee_id,
      mp.full_name,
      mp.official_email,
      mp.department,
      mp.designation,
      mp.contact_number,
      mp.is_active,
      mp.created_at,
      COUNT(p.project_id) as assigned_projects
    FROM mentor_profiles mp
    LEFT JOIN projects p
      ON mp.employee_id = p.mentor_employee_id
      AND p.status IN ('ASSIGNED_TO_MENTOR', 'APPROVED', 'ACTIVE')
    WHERE mp.is_active = true
    GROUP BY mp.employee_id
    ORDER BY mp.full_name ASC
  `;
  
  const { rows } = await pool.query(query);
  return rows;
};
