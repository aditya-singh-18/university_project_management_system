"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth.store";
import { useEffect, useRef, useState } from "react";
import NotificationDropdown from "../NotificationDropdown";

export default function AdminTopbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔒 Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="h-16 bg-[#2f3f5f] flex items-center justify-between px-6 text-white">
      {/* Left spacer */}
      <div />

      {/* Right actions */}
      <div className="flex items-center gap-4 relative">
        {/* 🔔 Notification */}
        <NotificationDropdown />

        {/* 👤 Avatar + Dropdown */}
        <div ref={dropdownRef} className="relative">
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="cursor-pointer flex items-center gap-2"
          >
            <div className="h-9 w-9 rounded-full bg-white text-[#2f3f5f] flex items-center justify-center font-bold uppercase">
              {user?.name?.charAt(0) || "A"}
            </div>

            <span className="hidden sm:block">
              {user?.name || "Admin"}
            </span>
          </div>

          {/* ⬇️ Dropdown */}
          {open && (
            <div
              className="
                absolute
                right-0
                mt-2
                w-44
                bg-white
                text-gray-700
                rounded-lg
                shadow-lg
                overflow-hidden
                z-50
              "
            >
              <DropdownItem
                icon={<User size={16} />}
                label="Profile"
                onClick={() => {
                  setOpen(false);
                  router.push("/admin/profile");
                }}
              />

              <DropdownItem
                icon={<LogOut size={16} />}
                label="Logout"
                danger
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* 🔹 Dropdown Item */
function DropdownItem({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full
        flex
        items-center
        gap-3
        px-4
        py-2
        text-sm
        text-left
        hover:bg-gray-100
        ${
          danger
            ? "text-red-600 hover:bg-red-50"
            : ""
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
