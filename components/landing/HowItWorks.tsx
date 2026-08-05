"use client";

import { Plus, LayoutGrid, FileText, Trophy } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const STEPS = [
    {
        id: "01",
        title: "Save the opportunity",
        description:
            "Find a job you like? Instantly log the company name, role, salary range, and job description link into your dashboard before you forget.",
        icon: Plus,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]",
    },
    {
        id: "02",
        title: "Move it through the pipeline",
        description:
            "Drag and drop the application from 'Saved' to 'Applied', 'Screening', and 'Interview' as you progress through the hiring process.",
        icon: LayoutGrid,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    },
    {
        id: "03",
        title: "Prepare and take notes",
        description:
            "Jot down interview questions, research the company, and set follow-up reminders right inside the specific job card.",
        icon: FileText,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        glow: "group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]",
    },
    {
        id: "04",
        title: "Land the job",
        description:
            "Track your offers, negotiate your salary using your stored notes, and finally move that card to the 'Hired' column.",
        icon: Trophy,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative border-t border-white/10 py-24 sm:py-32 overflow-hidden">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-160 w-160 -z-10 bg-white/2 blur-[100px] rounded-full pointer-events-none" />

            <div className="mx-auto max-w-6xl px-6">

                <Reveal variant="fade-up" delay={0} duration={600}>
                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/80">
                                The Process
                            </span>
                        </div>

                        <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
                            <span className="text-white">Four steps to </span>
                            <span className="bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                get hired.
                            </span>
                        </h2>

                        <p className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
                            We removed the friction from job tracking. CareerTrack acts as your personal assistant from application to offer letter.
                        </p>
                    </div>
                </Reveal>

                <div className="relative mx-auto mt-20 max-w-2xl">

                    <div className="absolute left-6.75 sm:left-8.75 top-6 bottom-6 w-px bg-linear-to-b from-blue-500/50 via-orange-500/50 to-emerald-500/50" />

                    <div className="space-y-12 sm:space-y-16">
                        {STEPS.map((step, index) => (
                            <Reveal
                                key={step.id}
                                variant="fade-up"
                                delay={index * 100}
                                duration={600}
                                threshold={0.1}
                            >
                                <div className="group relative flex gap-6 sm:gap-10">

                                    <div className={`relative z-10 flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#09090b] transition-all duration-300 ${step.glow}`}>
                                        <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border ${step.borderColor} ${step.bgColor}`}>
                                            <step.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${step.color}`} strokeWidth={1.75} />
                                        </div>
                                    </div>

                                    <div className="flex-1 pt-2 sm:pt-3">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <span className="text-sm font-bold text-white/20 tracking-wider">
                                                {step.id}
                                            </span>
                                            <h3 className="text-xl sm:text-2xl font-semibold text-white">
                                                {step.title}
                                            </h3>
                                        </div>
                                        <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-foreground/60 transition-colors group-hover:text-foreground/80">
                                            {step.description}
                                        </p>
                                    </div>

                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}