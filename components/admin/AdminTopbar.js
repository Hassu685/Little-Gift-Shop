"use client";

import { Menu, Search, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminTopbar({ onOpenMenu }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-lavender/40 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMenu} className="text-ink/60 lg:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button aria-label="Notifications" className="relative text-ink/60 transition-colors hover:text-primary">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2 border-l border-lavender/40 pl-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-xs font-semibold text-white shadow-soft">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </span>
          <span className="hidden text-sm font-medium text-ink sm:block">{user?.name}</span>
        </div>
        <button onClick={logout} aria-label="Logout" className="text-primary/50 transition-colors hover:text-red-500">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
