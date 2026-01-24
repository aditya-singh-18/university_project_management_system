import {
  findProjectById,
  insertProject,
  assignMentorToProject,
  updateProjectStatusWithFeedback,
  approveProjectByMentor,
  getPendingProjects,
  getProjectsAssignedToMentor,
  resubmitProject,
  editProjectBeforeApproval,
  activateProject,
} from '../repositories/project.repo.js';

import { findTeamById, isTeamLeader } from '../repositories/team.repo.js';

import { getProjectsOfStudent } from '../repositories/project.repo.js';
import { findProjectDetailById } from '../repositories/project.repo.js';
import {
  getTeamMembers,
  isMemberExists,
} from '../repositories/team.repo.js';



/* =========================
   CREATE PROJECT (STUDENT)
========================= */
export const createProjectService = async ({
  teamId,
  title,
  description,
  track,
  techStack,
  requesterEnrollmentId,
}) => {
  // 🔒 BASIC VALIDATION (UPDATED)
  if (!teamId || !title || !description || !track) {
    throw new Error(
      'teamId, title, description and track are required'
    );
  }

  // 🔒 TEAM MUST EXIST
  const team = await findTeamById(teamId);
  if (!team) {
    throw new Error('Team not found');
  }

  // 🔒 ONLY TEAM LEADER CAN CREATE PROJECT
  const leader = await isTeamLeader(teamId, requesterEnrollmentId);
  if (!leader) {
    throw new Error('Only team leader can create project');
  }

  // 🔒 ONLY ONE PROJECT PER TEAM
  const existingProject = await findProjectById(teamId);
  if (existingProject) {
    throw new Error('Project already submitted for this team');
  }

  // ✅ CREATE PROJECT
  await insertProject({
    projectId: teamId,
    title,
    description,
    track,        // ✅ now guaranteed non-null
    techStack,
  });

  return {
    project_id: teamId,
    status: 'PENDING',
  };
};


/* =========================
   STUDENT: PROJECT DETAIL
========================= */
export const getProjectDetailService = async ({
  projectId,
  enrollmentId,
}) => {
  if (!projectId) {
    throw new Error('projectId is required');
  }

  const project = await findProjectDetailById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  // 🔒 SECURITY: student must be part of this team
  const isMember = await isMemberExists(projectId, enrollmentId);
  if (!isMember) {
    throw new Error('You are not authorized to view this project');
  }

  const team = await findTeamById(projectId);
  const members = await getTeamMembers(projectId);

  return {
    project,
    team: {
      team_id: team.team_id,
      department: team.department,
      leader_enrollment_id: team.leader_enrollment_id,
      members,
    },
  };
};

/* =========================
   ADMIN: VIEW PENDING PROJECTS
========================= */
export const getPendingProjectsService = async () => {
  return await getPendingProjects();
};

/* =========================
   ADMIN: ASSIGN MENTOR
========================= */
export const adminAssignMentorService = async ({
  projectId,
  mentorEmployeeId,
}) => {
  if (!projectId || !mentorEmployeeId) {
    throw new Error('projectId and mentorEmployeeId are required');
  }

  const project = await findProjectById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  if (project.status !== 'PENDING') {
    throw new Error(
      `Mentor cannot be assigned in status ${project.status}`
    );
  }

  await assignMentorToProject({
    projectId,
    mentorEmployeeId,
  });

  return {
    project_id: projectId,
    mentor_employee_id: mentorEmployeeId,
    status: 'ASSIGNED_TO_MENTOR',
  };
};

/* =========================
   MENTOR: VIEW ASSIGNED PROJECTS
========================= */
export const getMentorAssignedProjectsService = async (mentorEmployeeId) => {
  if (!mentorEmployeeId) {
    throw new Error('mentorEmployeeId is required');
  }

  return await getProjectsAssignedToMentor(mentorEmployeeId);
};

/* =========================
   HELPER: 24 HOUR CHECK
========================= */
const isWithin24Hours = (approvedAt) => {
  if (!approvedAt) return true;

  const approvedTime = new Date(approvedAt).getTime();
  return Date.now() - approvedTime < 24 * 60 * 60 * 1000;
};

/* =========================
   MENTOR: APPROVE / REJECT
========================= */
export const mentorReviewProjectService = async ({
  projectId,
  action, // APPROVE | REJECT
  mentorFeedback,
  mentorEmployeeId,
}) => {
  if (!projectId || !action) {
    throw new Error('projectId and action are required');
  }

  const project = await findProjectById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  if (project.mentor_employee_id !== mentorEmployeeId) {
    throw new Error('Not authorized to review this project');
  }

  const allowedStatuses = ['ASSIGNED_TO_MENTOR', 'RESUBMITTED', 'APPROVED'];
  if (!allowedStatuses.includes(project.status)) {
    throw new Error(
      `Project cannot be reviewed in status ${project.status}`
    );
  }

  // ⏳ 24h window enforcement
  if (
    project.status === 'APPROVED' &&
    !isWithin24Hours(project.approved_at)
  ) {
    throw new Error(
      '24-hour approval window expired. Contact admin.'
    );
  }

  // ❌ REJECT
  if (action === 'REJECT') {
    if (!mentorFeedback) {
      throw new Error('mentorFeedback is required for rejection');
    }

    await updateProjectStatusWithFeedback({
      projectId,
      status: 'REJECTED',
      mentorFeedback,
    });

    return {
      project_id: projectId,
      status: 'REJECTED',
    };
  }

  // ✅ APPROVE
  if (action === 'APPROVE') {
    await approveProjectByMentor(projectId);

    return {
      project_id: projectId,
      status: 'APPROVED',
      message: 'Approved. Will auto-activate after 24 hours',
    };
  }

  throw new Error('Invalid action');
};

/* =========================
   STUDENT: RESUBMIT PROJECT
========================= */
export const resubmitProjectService = async ({
  projectId,
  title,
  description,
  track,
  techStack,
  requesterEnrollmentId,
}) => {
  if (!projectId || !title || !description) {
    throw new Error('projectId, title and description are required');
  }

  const project = await findProjectById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  if (project.status !== 'REJECTED') {
    throw new Error('Only rejected projects can be resubmitted');
  }

  const leader = await isTeamLeader(projectId, requesterEnrollmentId);
  if (!leader) {
    throw new Error('Only team leader can resubmit project');
  }

  await resubmitProject({
    projectId,
    title,
    description,
    track,
    techStack,
  });

  return {
    project_id: projectId,
    status: 'RESUBMITTED',
  };
};

/* =========================
   STUDENT: EDIT PROJECT (before approval)
========================= */
export const editProjectService = async ({
  projectId,
  title,
  description,
  track,
  techStack,
  requesterEnrollmentId,
}) => {
  if (!projectId || !title || !description || !track) {
    throw new Error('projectId, title, description and track are required');
  }

  const project = await findProjectById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  // 🔒 Only allow editing if not APPROVED or ACTIVE
  if (project.status === 'APPROVED' || project.status === 'ACTIVE') {
    throw new Error('Cannot edit project after it is approved by mentor');
  }

  // 🔒 Only team leader can edit
  const leader = await isTeamLeader(projectId, requesterEnrollmentId);
  if (!leader) {
    throw new Error('Only team leader can edit project');
  }

  await editProjectBeforeApproval({
    projectId,
    title,
    description,
    track,
    techStack,
  });

  return {
    project_id: projectId,
    message: 'Project updated successfully',
  };
};

/* =========================
   STUDENT: MY PROJECTS
========================= */
export const getMyProjectsService = async (enrollmentId) => {
  if (!enrollmentId) {
    throw new Error('enrollmentId is required');
  }

  return await getProjectsOfStudent(enrollmentId);
};


/* =========================
   ADMIN: MANUAL ACTIVATE
========================= */
export const activateProjectService = async ({ projectId }) => {
  if (!projectId) {
    throw new Error('projectId is required');
  }

  const project = await findProjectById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  if (project.status !== 'APPROVED') {
    throw new Error(
      `Project cannot be activated in status ${project.status}`
    );
  }

  await activateProject(projectId);

  return {
    project_id: projectId,
    status: 'ACTIVE',
  };
};
