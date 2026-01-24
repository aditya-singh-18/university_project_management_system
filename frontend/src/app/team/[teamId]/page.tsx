"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/components/sidebar/StudentSidebar";
import Topbar from "@/components/dashboard/Topbar";
import { getTeamById, removeTeamMember } from "@/services/team/team.service";
import { Users } from "lucide-react";

/* ================= TYPES ================= */

type TeamMember = {
  enrollment_id: string;
  is_leader: boolean;
};

type ApiTeamResponse = {
  team_id: string;
  department: string;
  max_team_size: number;
  leader_enrollment_id: string;
  members: TeamMember[];
  projects?: Record<string, unknown>[];
};

/* ================= PAGE ================= */

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params?.teamId as string | undefined;
  const router = useRouter();

  const [team, setTeam] = useState<ApiTeamResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [confirmMember, setConfirmMember] = useState<TeamMember | null>(null);
  const [removing, setRemoving] = useState(false);

  const [myId, setMyId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("enrollmentId");
      setMyId((id || "").trim());
    }
  }, []);

  useEffect(() => {
    if (!teamId) return;
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const fetchTeam = async () => {
    if (!teamId || typeof teamId !== "string") return;
    try {
      const res = await getTeamById(teamId);
      const data = res?.data ?? res;

      const normalized: ApiTeamResponse = {
        ...data.team,
        members: data.members || [],
        projects: data.projects || [],
      };

      setTeam(normalized);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string } | null;
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load team details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!team || !confirmMember) return;

    try {
      setRemoving(true);
      await removeTeamMember(team.team_id, confirmMember.enrollment_id);
      setConfirmMember(null);
      fetchTeam();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string } | null;
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to remove member"
      );
    } finally {
      setRemoving(false);
    }
  };

  const isLeader =
    !!team &&
    !!myId &&
    team.leader_enrollment_id.trim() === myId;

  const locked = !!team?.projects?.length;

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-900 text-[#1f2a44]">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar title={teamId ? `Team ${teamId}` : "Team"} showSearch />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/team/my-teams")}
              className="uiverse-back-btn"
            >
              ← Back
            </button>

            <button
              onClick={() => setEditMode((v) => !v)}
              className="uiverse-edit-btn"
            >
              {editMode ? "Done" : "Edit Team"}
            </button>
          </div>


          {loading && <div className="text-slate-400">Loading team...</div>}

          {error && (
            <div className="rounded-xl border border-red-300 bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          {!loading && team && (
            <div className="glass rounded-2xl p-6 space-y-6 category-hover">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-semibold text-slate-800">
                    Team {team.team_id}
                  </h1>
                  <p className="text-sm text-slate-600">
                    Department: {team.department}
                  </p>
                </div>
                <Users className="text-slate-400" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <Info
                  label="Team Size"
                  value={`${team.members.length} / ${team.max_team_size}`}
                />
                <Info label="Leader" value={team.leader_enrollment_id} />
                <Info
                  label="Status"
                  value={locked ? "Project Submitted" : "Active"}
                />
              </div>

              <div>
                <h3 className="font-medium mb-3 text-slate-800">
                  Team Members
                </h3>

                <div className="flex flex-wrap gap-3">
                  {team.members.map((m) => {
                    const canRemove =
                      editMode && isLeader && !locked && !m.is_leader;

                    return (
                      <div
                        key={m.enrollment_id}
                        onClick={() =>
                          canRemove && setConfirmMember(m)
                        }
                        className={`px-3 py-1 rounded-full text-xs transition cursor-pointer ${
                          m.is_leader
                            ? "bg-indigo-100 text-indigo-700 font-medium"
                            : "bg-slate-100 text-slate-800"
                        } ${
                          canRemove
                            ? "ring-2 ring-red-300 hover:bg-red-100"
                            : ""
                        }`}
                      >
                        {m.enrollment_id}
                        {m.is_leader && " (Leader)"}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {confirmMember && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-90 space-y-4 animate-pop">
            <h3 className="text-lg font-semibold text-slate-800">
              Remove Member?
            </h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to remove{" "}
              <b>{confirmMember.enrollment_id}</b> from this team?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmMember(null)}
                className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleRemove}
                disabled={removing}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {removing ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        }

        .category-hover {
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-hover:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.18);
        }

        .uiverse-back-btn,
        .uiverse-edit-btn {
          padding: 0.8em 2em;
          font-size: 12px;
          letter-spacing: 2px;
          font-weight: 500;
          background: white;
          border-radius: 40px;
          box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .uiverse-back-btn:hover {
          background: #dc2626;
          color: white;
          transform: translateY(-6px);
        }

        .uiverse-edit-btn:hover {
          background: #2563eb;
          color: white;
          transform: translateY(-6px);
        }

        .animate-pop {
          animation: pop 0.25s ease-out;
        }

        @keyframes pop {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/* ================= HELPER ================= */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-lg p-3 bg-slate-50">
      <p className="text-slate-500">{label}</p>
      <p className="font-medium text-slate-800 truncate">{value}</p>
    </div>
  );
}
