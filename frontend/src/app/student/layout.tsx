"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/store/auth.store";
import { useRouter } from "next/navigation";
//import StudentSidebar from "@/components/sidebar/StudentSidebar";
//import Topbar from "@/components/dashboard/Topbar";

type StudentUser = {
  name: string;
  enrollment_id?: string;
  student_email?: string;
  department?: string;
  role?: "STUDENT";
};

function isStudentUser(user: unknown): user is StudentUser {
  return (
    typeof user === "object" &&
    user !== null &&
    "role" in user &&
    (user as Record<string, unknown>).role === "STUDENT"
  );
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    if (user && isStudentUser(user)) {
      setIsLoading(false);
    } else if (user && !isStudentUser(user)) {
      router.push("/login");
    }
  }, [token, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      <div className="flex-1 flex flex-col">
                {children}
      </div>
    </div>
  );
}
