"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    KanbanSquare,
    CalendarDays,
    BarChart3,
    LogOut,
    User,
    PanelLeftClose,
    PanelLeftOpen,
    X
} from "lucide-react";
import { signOut } from "@/app/actions/auth";

const NAV_LINKS = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Applications", href: "/dashboard/applications", icon: Briefcase },
    { name: "Kanban Board", href: "/dashboard/kanban", icon: KanbanSquare },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

interface SidebarProps {
    userName?: string;
    userEmail?: string;
    isCollapsed: boolean;
    onToggle: () => void;
    isMobile?: boolean;
    onMobileClose?: () => void;
}

export default function Sidebar({
    userName = "Job Seeker",
    userEmail = "user@careertrack.com",
    isCollapsed,
    onToggle,
    isMobile,
    onMobileClose
}: SidebarProps) {
    const pathname = usePathname();

    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <aside
            className={`flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 ease-in-out select-none ${isCollapsed && !isMobile ? "w-20" : "w-full md:w-64"
                }`}
        >

            <div className="h-20 flex items-center justify-center px-4 border-b border-slate-800/80 shrink-0 relative">
                {isMobile ? (

                    <>
                        <Link href="/dashboard" className="flex items-center justify-center" onClick={onMobileClose}>
                            <Image
                                src="/images/logov2.png"
                                alt="CareerTrack"
                                width={130}
                                height={32}
                                className="w-32.5 object-contain"
                                style={{ height: "auto" }}
                                priority
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={onMobileClose}
                            aria-label="Close sidebar"
                            className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </>
                ) : isCollapsed ? (

                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label="Expand sidebar"
                        title="Expand sidebar"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/60 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-200"
                    >
                        <PanelLeftOpen className="w-5 h-5" />
                    </button>
                ) : (

                    <>
                        <Link href="/dashboard" className="flex items-center justify-center" aria-label="CareerTrack Dashboard">
                            <Image
                                src="/images/logov2.png"
                                alt="CareerTrack"
                                width={150}
                                height={38}
                                className="w-37.5 object-contain hover:opacity-90 transition-opacity"
                                style={{ height: "auto" }}
                                priority
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={onToggle}
                            aria-label="Collapse sidebar"
                            title="Collapse sidebar"
                            className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <PanelLeftClose className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>


            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 scrollbar-hide">
                {(!isCollapsed || isMobile) && (
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-4 px-3">
                        Menu
                    </div>
                )}

                {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            title={isCollapsed && !isMobile ? link.name : undefined}
                            onClick={() => {
                                if (isMobile && onMobileClose) onMobileClose();
                            }}
                            className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isCollapsed && !isMobile ? "justify-center px-0" : ""
                                } ${isActive
                                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                                }`}
                        >
                            <Icon
                                className={`w-5 h-5 shrink-0 transition-colors ${isActive
                                    ? "text-white"
                                    : "text-slate-400 group-hover:text-slate-300"
                                    }`}
                            />
                            {(!isCollapsed || isMobile) && (
                                <span className="truncate">{link.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-slate-800/80 shrink-0 space-y-2 bg-slate-950/40">
                <div
                    className={`flex items-center gap-3 px-2 py-1.5 rounded-xl ${isCollapsed && !isMobile ? "justify-center px-0" : ""
                        }`}
                >
                    <div
                        title={isCollapsed && !isMobile ? `${userName} (${userEmail})` : undefined}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-semibold text-xs shrink-0 cursor-default"
                    >
                        {initials || <User className="w-4 h-4" />}
                    </div>

                    {(!isCollapsed || isMobile) && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                                {userName}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                                {userEmail}
                            </p>
                        </div>
                    )}
                </div>

                <form action={signOut}>
                    <button
                        type="submit"
                        title={isCollapsed && !isMobile ? "Sign out" : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group ${isCollapsed && !isMobile ? "justify-center px-0" : ""
                            }`}
                    >
                        <LogOut className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-red-400 transition-colors" />
                        {(!isCollapsed || isMobile) && <span>Sign out</span>}
                    </button>
                </form>
            </div>
        </aside>
    );
}