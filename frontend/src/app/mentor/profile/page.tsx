"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth.store";
import {
  getMentorSkills,
  addMentorSkill,
  deleteMentorSkill,
} from "@/services/mentor.service";
import { Edit, X } from "lucide-react";

/* ================= TYPES ================= */

type Skill = {
  id: number;
  skill: string;
};

/**
 * Mentor-specific user shape
 */
type MentorUser = {
  name: string;
  department?: string;
  designation?: string;
  employee_id?: string;
  official_email?: string;
  contact_number?: string;
  is_active?: boolean;
  role?: "MENTOR";
};

/**
 * Type Guard
 */
function isMentorUser(user: unknown): user is MentorUser {
  return (
    typeof user === "object" &&
    user !== null &&
    "role" in user &&
    (user as Record<string, unknown>).role === "MENTOR"
  );
}

/* ================= PAGE ================= */

export default function MentorProfilePage() {
  const { user } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] =
    useState<Skill | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await getMentorSkills();
        // Handle both array and object with skills property
        const skillsData = Array.isArray(res) ? res : res?.skills || [];
        setSkills(skillsData);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        setSkills([]);
      }
    };
    fetchSkills();
  }, []);

  if (!user || !isMentorUser(user)) return null;

  /* ================= SKILLS ================= */

  const refetchSkills = async () => {
    try {
      const res = await getMentorSkills();
      // Handle both array and object with skills property
      const skillsData = Array.isArray(res) ? res : res?.skills || [];
      setSkills(skillsData);
    } catch (error) {
      console.error("Failed to refetch skills:", error);
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim()) return;

    if (
      skills.some(
        (s) =>
          s.skill.toLowerCase() ===
          newSkill.toLowerCase()
      )
    ) {
      alert("Skill already exists");
      return;
    }

    setSaving(true);
    await addMentorSkill({ skill: newSkill });
    setNewSkill("");
    await refetchSkills();
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    await deleteMentorSkill(deleteTarget.id);
    setSkills((p) =>
      p.filter((s) => s.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
  };

  return (
    <>
      <main className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* HEADER SECTION */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h1>
                <div className="flex flex-col gap-2">
                  <p className="text-lg text-gray-600">
                    <span className="font-semibold">{user.department || "N/A"}</span>
                    {user.designation && ` • ${user.designation}`}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.is_active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <Edit size={16} /> Edit Skills
                </button>
              )}
            </div>
          </div>

          {/* PROFILE DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Info label="Department" value={user.department} />
            <Info label="Designation" value={user.designation} />
            <Info label="Official Email" value={user.official_email} />
            <Info label="Contact Number" value={user.contact_number} />
            <Info label="Employee ID" value={user.employee_id} />
            <Info 
              label="Status" 
              value={user.is_active ? "Active" : "Inactive"} 
            />
          </div>

          {/* SKILLS SECTION */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Skills & Expertise
              </h2>
              <p className="text-gray-600 text-sm">
                {skills.length > 0 
                  ? `${skills.length} skill${skills.length > 1 ? 's' : ''} listed` 
                  : "No skills added yet"}
              </p>
            </div>

            {!editMode && (
              <div>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {skills.map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        {s.skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No skills added yet. Click Edit Skills to add some!</p>
                  </div>
                )}
              </div>
            )}

            {editMode && (
              <div className="space-y-6">
                {/* ADD SKILL INPUT */}
                <div className="flex gap-3">
                  <input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Enter new skill (e.g., React, Python, Cloud Computing)"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <button
                    onClick={addSkill}
                    disabled={saving}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? "Adding..." : "Add Skill"}
                  </button>
                </div>

                {/* CURRENT SKILLS EDIT MODE */}
                {skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Current Skills:</p>
                    <div className="flex flex-wrap gap-3">
                      {skills.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-sm font-medium text-gray-900">{s.skill}</span>
                          <button
                            onClick={() => setDeleteTarget(s)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                            title="Delete skill"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setEditMode(false)}
                    className="border border-gray-300 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg space-y-4">
            <h2 className="text-lg font-semibold text-red-600">
              Delete Skill?
            </h2>
            <p className="text-gray-600">
              Are you sure you want to delete &quot;<strong>{deleteTarget.skill}</strong>&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= HELPERS ================= */

function Info({ label, value }: { label: string; value?: string | boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </p>
      <p className="text-base font-medium text-gray-900 overflow-auto">
        {value ? String(value) : "—"}
      </p>
    </div>
  );
}
