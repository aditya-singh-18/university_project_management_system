"use client";

import Sidebar from "@/components/sidebar/StudentSidebar";
import Topbar from "@/components/dashboard/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-300 text-slate-900">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar title="Student Dashboard" showSearch />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6">
          {/* ================= STATS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat-wrap">
              <StatCard
                title="Project Status"
                value="In Progress"
                bg="bg-gradient-to-r from-blue-400 to-blue-600"
                onClick={() => router.push("/project")}
              />
            </div>

            <div className="stat-wrap">
              <StatCard
                title="Progress % "
                value="65%"
                bg="bg-gradient-to-r from-emerald-400 to-emerald-600"
                onClick={() => router.push("/progress")}
              />
            </div>

            <div className="stat-wrap">
              <StatCard
                title="My Mentor"
                value="Dr. Bela Shah"
                bg="bg-gradient-to-r from-indigo-400 to-indigo-600"
                onClick={() => router.push("/mentor")}
              />
            </div>

            <div className="stat-wrap">
              <StatCard
                title="Deadline"
                value="15 Days Left"
                bg="bg-gradient-to-r from-amber-400 to-amber-600"
                onClick={() => router.push("/timeline")}
              />
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[60vh]">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div
                onClick={() => router.push("/progress")}
                className="glass rounded-2xl p-6 category-hover cursor-pointer flex-1"
              >
                <h3 className="font-semibold mb-4 truncate text-slate-900">
                  Project Progress
                </h3>
                <div className="h-full flex items-center justify-center text-slate-500 truncate">
                  Progress chart - Backend connection left
                </div>
              </div>

              <div
                onClick={() => router.push("/ai")}
                className="glass rounded-2xl p-6 category-hover cursor-pointer"
              >
                <h3 className="font-semibold mb-3 truncate text-slate-900">
                  AI Suggestions
                </h3>

                {[
                  "Finish API integration",
                  "Optimize database queries",
                  "UI best practices",
                ].map((i) => (
                  <div
                    key={i}
                    className="py-3 px-3 mb-2 rounded-lg text-sm bg-white/60 category-hover truncate text-slate-700"
                  >
                    • {i}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div
                onClick={() => router.push("/updates")}
                className="glass rounded-2xl p-6 category-hover cursor-pointer flex-1"
              >
                <h3 className="font-semibold mb-4 truncate text-slate-900">
                  Recent Updates
                </h3>

                {[
                  "Mentor Feedback – Backend connection left",
                  "Team Meeting – Backend connection left",
                  "Upcoming Milestone – Backend connection left",
                ].map((t, i) => (
                  <div
                    key={i}
                    className="py-3 px-3 mb-2 rounded-lg text-sm category-hover bg-white/60 truncate text-slate-700"
                  >
                    {t}
                  </div>
                ))}
              </div>

              <div
                onClick={() => router.push("/team")}
                className="glass rounded-2xl p-5 category-hover cursor-pointer"
              >
                <h3 className="font-medium mb-2 truncate text-slate-900">
                  Team Collaboration
                </h3>
                <div className="text-slate-600 truncate">
                  Chat / tasks - Backend connection left
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

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
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.18);
        }

        /* ---- StatCard View Button Fix ---- */
        .stat-wrap button {
          margin-top: auto;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.28);
          color: #fff;
          font-size: 13px;
          line-height: 1;
          transition: 0.25s ease;
        }

        .stat-wrap button:hover {
          background: rgba(255, 255, 255, 0.38);
        }
      `}</style>
    </div>
  );
}
