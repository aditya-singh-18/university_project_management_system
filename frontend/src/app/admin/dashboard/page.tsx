"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalProjects: 0,
    pendingApprovals: 0,
    activeMentors: 0,
  });
  const [pendingProjects, setPendingProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch pending projects
      const projectsRes = await axios.get("/project/admin/pending");
      setPendingProjects(projectsRes.data.projects || []);
      setStats((prev) => ({
        ...prev,
        pendingApprovals: projectsRes.data.count || 0,
      }));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-600 mt-1">Welcome back, Admin! Here's what's happening today.</p>
          </div>
<div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-600 mt-1">Welcome back, Admin! Here's what's happening today.</p>
          </div>

          {/* ================= STAT CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Students"
              value={stats.totalStudents.toString()}
              icon="👥"
              color="blue"
              trend="+12% from last month"
            />
            <StatCard
              title="Active Projects"
              value={stats.totalProjects.toString()}
              icon="📊"
              color="green"
              trend="+8% from last month"
            />
            <StatCard
              title="Pending Approvals"
              value={stats.pendingApprovals.toString()}
              icon="⏳"
              color="yellow"
              trend="Needs attention"
            />
            <StatCard
              title="Active Mentors"
              value={stats.activeMentors.toString()}
              icon="🎓"
              color="purple"
              trend="+3 new this month"
            />
          </div>

          {/* ================= MAIN CONTENT GRID ================= */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* PENDING PROJECTS */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Pending Project Approvals</h2>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                  {stats.pendingApprovals} Pending
                </span>
              </div>

              {loading ? (
                <div className="text-center py-12 text-slate-500">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4">Loading...</p>
                </div>
              ) : pendingProjects.length > 0 ? (
                <div className="space-y-4">
                  {pendingProjects.slice(0, 5).map((project) => (
                    <div
                      key={project.project_id}
                      className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 text-lg mb-2">
                            {project.title}
                          </h3>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-500">
                              📋 {project.project_id}
                            </span>
                            <span className="text-slate-500">
                              📅 {new Date(project.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-semibold transition-all">
                            Review
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-slate-500">No pending approvals</p>
                </div>
              )}
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <QuickActionButton
                  icon="👤"
                  label="Register User"
                  color="blue"
                />
                <QuickActionButton
                  icon="👥"
                  label="Manage Teams"
                  color="green"
                />
                <QuickActionButton
                  icon="🎓"
                  label="Assign Mentors"
                  color="purple"
                />
                <QuickActionButton
                  icon="📊"
                  label="View Reports"
                  color="orange"
                />
                <QuickActionButton
                  icon="⚙️"
                  label="System Settings"
                  color="gray"
                />
              </div>
            </div>
          </div>

          {/* ================= ACTIVITY & STATS ================= */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* RECENT ACTIVITY */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                <ActivityItem
                  icon="✅"
                  title="Project Approved"
                  description="AI Attendance System approved by mentor"
                  time="2 hours ago"
                  color="green"
                />
                <ActivityItem
                  icon="👤"
                  title="New Student Registered"
                  description="John Doe joined Computer Science department"
                  time="5 hours ago"
                  color="blue"
                />
                <ActivityItem
                  icon="🎓"
                  title="Mentor Assigned"
                  description="Dr. Smith assigned to 3 new projects"
                  time="1 day ago"
                  color="purple"
                />
                <ActivityItem
                  icon="📝"
                  title="Project Submitted"
                  description="Smart Parking System submitted for review"
                  time="1 day ago"
                  color="yellow"
                />
              </div>
            </div>

            {/* SYSTEM STATUS */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">System Status</h2>
              
              <div className="space-y-4">
                <StatusItem
                  label="Database"
                  status="Operational"
                  color="green"
                />
                <StatusItem
                  label="Server"
                  status="Operational"
                  color="green"
                />
                <StatusItem
                  label="Email Service"
                  status="Operational"
                  color="green"
                />
                <StatusItem
                  label="Backup"
                  status="Last: 2h ago"
                  color="blue"
                />
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Storage</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Used</span>
                    <span className="font-semibold">2.4 GB / 10 GB</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

/* ================= COMPONENTS ================= */

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
  trend: string;
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-bl-full`}></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-600 font-medium">{title}</p>
          <span className="text-3xl">{icon}</span>
        </div>
        <p className="text-4xl font-bold text-slate-900 mb-2">{value}</p>
        <p className="text-xs text-slate-500">{trend}</p>
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label, color }: { icon: string; label: string; color: string }) {
  const colorClasses: any = {
    blue: 'hover:bg-blue-50 hover:border-blue-300',
    green: 'hover:bg-green-50 hover:border-green-300',
    purple: 'hover:bg-purple-50 hover:border-purple-300',
    orange: 'hover:bg-orange-50 hover:border-orange-300',
    gray: 'hover:bg-slate-50 hover:border-slate-300',
  };

  return (
    <button className={`w-full flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl transition-all ${colorClasses[color]}`}>
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold text-slate-900">{label}</span>
    </button>
  );
}

function ActivityItem({ icon, title, description, time, color }: any) {
  const colorClasses: any = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-all">
      <div className={`w-10 h-10 rounded-full ${colorClasses[color]} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
        <p className="text-xs text-slate-500 mt-2">{time}</p>
      </div>
    </div>
  );
}

function StatusItem({ label, status, color }: any) {
  const colorClasses: any = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200">
      <span className="font-medium text-slate-900">{label}</span>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClasses[color]}`}>
        {status}
      </span>
    </div>
  );
}
