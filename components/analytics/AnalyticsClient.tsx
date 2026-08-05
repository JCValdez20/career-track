"use client";

import { useState, useEffect, useMemo } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    BarChart, Bar
} from "recharts";
import { TrendingUp, Target, Briefcase, Activity, PieChart as PieIcon, BarChart3 } from "lucide-react";
import type { Application } from "@/types/application";

interface AnalyticsClientProps {
    applications: Application[];
}

const STATUS_COLORS = {
    applied: "#6366f1",
    screening: "#0ea5e9",
    interview: "#8b5cf6",
    test: "#f59e0b",
    offer: "#10b981",
    hired: "#22c55e",
    rejected: "#f43f5e",
    withdrawn: "#64748b",
};

export default function AnalyticsClient({ applications }: AnalyticsClientProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const totalApps = applications.length;
    const activeApps = applications.filter(a => !["rejected", "withdrawn", "hired"].includes(a.status)).length;

    const interviewRate = totalApps > 0
        ? ((applications.filter(a => ["interview", "test", "offer", "hired"].includes(a.status)).length / totalApps) * 100).toFixed(1)
        : "0.0";

    const statusData = useMemo(() => {
        const counts = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            color: STATUS_COLORS[name as keyof typeof STATUS_COLORS]
        })).sort((a, b) => b.value - a.value);
    }, [applications]);

    const funnelData = useMemo(() => {
        const applied = applications.length;
        const screening = applications.filter(a => ["screening", "interview", "test", "offer", "hired"].includes(a.status)).length;
        const interview = applications.filter(a => ["interview", "test", "offer", "hired"].includes(a.status)).length;
        const offer = applications.filter(a => ["offer", "hired"].includes(a.status)).length;

        return [
            { name: "Applied", value: applied, fill: "#6366f1" },
            { name: "Screening", value: screening, fill: "#0ea5e9" },
            { name: "Interview", value: interview, fill: "#8b5cf6" },
            { name: "Offer", value: offer, fill: "#10b981" }
        ];
    }, [applications]);

    const timelineData = useMemo(() => {
        const grouped = applications.reduce((acc, app) => {
            const date = new Date(app.applied_date);
            const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

            if (!acc[monthYear]) acc[monthYear] = { name: monthYear, applications: 0 };
            acc[monthYear].applications += 1;
            return acc;
        }, {} as Record<string, { name: string, applications: number }>);

        return Object.values(grouped);
    }, [applications]);

    if (!isMounted) return null;

    return (
        <div className="flex flex-col gap-4 pb-8 lg:flex-1 lg:min-h-0 lg:pb-2">


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-linear-to-b from-card/80 to-card/20 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-500/30">
                    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-500/10 blur-2xl transition-all group-hover:bg-indigo-500/20" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500/20 to-indigo-500/5 text-indigo-400 shadow-inner border border-indigo-500/20">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Total Applications</p>
                            <div className="flex items-baseline gap-2">
                                <h4 className="text-2xl font-bold tracking-tight text-foreground">{totalApps}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-linear-to-b from-card/80 to-card/20 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-violet-500/30">
                    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-violet-500/10 blur-2xl transition-all group-hover:bg-violet-500/20" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500/20 to-violet-500/5 text-violet-400 shadow-inner border border-violet-500/20">
                            <Target size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Interview Rate</p>
                            <div className="flex items-baseline gap-1">
                                <h4 className="text-2xl font-bold tracking-tight text-foreground">{interviewRate}</h4>
                                <span className="text-sm font-semibold text-muted-foreground">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-linear-to-b from-card/80 to-card/20 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-500/30">
                    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover:bg-emerald-500/20" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-400 shadow-inner border border-emerald-500/20">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Active Pipeline</p>
                            <div className="flex items-baseline gap-2">
                                <h4 className="text-2xl font-bold tracking-tight text-foreground">{activeApps}</h4>
                                <span className="flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                                    In Progress
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4 lg:flex-1 lg:min-h-0">


                <div className="col-span-1 lg:row-span-1 rounded-2xl border border-border/50 bg-card/30 p-4 flex flex-col shadow-sm min-h-70 lg:min-h-0">
                    <div className="flex items-center gap-2 mb-2 shrink-0">
                        <div className="p-1 rounded-md bg-sky-500/10 text-sky-400"><BarChart3 size={16} /></div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground leading-none">Conversion Funnel</h3>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }} width={70} />
                                <RechartsTooltip
                                    cursor={false}
                                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", fontSize: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                                />

                                <Bar dataKey="value" name="Applications" radius={[0, 6, 6, 0]} barSize={24} activeBar={{ filter: 'brightness(1.2)' }}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-90 transition-opacity duration-300" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                <div className="col-span-1 lg:row-span-1 rounded-2xl border border-border/50 bg-card/30 p-4 flex flex-col shadow-sm min-h-70 lg:min-h-0">
                    <div className="flex items-center gap-2 mb-2 shrink-0">
                        <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-400"><PieIcon size={16} /></div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground leading-none">Pipeline Distribution</h3>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 flex items-center justify-center relative">
                        {applications.length === 0 ? (
                            <div className="text-xs text-muted-foreground/60 flex items-center gap-2 border border-dashed border-border/40 px-4 py-2 rounded-lg">
                                No applications yet.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={4}
                                        dataKey="value"
                                        nameKey="name"
                                        stroke="none"
                                        cornerRadius={4}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity duration-300" />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", fontSize: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                                        itemStyle={{ color: "hsl(var(--foreground))" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}

                        {applications.length > 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold tracking-tight text-foreground">{totalApps}</span>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mt-0.5">Total</span>
                            </div>
                        )}
                    </div>
                </div>


                <div className="col-span-1 lg:col-span-2 lg:row-span-1 rounded-2xl border border-border/50 bg-card/30 p-4 flex flex-col shadow-sm min-h-70 lg:min-h-0">
                    <div className="flex items-center gap-2 mb-2 shrink-0">
                        <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400"><Activity size={16} /></div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground leading-none">Application Momentum</h3>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0">
                        {timelineData.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground/60 border border-dashed border-border/40 rounded-xl">
                                Not enough data to generate timeline.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", fontSize: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                                        cursor={{ stroke: 'hsl(var(--indigo-500) / 0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="applications"
                                        name="Applications"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorApps)"
                                        activeDot={{ r: 5, fill: "#6366f1", stroke: "hsl(var(--background))", strokeWidth: 3 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}