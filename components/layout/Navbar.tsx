"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { href: "#problems", label: "Problems" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#benefits", label: "Benefits" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
                scrolled || open
                    ? "border-b border-white/10 bg-background/95 backdrop-blur-md"
                    : "border-b border-transparent bg-transparent"
            )}
        >
            <nav className="mx-auto flex h-20 sm:h-24 max-w-6xl items-center justify-between px-4 sm:px-6">

                <Link
                    href="/"
                    className="flex items-center shrink-0"
                    onClick={() => setOpen(false)}
                    aria-label="CareerTrack Home"
                >
                    <Image
                        src="/images/logov2.png"
                        alt="CareerTrack Logo"
                        width={150}
                        height={150}

                        className="w-20 sm:w-30 h-auto object-contain"
                        priority
                    />
                </Link>

                <ul className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/60 transition-colors hover:text-white"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-1.5 sm:gap-4">
                    <Button
                        href="/login"
                        variant="ghost"
                        size="sm"
                        className="hidden md:inline-flex text-foreground/70 hover:text-white hover:bg-transparent transition-colors"
                    >
                        Log in
                    </Button>

                    <Button
                        href="/register"
                        variant="primary"
                        size="sm"
                        className="gap-1.5 sm:gap-2 bg-white text-black hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200 ring-1 ring-white/20 shadow-lg px-2.5 sm:px-4 text-[11px] sm:text-sm whitespace-nowrap"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                        Get started
                    </Button>

                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md text-foreground/70 hover:bg-white/5 hover:text-white md:hidden transition-colors shrink-0"
                    >
                        {open ? <X size={20} className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu size={20} className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </button>
                </div>
            </nav>

            <div
                className={cn(
                    "grid bg-background/95 backdrop-blur-md transition-[grid-template-rows] duration-300 ease-out md:hidden",
                    open ? "grid-rows-[1fr] border-b border-white/10" : "grid-rows-[0fr] border-b border-transparent"
                )}
            >
                <div className="overflow-hidden">
                    <ul className="flex flex-col gap-1 px-6 py-4">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="block py-2.5 text-[13px] uppercase tracking-[0.06em] text-foreground/70 hover:text-white transition-colors"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-3 px-6 pb-6 pt-2">
                        <Button
                            href="/login"
                            variant="outline"
                            size="md"
                            onClick={() => setOpen(false)}
                            className="border-white/10 text-white hover:bg-white/5"
                        >
                            Log in
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}