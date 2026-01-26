"use client";

import { useState, useEffect, type ReactNode } from "react";
import axios from "@/lib/axios";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import ProjectReviewModal from "@/components/modals/ProjectReviewModal";

interface Project {
  project_id: number | string;
  title: string;
  description: string;
  tech_stack: string[];
  status: string;
  created_at: string;
  approved_at: string | null;
}

export default function MentorAssignedProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchAssignedProjects();
  }, []);

  const fetchAssignedProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/project/mentor/assigned");
      setProjects(response.data.projects || []);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? // @ts-expect-error api error shape
            err.response?.data?.message
          : null;
      setError(message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: ReactNode }> = {
      ASSIGNED_TO_MENTOR: {
        bg: "bg-yellow-100 text-yellow-800",
        text: "Pending Review",
        icon: <Clock size={16} />,
      },
      RESUBMITTED: {
        bg: "bg-blue-100 text-blue-800",
        text: "Resubmitted",
        icon: <AlertCircle size={16} />,
      },
      APPROVED: {
        bg: "bg-green-100 text-green-800",
        text: "Approved",
        icon: <CheckCircle size={16} />,
      },
    };

    const badge = badges[status] || {
      bg: "bg-gray-100 text-gray-800",
      text: status,
      icon: <FileText size={16} />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg}`}
      >
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const calculateSkillMatch = (_techStack: string[]) => {
    // Mock calculation - you can enhance this based on mentor skills
    return Math.floor(Math.random() * (95 - 75 + 1)) + 75;
  };

  const calculateProgress = (status: string, _approvedAt: string | null) => {
    if (status === "APPROVED") return 100;
    if (status === "RESUBMITTED") return 60;
    if (status === "ASSIGNED_TO_MENTOR") return 30;
    return 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading assigned projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Assigned Projects</h1>
        <p className="text-slate-600 mt-1">
          Review and provide feedback on student projects
        </p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* PROJECTS TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg">No projects assigned yet</p>
            <p className="text-slate-400 text-sm mt-2">
              Projects will appear here once admin assigns them to you
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">
                    Project
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">
                    Tech Stack
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">
                    Skill Match
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">
                    Progress
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const skillMatch = calculateSkillMatch(project.tech_stack);
                  const progress = calculateProgress(
                    project.status,
                    project.approved_at
                  );

                  return (
                    <tr
                      key={project.project_id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {project.title}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {project.tech_stack.slice(0, 3).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.tech_stack.length > 3 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                              +{project.tech_stack.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2 w-16">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${skillMatch}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-slate-700">
                            {skillMatch}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2 w-16">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-slate-700">
                            {progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(project.status)}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PROJECT DETAIL MODAL (Coming Soon) */}
      <ProjectReviewModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onReviewSubmitted={fetchAssignedProjects}
      />
    </div>
  );
}
