"use client";

import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type RevealVariant = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "zoom-in";

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    variant?: RevealVariant;
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
    as?: string;
}

const INITIAL: Record<RevealVariant, string> = {
    "fade-up": "opacity-0 translate-y-8",
    "fade-in": "opacity-0",
    "fade-left": "opacity-0 -translate-x-8",
    "fade-right": "opacity-0 translate-x-8",
    "zoom-in": "opacity-0 scale-95",
};

const VISIBLE = "opacity-100 translate-y-0 translate-x-0 scale-100";

export default function Reveal({
    children,
    className,
    variant = "fade-up",
    delay = 0,
    duration = 600,
    threshold = 0.15,
    once = true,
    as = "div",
}: RevealProps) {
    const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold, once });
    const Tag = as as React.ElementType;

    return (
        <Tag
            ref={ref}
            className={cn(
                "transition-all ease-out will-change-[opacity,transform]",
                isVisible ? VISIBLE : INITIAL[variant],
                className
            )}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: isVisible ? `${delay}ms` : "0ms",
            }}
        >
            {children}
        </Tag>
    );
}
