"use client";

import { Button } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function CTA() {
    return (
        <section className="relative py-24 sm:py-32 overflow-hidden">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">

                <Reveal variant="zoom-in" delay={0} duration={700} threshold={0.15}>
                    <div className="relative isolate overflow-hidden rounded-3xl bg-white/5 px-6 py-24 text-center shadow-2xl border border-white/10 sm:px-16 md:py-32 transition-colors hover:bg-white/[0.07]">

                        <div className="absolute -top-24 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-[100px] pointer-events-none" aria-hidden="true">
                            <div className="aspect-1155/678 w-160 sm:w-6xl bg-linear-to-tr from-blue-500 to-purple-500 opacity-20" />
                        </div>

                        <Reveal variant="fade-up" delay={150} duration={600}>
                            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
                                <span className="bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
                                    Ready to take control of your
                                </span>
                                <br />
                                <span className="text-white">job search?</span>
                            </h2>
                        </Reveal>

                        <Reveal variant="fade-up" delay={250} duration={600}>
                            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-foreground/60">
                                Stop relying on messy spreadsheets and lost emails. Join CareerTrack today and build a pipeline that actually gets you hired.
                            </p>
                        </Reveal>

                        <Reveal variant="fade-up" delay={350} duration={600}>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Button
                                    href="/register"
                                    variant="primary"
                                    size="lg"
                                    className="gap-2 bg-white text-black hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200 ring-1 ring-white/20 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    Get started for free
                                </Button>
                            </div>
                        </Reveal>

                        <Reveal variant="fade-in" delay={500} duration={700}>
                            <p className="mt-8 text-[11px] uppercase tracking-[0.08em] text-foreground/40 font-medium">
                                Free forever · No credit card required · Setup in seconds
                            </p>
                        </Reveal>

                    </div>
                </Reveal>
            </div>
        </section>
    );
}