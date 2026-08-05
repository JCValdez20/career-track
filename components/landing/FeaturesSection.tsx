"use client";

import { Kanban, CalendarDays, BarChart3, Files } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function FeaturesSection() {
    return (
        <section id="features" className="relative border-t border-white/10 py-24 sm:py-32 overflow-hidden">

            <div className="absolute top-1/4 left-0 -translate-x-1/2 h-120 w-120 -z-10 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 h-100 w-100 -z-10 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="mx-auto max-w-6xl px-6">

                <Reveal variant="fade-up" delay={0} duration={600}>
                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/80">
                                The Solution
                            </span>
                        </div>

                        <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
                            <span className="bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
                                Everything you need to
                            </span>
                            <br />
                            <span className="text-white">win the offer.</span>
                        </h2>

                        <p className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
                            Ditch the messy spreadsheets. CareerTrack provides a unified, visual pipeline designed specifically for the modern job hunt.
                        </p>
                    </div>
                </Reveal>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">

                    <Reveal variant="fade-up" delay={0} duration={650} threshold={0.1} className="md:col-span-2">
                        <div className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/[0.07]">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                                        <Kanban size={20} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Drag &amp; Drop Pipeline</h3>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-foreground/60 max-w-md">
                                    Visually track applications across custom statuses—from Applied to Screening, Interview, and Hired—at a single glance.
                                </p>
                            </div>

                            <div className="mt-auto pt-10 grid grid-cols-3 gap-4 opacity-70 transition-opacity group-hover:opacity-100">

                                <div className="flex flex-col gap-3 rounded-t-xl bg-black/40 p-4 border-x border-t border-white/5 border-b-0 h-40">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="h-2 w-16 rounded-full bg-white/20" />
                                        <div className="h-2 w-4 rounded-full bg-white/10" />
                                    </div>
                                    <div className="h-20 rounded-md bg-white/10 border border-white/5" />
                                    <div className="h-16 rounded-md bg-white/5 border border-white/5" />
                                </div>

                                <div className="flex flex-col gap-3 rounded-t-xl bg-black/40 p-4 border-x border-t border-white/5 border-b-0 h-40">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="h-2 w-20 rounded-full bg-blue-400/50" />
                                        <div className="h-2 w-4 rounded-full bg-white/10" />
                                    </div>
                                    <div className="h-24 rounded-md bg-blue-500/20 border border-blue-500/30" />
                                </div>

                                <div className="flex flex-col gap-3 rounded-t-xl bg-black/40 p-4 border-x border-t border-white/5 border-b-0 h-40">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="h-2 w-12 rounded-full bg-green-400/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal variant="fade-up" delay={120} duration={650} threshold={0.1}>
                        <div className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/[0.07]">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                                        <CalendarDays size={20} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Interview Calendar</h3>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                                    Monitor your monthly schedule and application timeline history so you never miss a technical round.
                                </p>
                            </div>

                            <div className="mt-auto pt-10 flex flex-col gap-3 opacity-70 transition-opacity group-hover:opacity-100">
                                <div className="flex flex-col rounded-t-xl bg-black/40 p-4 border-x border-t border-white/5 border-b-0 h-32">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-2 w-20 rounded-full bg-white/20" />
                                        <div className="flex gap-1.5">
                                            <div className="h-2 w-2 rounded-full bg-white/10" />
                                            <div className="h-2 w-2 rounded-full bg-white/10" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1.5">
                                        {[...Array(14)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-4 rounded-sm ${i === 4 ? 'bg-purple-500/50' : i === 11 ? 'bg-blue-500/50' : 'bg-white/5'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center gap-3 rounded-lg bg-purple-500/10 p-2.5 border border-purple-500/20">
                                        <div className="h-4 w-4 rounded-sm bg-purple-500/30 shrink-0" />
                                        <div className="h-2 w-1/2 rounded-full bg-purple-400/60" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal variant="fade-up" delay={0} duration={650} threshold={0.1}>
                        <div className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/[0.07]">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                                        <BarChart3 size={20} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Hiring Analytics</h3>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                                    View powerful statistics on your response rates, interview conversions, and overall job hunt performance.
                                </p>
                            </div>

                            <div className="mt-auto pt-10 flex items-end gap-2 h-32 opacity-70 transition-opacity group-hover:opacity-100">
                                {[40, 70, 45, 90, 65].map((height, i) => (
                                    <div
                                        key={i}
                                        className="w-full rounded-t-sm bg-emerald-500/30 transition-all group-hover:bg-emerald-500/50"
                                        style={{ height: `${height}%` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </Reveal>

                    <Reveal variant="fade-up" delay={120} duration={650} threshold={0.1} className="md:col-span-2">
                        <div className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/[0.07]">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
                                        <Files size={20} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Notes &amp; Documents</h3>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-foreground/60 max-w-md">
                                    Write detailed notes and upload resumes, cover letters, and interview prep files directly to each application.
                                </p>
                            </div>

                            <div className="mt-auto pt-10 flex gap-4 opacity-70 transition-opacity group-hover:opacity-100">
                                <div className="flex-1 rounded-t-xl bg-black/40 p-6 border-x border-t border-white/5 border-b-0 h-40 flex flex-col">
                                    <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
                                        <div className="h-8 w-8 rounded-lg bg-white/10" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-3 w-1/4 rounded-full bg-white/30" />
                                            <div className="h-2 w-1/3 rounded-full bg-white/10" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-2 w-full rounded-full bg-white/10" />
                                        <div className="h-2 w-5/6 rounded-full bg-white/10" />
                                    </div>

                                    <div className="mt-auto flex gap-2">
                                        <div className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 border border-white/10">
                                            <div className="h-3 w-3 rounded-sm bg-blue-400/50" />
                                            <div className="h-2 w-12 rounded-full bg-white/20" />
                                        </div>
                                        <div className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 border border-white/10">
                                            <div className="h-3 w-3 rounded-sm bg-orange-400/50" />
                                            <div className="h-2 w-16 rounded-full bg-white/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                </div>
            </div>
        </section>
    );
}