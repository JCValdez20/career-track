"use client";

import { signOut } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export default function LogoutButton({ collapsed = false }: { collapsed?: boolean }) {
    return (
        <form action={signOut} className="w-full">
            <button
                type="submit"
                title="Sign out"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/60 hover:bg-red-500/10 hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${collapsed ? "justify-center" : ""}`}
            >
                <LogOut className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Sign out</span>}
            </button>
        </form>
    );
}
