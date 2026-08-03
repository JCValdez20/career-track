"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    KanbanSquare,
    CalendarDays,
    BarChart3,
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
    X,
    LogOut,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";

export interface SidebarUser {
    name: string;
    email: string;
    avatarUrl?: string | null;
}

const NAV_ITEMS = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { name: "Applications", href: "/dashboard/applications", icon: Briefcase, exact: false },
    { name: "Kanban", href: "/dashboard/kanban", icon: KanbanSquare, exact: false },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays, exact: false },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, exact: false },
];

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function UserAvatar({ user, size = 36 }: { user: SidebarUser; size?: number }) {
    if (user.avatarUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={user.avatarUrl}
                alt={user.name}
                style={{ width: size, height: size }}
                className="rounded-xl object-cover shrink-0"
            />
        );
    }
    return (
        <div
            style={{ width: size, height: size }}
            className="flex items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-semibold shrink-0 select-none"
        >
            {getInitials(user.name)}
        </div>
    );
}

function NavLinks({
    pathname,
    collapsed,
    onNavigate,
}: {
    pathname: string;
    collapsed: boolean;
    onNavigate: () => void;
}) {
    return (
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
            {!collapsed && (
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-4 px-3">
                    Menu
                </div>
            )}
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                    <div key={item.name} className="relative group">
                        <Link
                            href={item.href}
                            onClick={onNavigate}
                            title={collapsed ? item.name : undefined}
                            className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
                                collapsed ? "justify-center" : ""
                            } ${
                                isActive
                                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                            }`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {!collapsed && <span className="truncate">{item.name}</span>}
                        </Link>

                        {/* Tooltip (collapsed desktop only) */}
                        {collapsed && (
                            <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                {item.name}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

export default function Sidebar({ user }: { user: SidebarUser }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Restore persisted collapse state
    useEffect(() => {
        try {
            const saved = localStorage.getItem("ct-sidebar-collapsed");
            if (saved === "true") setCollapsed(true);
        } catch { /* ignore */ }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        try {
            localStorage.setItem("ct-sidebar-collapsed", String(collapsed));
        } catch { /* ignore */ }
    }, [collapsed, mounted]);

    // Close mobile drawer on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Keyboard + scroll-lock while drawer is open
    useEffect(() => {
        if (!mobileOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    return (
        <>
            {/* ════════════════════════════════════════
                MOBILE — fixed topbar
            ════════════════════════════════════════ */}
            <div className="md:hidden fixed top-0 inset-x-0 z-30 h-14 flex items-center justify-between px-4 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
                <button
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                    className="p-2 -ml-2 text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 rounded-lg transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <Link href="/dashboard" aria-label="CareerTrack home">
                    <Image
                        src="/images/logov2.png"
                        alt="CareerTrack"
                        width={112}
                        height={28}
                        className="object-contain"
                        style={{ height: "auto" }}
                        priority
                    />
                </Link>

                <button
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 rounded-xl"
                >
                    <UserAvatar user={user} size={30} />
                </button>
            </div>

            {/* ════════════════════════════════════════
                MOBILE — backdrop
            ════════════════════════════════════════ */}
            <div
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
                className={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                    mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            {/* ════════════════════════════════════════
                MOBILE — slide-in drawer
            ════════════════════════════════════════ */}
            <aside
                className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Drawer header */}
                <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} aria-label="CareerTrack home">
                        <Image
                            src="/images/logov2.png"
                            alt="CareerTrack"
                            width={120}
                            height={30}
                            className="object-contain"
                            style={{ height: "auto" }}
                            priority
                        />
                    </Link>
                    <button
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close menu"
                        className="p-2 text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Drawer user */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800 shrink-0">
                    <UserAvatar user={user} size={40} />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                </div>

                <NavLinks pathname={pathname} collapsed={false} onNavigate={() => setMobileOpen(false)} />

                {/* Drawer footer */}
                <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/40">
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                        >
                            <LogOut className="w-4 h-4 shrink-0" />
                            <span>Sign out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* ════════════════════════════════════════
                DESKTOP — sticky collapsible sidebar
            ════════════════════════════════════════ */}
            <aside
                className={`hidden md:flex flex-col shrink-0 sticky top-0 h-screen bg-slate-900 border-r border-slate-800 text-slate-300 transition-[width] duration-300 ease-in-out overflow-hidden ${
                    collapsed ? "w-[4.5rem]" : "w-64"
                }`}
            >
                {/* Logo + collapse toggle */}
                <div className="h-20 flex items-center justify-center px-4 border-b border-slate-800/80 shrink-0 relative">
                    {collapsed ? (
                        <button
                            type="button"
                            onClick={() => setCollapsed(false)}
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
                                    className="object-contain hover:opacity-90 transition-opacity"
                                    style={{ height: "auto" }}
                                    priority
                                />
                            </Link>
                            <button
                                type="button"
                                onClick={() => setCollapsed(true)}
                                aria-label="Collapse sidebar"
                                title="Collapse sidebar"
                                className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                            >
                                <PanelLeftClose className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>

                {/* User info */}
                <div className={`flex items-center gap-3 py-4 border-b border-slate-800/80 shrink-0 ${collapsed ? "justify-center px-2" : "px-4"}`}>
                    <UserAvatar user={user} size={36} />
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                    )}
                </div>

                <NavLinks pathname={pathname} collapsed={collapsed} onNavigate={() => {}} />

                {/* Sign out */}
                <div className="p-3 border-t border-slate-800/80 shrink-0 bg-slate-950/40">
                    <form action={signOut}>
                        <button
                            type="submit"
                            title={collapsed ? "Sign out" : undefined}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 ${
                                collapsed ? "justify-center" : ""
                            }`}
                        >
                            <LogOut className="w-4 h-4 shrink-0" />
                            {!collapsed && <span>Sign out</span>}
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}