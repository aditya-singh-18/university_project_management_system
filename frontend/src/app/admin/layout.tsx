"use client";

import AdminSidebar from "@/components/sidebar/AdminSidebar";
import AdminTopbar from "../../components/topbar/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
