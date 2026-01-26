import { getMentorProfileService } from '../services/mentor.service.js';
import {
  getMentorSkillsService,
  addMentorSkillService,
  updateMentorSkillService,
  deleteMentorSkillService,
  getActiveMentorsService
} from '../services/mentor.service.js';

export const getMentorProfile = async (req, res, next) => {
  try {
    const employeeId = req.user.user_key; // ✅ JWT se

    const profile = await getMentorProfileService(employeeId);

    return res.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};




export const getMentorSkills = async (req, res, next) => {
  try {
    const employeeId = req.user.user_key;
    const skills = await getMentorSkillsService(employeeId);
    res.json({ success: true, data: skills });
  } catch (err) {
    next(err);
  }
};

export const addMentorSkill = async (req, res, next) => {
  try {
    const employeeId = req.user.user_key;
    const { skill_name, skill_type } = req.body;

    const skill = await addMentorSkillService(
      employeeId,
      skill_name,
      skill_type
    );

    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
};

export const updateMentorSkill = async (req, res, next) => {
  try {
    const employeeId = req.user.user_key;
    const { id } = req.params;
    const { skill_name } = req.body;

    const skill = await updateMentorSkillService(
      employeeId,
      id,
      skill_name
    );

    res.json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
};

export const deleteMentorSkill = async (req, res, next) => {
  try {
    const employeeId = req.user.user_key;
    const { id } = req.params;

    const skill = await deleteMentorSkillService(
      employeeId,
      id
    );

    res.json({ success: true, data: skill, message: 'Skill deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getActiveMentors = async (req, res, next) => {
  try {
    const mentors = await getActiveMentorsService();
    res.json({ 
      success: true, 
      data: mentors,
      count: mentors.length 
    });
  } catch (err) {
    next(err);
  }
};
