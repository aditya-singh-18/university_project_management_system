"use client";

import { useState, useEffect } from "react";
import { Plus, Users, BookOpen, Award, Loader } from "lucide-react";
import UserRegistrationModal from "../../../components/modals/UserRegistrationModal";
import api from "../../../lib/axios";

interface UserStatistics {
  total_users: number;
  total_students: number;
  total_mentors: number;
  total_admins: number;
}

interface User {
  user_key: string;
  email: string;
  role: string;
  full_name?: string;
  department?: string;
  created_at?: string;
  enrollment_id?: string;
  employee_id?: string;
  student_email?: string;
  official_email?: string;
  year?: string;
  division?: string;
  designation?: string;
}

interface PaginatedResponse<T> {
  users?: T[];
  students?: T[];
  mentors?: T[];
  total: number;
  page: number;
  limit: number;
}

export default function UserManagementPage() {
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "students" | "mentors">("all");
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [mentors, setMentors] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await api.get("/admin/users/statistics");
      if (response.data?.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  // Fetch all users
  const fetchAllUsers = async (page: number) => {
    try {
      const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
      if (response.data?.data) {
        setAllUsers(response.data.data.users);
        setTotalPages(Math.ceil(response.data.data.total / limit));
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  // Fetch students
  const fetchStudents = async (page: number) => {
    try {
      const response = await api.get(
        `/admin/users/students?page=${page}&limit=${limit}`
      );
      if (response.data?.data) {
        setStudents(response.data.data.students);
        setTotalPages(Math.ceil(response.data.data.total / limit));
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Fetch mentors
  const fetchMentors = async (page: number) => {
    try {
      const response = await api.get(
        `/admin/users/mentors?page=${page}&limit=${limit}`
      );
      if (response.data?.data) {
        setMentors(response.data.data.mentors);
        setTotalPages(Math.ceil(response.data.data.total / limit));
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchStatistics();
      await fetchAllUsers(1);
      setLoading(false);
    };
    loadData();
  }, []);

  // Fetch when tab changes
  useEffect(() => {
    const loadTabData = async () => {
      setLoading(true);
      setCurrentPage(1);
      if (activeTab === "all") {
        await fetchAllUsers(1);
      } else if (activeTab === "students") {
        await fetchStudents(1);
      } else if (activeTab === "mentors") {
        await fetchMentors(1);
      }
      setLoading(false);
    };
    loadTabData();
  }, [activeTab]);

  // Handle page change
  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    setLoading(true);
    if (activeTab === "all") {
      await fetchAllUsers(newPage);
    } else if (activeTab === "students") {
      await fetchStudents(newPage);
    } else if (activeTab === "mentors") {
      await fetchMentors(newPage);
    }
    setLoading(false);
  };

  const handleUserRegistered = (newUser: Record<string, unknown>) => {
    // Refresh data after registration
    fetchStatistics();
    if (activeTab === "all") {
      fetchAllUsers(currentPage);
    } else if (activeTab === "students") {
      fetchStudents(currentPage);
    } else if (activeTab === "mentors") {
      fetchMentors(currentPage);
    }
  };

  const getCurrentData = () => {
    if (activeTab === "all") return allUsers;
    if (activeTab === "students") return students;
    if (activeTab === "mentors") return mentors;
    return [];
  };

  const currentData = getCurrentData();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-600 mt-1">
          Register and manage system users (Students, Mentors, Admins).
        </p>
      </div>

      {/* ADD USER BUTTON */}
      <div className="flex justify-between items-center">
        <div></div>
        <button
          onClick={() => setRegistrationModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all shadow-lg"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {stats?.total_users || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {stats?.total_students || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BookOpen className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Mentors</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {stats?.total_mentors || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Award className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Admins</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {stats?.total_admins || 0}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* USER LIST */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* TABS */}
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === "all"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Users ({stats?.total_users || 0})
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === "students"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Students ({stats?.total_students || 0})
          </button>
          <button
            onClick={() => setActiveTab("mentors")}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === "mentors"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Mentors ({stats?.total_mentors || 0})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-blue-600" size={32} />
            <span className="ml-2 text-slate-600">Loading data...</span>
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No users found</p>
            <p className="text-slate-400 text-sm mt-2">
              Click "Add User" to register your first user
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">
                      User ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">
                      Email
                    </th>
                    {activeTab === "all" && (
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">
                        Role
                      </th>
                    )}
                    {activeTab === "students" && (
                      <>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">
                          Department
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">
                          Year
                        </th>
                      </>
                    )}
                    {activeTab === "mentors" && (
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">
                        Designation
                      </th>
                    )}
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">
                      Registered
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((user, idx) => (
                    <tr
                      key={user.user_key || idx}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {user.user_key}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {user.full_name || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {user.email || user.student_email || user.official_email}
                      </td>
                      {activeTab === "all" && (
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === "STUDENT"
                                ? "bg-blue-100 text-blue-700"
                                : user.role === "MENTOR"
                                ? "bg-purple-100 text-purple-700"
                                : user.role === "ADMIN"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                      )}
                      {activeTab === "students" && (
                        <>
                          <td className="py-3 px-4 text-slate-700">
                            {user.department || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {user.year || "N/A"}
                          </td>
                        </>
                      )}
                      {activeTab === "mentors" && (
                        <td className="py-3 px-4 text-slate-700">
                          {user.designation || "N/A"}
                        </td>
                      )}
                      <td className="py-3 px-4 text-slate-600 text-sm">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* USER REGISTRATION MODAL */}
      <UserRegistrationModal
        isOpen={registrationModalOpen}
        onClose={() => setRegistrationModalOpen(false)}
        onUserRegistered={handleUserRegistered}
      />
    </div>
  );
}
