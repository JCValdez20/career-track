"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">

            <div className="absolute inset-0 -z-20 flex items-start justify-center pt-32">
                <div className="h-120 w-160 rounded-full bg-blue-500/10 blur-[120px]" />
            </div>

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 opacity-40 mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "64px 64px",
                }}
            />

            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-12">

                <div>
                    {/* Badge */}
                    <Reveal variant="fade-up" delay={0} duration={600}>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/80">
                                Built for job seekers
                            </span>
                        </div>
                    </Reveal>

                    {/* Headline */}
                    <Reveal variant="fade-up" delay={80} duration={650}>
                        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
                            <span className="bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
                                Never lose track of a
                            </span>
                            <br />
                            <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                job application again.
                            </span>
                        </h1>
                    </Reveal>

                    {/* Subtext */}
                    <Reveal variant="fade-up" delay={160} duration={650}>
                        <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/60 sm:text-lg">
                            CareerTrack keeps every application, interview, and offer in one
                            place — so you always know what stage you&apos;re at, and what to
                            do next.
                        </p>
                    </Reveal>

                    {/* CTA Buttons */}
                    <Reveal variant="fade-up" delay={240} duration={650}>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Button
                                href="/register"
                                variant="primary"
                                size="lg"
                                className="gap-2 bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-black/70" />
                                Get started free
                            </Button>
                            <Button
                                href="#how-it-works"
                                variant="outline"
                                size="lg"
                                className="border-white/10 hover:bg-white/5 text-white transition-colors"
                            >
                                See how it works
                            </Button>
                        </div>
                    </Reveal>

                    {/* Fine print */}
                    <Reveal variant="fade-up" delay={320} duration={650}>
                        <p className="mt-5 text-[11px] uppercase tracking-[0.08em] text-foreground/50">
                            Free forever · No credit card · Takes 2 minutes
                        </p>
                    </Reveal>
                </div>

                {/* Hero image + floating card */}
                <Reveal variant="fade-left" delay={200} duration={800} threshold={0.05}>
                    <div className="relative mx-auto w-full max-w-md lg:max-w-none">

                        <div className="relative aspect-5/6 w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                            <Image
                                src="/images/heroimage.jpg"
                                alt="A job seeker reviewing their resume during an interview"
                                fill
                                priority
                                sizes="(min-width: 1024px) 480px, 90vw"
                                className="object-cover opacity-90"
                            />
                        </div>

                        {/* Floating status card */}
                        <Reveal variant="zoom-in" delay={500} duration={500} threshold={0.05}>
                            <div className="absolute -bottom-6 -left-6 w-64 rounded-xl border border-white/10 bg-black/60 p-4 shadow-2xl backdrop-blur-md sm:-left-10">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="font-display text-sm font-semibold text-white">
                                        Triangle Music Group
                                    </p>
                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 px-2 py-0.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                        <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-blue-300">
                                            Interview
                                        </span>
                                    </span>
                                </div>
                                <p className="mt-1 text-[11px] text-foreground/60">
                                    Digital Marketing Specialist
                                </p>
                                <div className="mt-3 flex items-center gap-1.5">
                                    {["Applied", "Screening", "Interview"].map((stage, i) => (
                                        <div
                                            key={stage}
                                            className={`h-1 flex-1 rounded-full ${i < 3 ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-white/10'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}