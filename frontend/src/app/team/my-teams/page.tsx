"use client";

import { useEffect, useState } from "react";
import { getMyTeams } from "@/services/team/team.service";
import Sidebar from "@/components/sidebar/StudentSidebar";
import Topbar from "@/components/dashboard/Topbar";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

type Team = {
  team_id: string;
  department: string;
  max_team_size: number;
  leader_enrollment_id: string;
  members: {
    enrollment_id: string;
    is_leader: boolean;
  }[];
};

export default function MyTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await getMyTeams();
      setTeams(res.teams || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-900 text-slate-900">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar title="My Teams" showSearch />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6">
          {/* Back + Create Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/team")}
              className="uiverse-back-btn"
            >
              ← Back
            </button>

            <button
              onClick={() => router.push("/team/create")}
              className="uiverse-create-btn"
            >
              + Create Team
            </button>
          </div>

          {loading && (
            <div className="text-slate-300">Loading teams...</div>
          )}

          {!loading && teams.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center text-slate-700">
              You are not part of any team yet.
            </div>
          )}

          {!loading && teams.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {teams.map((team) => {
                const leader = team.members.find((m) => m.is_leader);

                return (
                  <div
                    key={team.team_id}
                    className="glass rounded-2xl p-5 category-hover flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate text-slate-900">
                          Team Id: {team.team_id}
                        </h3>
                        <p className="text-sm text-slate-700 truncate">
                          {team.department}
                        </p>
                      </div>
                      <Users className="text-slate-500 shrink-0" />
                    </div>

                    <div className="text-sm text-slate-700 space-y-1 truncate">
                      <p className="truncate">
                        Team Size: {team.members.length}/{team.max_team_size}
                      </p>
                      <p className="truncate">
                        Leader: {leader?.enrollment_id || "-"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {team.members.map((m) => (
                        <span
                          key={m.enrollment_id}
                          className={`px-3 py-1 rounded-full text-xs truncate ${
                            m.is_leader
                              ? "bg-indigo-200 text-indigo-800 font-medium"
                              : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          {m.enrollment_id}
                          {m.is_leader && " (Leader)"}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-3 flex gap-3">
                      <button
                        onClick={() => router.push(`/team/${team.team_id}`)}
                        className="open-pill-btn"
                      >
                        Open
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/team/${team.team_id}/chat`)
                        }
                        className="chat-pill-btn"
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        .glass {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        }

        .category-hover {
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-hover:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.18);
        }

        .uiverse-back-btn,
        .uiverse-create-btn {
          padding: 1em 2.5em;
          font-size: 12px;
          letter-spacing: 2.5px;
          font-weight: 500;
          color: #000;
          background-color: #fff;
          border: none;
          border-radius: 45px;
          box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .uiverse-back-btn:hover {
          background-color: #dc2626;
          box-shadow: 0px 15px 20px rgba(220, 38, 38, 0.45);
          color: #fff;
          transform: translateY(-7px);
        }

        .uiverse-create-btn:hover {
          background-color: #16a34a;
          box-shadow: 0px 15px 20px rgba(22, 163, 74, 0.45);
          color: #fff;
          transform: translateY(-7px);
        }

        .open-pill-btn {
          flex: 1;
          padding: 0.75em 1.6em;
          border-radius: 999px;
          border: 2px solid #2563eb;
          font-size: 13px;
          letter-spacing: 1px;
          font-weight: 500;
          background: #ffffff;
          color: #1e40af;
          cursor: pointer;
          box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.12);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .open-pill-btn:hover {
          background-color: #2563eb;
          color: #fff;
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0px 14px 26px rgba(37, 99, 235, 0.45);
        }

        .chat-pill-btn {
          flex: 1;
          padding: 0.75em 1.6em;
          border-radius: 999px;
          border: 2px solid #6366f1;
          font-size: 13px;
          letter-spacing: 1px;
          font-weight: 500;
          background: #eef2ff;
          color: #312e81;
          cursor: pointer;
          box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.08);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-pill-btn:hover {
          background-color: #6366f1;
          color: #fff;
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0px 14px 26px rgba(99, 102, 241, 0.45);
        }
      `}</style>
    </div>
  );
}
