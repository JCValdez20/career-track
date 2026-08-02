"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

const FOOTER_LINKS = [
    { href: "#problems", label: "Problems" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "/login", label: "Log in" },
];

export default function Footer() {
    return (
        <footer className="relative border-t border-white/10 py-12 overflow-hidden">

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-60 w-120 -z-10 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-center gap-8">

                <Reveal variant="zoom-in" delay={0} duration={600} threshold={0.1}>
                    <Link
                        href="/"
                        className="flex items-center group"
                        aria-label="CareerTrack Home"
                    >
                        <Image
                            src="/images/logov2.png"
                            alt="CareerTrack Logo"
                            width={200}
                            height={50}
                            className="w-30 sm:w-37.5 md:w-45 object-contain transition-transform group-hover:scale-105"
                            style={{ height: "auto" }}
                        />
                    </Link>
                </Reveal>

                <Reveal variant="fade-up" delay={100} duration={600} threshold={0.1}>
                    <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10">
                        {FOOTER_LINKS.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="font-medium uppercase tracking-[0.08em] text-foreground/50 transition-colors hover:text-white text-[10px] sm:text-[11px] md:text-xs lg:text-sm"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </Reveal>

                <Reveal variant="fade-in" delay={200} duration={700} threshold={0.1}>
                    <div className="mt-4 flex flex-col items-center gap-2 text-foreground/40 text-[10px] sm:text-xs md:text-sm">
                        <p>© {new Date().getFullYear()} CareerTrack. All rights reserved.</p>
                    </div>
                </Reveal>

            </div>
        </footer>
    );
}