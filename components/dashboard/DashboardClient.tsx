"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search, Briefcase, Calendar as CalendarIcon, Award,
    ArrowRight, Clock, MapPin, Building2
} from "lucide-react";
import type { Application, InterviewWithApplication } from "@/types/application";

interface DashboardClientProps {
    applications: Application[];
    upcomingInterviews: InterviewWithApplication[];
}

const STATUS_COLORS = {
    applied: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    screening: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    interview: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    test: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    offer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    hired: "bg-green-500/10 text-green-400 border-green-500/20",
    rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    withdrawn: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function DashboardClient({ applications, upcomingInterviews }: DashboardClientProps) {
    const [searchQuery, setSearchQuery] = useState("");


    const totalApps = applications.length;
    const activeInterviews = applications.filter(a => ["interview", "test"].includes(a.status)).length;
    const offersReceived = applications.filter(a => ["offer", "hired"].includes(a.status)).length;


    const filteredApps = searchQuery.trim() === ""
        ? applications.slice(0, 5)
        : applications.filter(app =>
            app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.position.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 8);

    return (
        <div className="flex flex-col gap-6">


            <div className="relative w-full max-w-2xl">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                    type="text"
                    placeholder="Quick search companies or roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl border border-border/50 bg-card/40 pl-11 pr-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all focus:ring-2 focus:ring-indigo-500/50 focus:bg-card shadow-sm placeholder:text-muted-foreground/70"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border/50 bg-card/30 p-5 flex items-center gap-4 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                        <Briefcase size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Sent</p>
                        <h4 className="text-2xl font-bold text-foreground mt-0.5">{totalApps}</h4>
                    </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/30 p-5 flex items-center gap-4 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                        <CalendarIcon size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Interviews</p>
                        <h4 className="text-2xl font-bold text-foreground mt-0.5">{activeInterviews}</h4>
                    </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/30 p-5 flex items-center gap-4 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Award size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Offers</p>
                        <h4 className="text-2xl font-bold text-foreground mt-0.5">{offersReceived}</h4>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 flex flex-col rounded-2xl border border-border/50 bg-card/30 shadow-sm overflow-hidden min-h-75">
                    <div className="flex items-center justify-between border-b border-border/40 p-5 bg-card/40">
                        <h3 className="text-base font-bold text-foreground">
                            {searchQuery ? "Search Results" : "Recent Updates"}
                        </h3>
                        {!searchQuery && (
                            <Link href="/dashboard/applications" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                                View All <ArrowRight size={14} />
                            </Link>
                        )}
                    </div>

                    <div className="flex flex-col p-2">
                        {filteredApps.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <Building2 size={32} className="mb-3 opacity-20" />
                                <p className="text-sm font-medium">No applications found.</p>
                            </div>
                        ) : (
                            filteredApps.map(app => (
                                <Link
                                    href={`/dashboard/applications?applicationId=${app.id}`}
                                    key={app.id}
                                    className="group flex items-center justify-between gap-4 rounded-xl p-3 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex flex-col min-w-0 gap-1">
                                        <p className="text-sm font-bold text-foreground truncate group-hover:text-indigo-400 transition-colors">
                                            {app.company}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {app.position}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <span className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${STATUS_COLORS[app.status]}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>


                <div className="flex flex-col rounded-2xl border border-border/50 bg-card/30 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between border-b border-border/40 p-5 bg-card/40">
                        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                            <Clock size={16} className="text-indigo-400" />
                            Up Next
                        </h3>
                    </div>

                    <div className="flex flex-col p-4 gap-3">
                        {upcomingInterviews.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                <CalendarIcon size={32} className="mb-3 opacity-20" />
                                <p className="text-sm font-medium">No upcoming interviews.</p>
                                <p className="text-xs mt-1 opacity-70">Keep applying, you got this!</p>
                            </div>
                        ) : (
                            upcomingInterviews.map(interview => {
                                const date = new Date(interview.scheduled_at);
                                const isToday = date.toDateString() === new Date().toDateString();

                                return (
                                    <div key={interview.id} className="flex flex-col gap-2 rounded-xl border border-border/40 bg-card p-4 shadow-sm relative overflow-hidden">

                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />

                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex flex-col min-w-0">
                                                <p className="text-sm font-bold text-foreground truncate">
                                                    {interview.applications?.company}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                    {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Round
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center gap-3 text-xs font-medium text-muted-foreground/80">
                                            <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-md">
                                                <Clock size={12} className={isToday ? "text-emerald-400" : ""} />
                                                <span className={isToday ? "text-emerald-400 font-semibold" : ""}>
                                                    {isToday ? "Today" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                    {", "}
                                                    {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}