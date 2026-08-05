"use client";

import { Zap, Brain, TrendingUp } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const BENEFITS = [
    {
        title: "Move with speed",
        description:
            "Stop wasting time digging through your inbox to find the recruiter's name. When an employer reaches out, you have all the context you need instantly.",
        icon: Zap,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
        glow: "group-hover:shadow-[0_0_30px_rgba(250,204,21,0.15)]",
    },
    {
        title: "Eliminate job hunt anxiety",
        description:
            "No more waking up in a panic wondering if you forgot to reply to an interview request. The system remembers everything so your brain doesn't have to.",
        icon: Brain,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        glow: "group-hover:shadow-[0_0_30px_rgba(96,165,250,0.15)]",
    },
    {
        title: "Negotiate better offers",
        description:
            "By tracking your entire pipeline, you can confidently tell a hiring manager, 'I am currently in final rounds with two other companies.' Leverage is power.",
        icon: TrendingUp,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    },
];

export default function BenefitsSection() {
    return (
        <section id="benefits" className="relative border-t border-white/10 py-24 sm:py-32 overflow-hidden">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-120 w-200 -z-10 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="mx-auto max-w-6xl px-6">

                <Reveal variant="fade-up" delay={0} duration={600}>
                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/80">
                                The Advantage
                            </span>
                        </div>

                        <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
                            <span className="text-white">Give yourself the </span>
                            <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                upper hand.
                            </span>
                        </h2>

                        <p className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
                            Tracking your applications isn&apos;t just about being organized—it&apos;s about staying sharp, moving fast, and maximizing your hiring leverage.
                        </p>
                    </div>
                </Reveal>

                <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {BENEFITS.map((benefit, index) => (
                        <Reveal
                            key={benefit.title}
                            variant="fade-up"
                            delay={index * 100}
                            duration={600}
                            threshold={0.1}
                        >
                            <div
                                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 h-full transition-all duration-300 hover:bg-white/[0.07] hover:-translate-y-1 ${benefit.glow}`}
                            >
                                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${benefit.borderColor} ${benefit.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                                    <benefit.icon className={`h-6 w-6 ${benefit.color}`} strokeWidth={1.75} />
                                </div>

                                <h3 className="mt-6 text-xl font-semibold text-white">
                                    {benefit.title}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-foreground/60 transition-colors group-hover:text-foreground/70">
                                    {benefit.description}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>

            </div>
        </section>
    );
}