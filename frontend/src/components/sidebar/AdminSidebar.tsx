"use client";

import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  Building2,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "User Management", icon: Users, path: "/admin/users" },
  { label: "Project Oversight", icon: FolderKanban, path: "/admin/projects" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { label: "Department Performance", icon: Building2, path: "/admin/departments" },
  { label: "Approvals", icon: CheckSquare, path: "/admin/approvals" },
  { label: "System Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        h-screen
        ${collapsed ? "w-[72px]" : "w-64"}
        min-w-[72px]
        bg-[#243b63]
        text-white
        flex
        flex-col
        p-3
        shrink-0
        transition-all
        duration-300
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <h1 className="text-sm font-bold flex items-center gap-2 truncate">
            <span className="text-xl">U</span> UNIVERSITY
          </h1>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="p-1 rounded-md hover:bg-white/20 transition"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const active =
            pathname === item.path ||
            pathname.startsWith(item.path + "/");

          return (
            <div
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`
                group
                flex
                items-center
                gap-3
                px-3
                py-2
                rounded-lg
                cursor-pointer
                transition
                ${
                  active
                    ? "bg-[#1b2f4f] border-l-4 border-white"
                    : "hover:bg-[#1b2f4f]/70"
                }
              `}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm truncate">{item.label}</span>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
