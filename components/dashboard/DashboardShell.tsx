"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

interface DashboardShellProps {
    children: React.ReactNode;
    userName?: string;
    userEmail?: string;
}

export default function DashboardShell({
    children,
    userName = "Job Seeker",
    userEmail,
}: DashboardShellProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* ── Mobile Overlay Backdrop ── */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
            )}


            <div
                className={`fixed inset-y-0 left-0 z-50 w-70 max-w-full transform transition-transform duration-300 ease-in-out md:hidden ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <Sidebar
                    userName={userName}
                    userEmail={userEmail}
                    isCollapsed={false}
                    onToggle={() => { }}
                    isMobile={true}
                    onMobileClose={() => setIsMobileOpen(false)}
                />
            </div>

            <div
                className={`hidden md:flex flex-col fixed inset-y-0 z-50 transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"
                    }`}
            >
                <Sidebar
                    userName={userName}
                    userEmail={userEmail}
                    isCollapsed={isCollapsed}
                    onToggle={() => setIsCollapsed((prev) => !prev)}
                />
            </div>


            <main
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? "md:pl-20" : "md:pl-64"
                    }`}
            >

                <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="rounded-lg p-2 -ml-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-95 transition-all"
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <Image
                            src="/images/logov2.png"
                            alt="CareerTrack"
                            width={112}
                            height={28}
                            className="w-24 object-contain brightness-0"
                            style={{ height: "auto" }}
                            priority
                        />
                    </div>


                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs border border-indigo-100 shrink-0">
                        {initials}
                    </div>
                </div>

                <div className="flex-1 p-4 sm:p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}