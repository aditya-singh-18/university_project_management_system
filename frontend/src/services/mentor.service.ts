import axios from "@/lib/axios";

/* GET skills */
export const getMentorSkills = async () => {
  const res = await axios.get("/mentor/skills");
  // Map backend response format to frontend format
  const skills = (res.data?.data || res.data || []).map((s: any) => ({
    id: s.id,
    skill: s.skill_name, // Convert skill_name to skill
    skill_type: s.skill_type
  }));
  return skills;
};

/* ADD skill */
export const addMentorSkill = async (body: { skill: string }) => {
  const res = await axios.post("/mentor/skills", {
    skill_name: body.skill,
    skill_type: "CUSTOM"
  });
  return res.data;
};

/* DELETE skill */
export const deleteMentorSkill = async (skillId: number) => {
  await axios.delete(`/mentor/skills/${skillId}`);
};