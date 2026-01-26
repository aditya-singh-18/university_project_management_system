"use client";

import { useRouter } from "next/navigation";
import StatCard from "@/components/dashboard/StatCard";

export default function MentorDashboardPage() {
  const router = useRouter();

  return (
    <>
      {/* 🔹 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Projects"
          value="6"
          bg="from-blue-400 to-blue-600"
          onClick={() => router.push("/mentor/projects")}
        />
        <StatCard
          title="Skill Match Avg"
          value="82%"
          bg="from-emerald-400 to-emerald-600"
        />
        <StatCard
          title="Meetings Today"
          value="2"
          bg="from-amber-400 to-amber-600"
        />
        <StatCard
          title="Success Rate"
          value="91%"
          bg="from-indigo-400 to-indigo-600"
        />
      </div>

      {/* 🔹 Assigned Projects */}
      <div className="glass rounded-2xl p-6 mt-6 category-hover">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Assigned Projects</h2>
          <button
            onClick={() => router.push("/mentor/projects")}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left py-2">Project</th>
                <th className="text-center">Tech Stack</th>
                <th className="text-center">Skill Match</th>
                <th className="text-center">Progress</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              <ProjectRow
                name="Smart LMS"
                tech="React, Node"
                skill={88}
                progress={75}
              />
              <ProjectRow
                name="ML Attendance"
                tech="Python, ML"
                skill={91}
                progress={42}
              />
              <ProjectRow
                name="Campus ERP"
                tech="Next.js, PostgreSQL"
                skill={79}
                progress={60}
              />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ProjectRow({
  name,
  tech,
  skill,
  progress,
}: {
  name: string;
  tech: string;
  skill: number;
  progress: number;
}) {
  return (
    <tr className="border-b last:border-none hover:bg-black/5 transition">
      <td className="py-3 font-medium">{name}</td>
      <td className="text-center text-gray-600">{tech}</td>
      <td className="text-center">{skill}%</td>
      <td className="text-center">{progress}%</td>
      <td className="text-center text-blue-600 cursor-pointer hover:underline">
        View
      </td>
    </tr>
  );
}