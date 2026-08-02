"use client";

import { Files, HelpCircle, BellOff, TrendingDown } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const PROBLEMS = [
    {
        icon: Files,
        title: "Scattered across five different places",
        description:
            "A spreadsheet here, your inbox there, sticky notes on your desk — and none of them agree on what actually happened.",
    },
    {
        icon: HelpCircle,
        title: "No idea what stage you're really in",
        description:
            "Applied two weeks ago or two months ago? Was that call the screen or the technical round? Impossible to say without digging.",
    },
    {
        icon: BellOff,
        title: "Missed follow-ups, forgotten interviews",
        description:
            "Without reminders, promising leads go cold and interviews get missed simply because nothing was tracking the clock.",
    },
    {
        icon: TrendingDown,
        title: "No visibility into what's working",
        description:
            "No way to see your response rate, where applications stall, or whether your search strategy is actually paying off.",
    },
];

export default function ProblemSection() {
    return (
        <section id="problems" className="relative border-t border-white/10 py-20 sm:py-28 overflow-hidden">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-80 w-160 -z-10 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="mx-auto max-w-6xl px-6">

                {/* Header */}
                <Reveal variant="fade-up" delay={0} duration={600}>
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/80">
                                The problem
                            </span>
                        </div>

                        <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Job hunting shouldn&apos;t feel like a <span className="text-red-400">second, disorganized job.</span>
                        </h2>

                        <p className="mt-4 text-base leading-relaxed text-foreground/60 sm:text-lg">
                            Most job seekers track applications the same way they always
                            have — badly, and across too many tools to count.
                        </p>
                    </div>
                </Reveal>

                {/* Problem cards grid */}
                <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 shadow-2xl">
                    {PROBLEMS.map(({ icon: Icon, title, description }, index) => (
                        <Reveal
                            key={title}
                            variant="fade-up"
                            delay={index * 80}
                            duration={600}
                            threshold={0.1}
                        >
                            <div className="bg-background p-8 transition-colors hover:bg-white/2 h-full">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 shadow-sm">
                                    <Icon className="h-5 w-5 text-red-400" strokeWidth={1.75} />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold text-white">
                                    {title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                                    {description}
                                </p>

                                <div className="mt-6 flex items-center gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="h-1 flex-1 rounded-full border border-dashed border-white/20"
                                        />
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}