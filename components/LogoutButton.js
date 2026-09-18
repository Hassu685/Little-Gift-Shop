"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LogoutButton() {
  const { logout } = useAuth();
  return (
    <button
      onClick={logout}
      className="flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
    >
      <LogOut size={15} />
      Logout
    </button>
  );
}
