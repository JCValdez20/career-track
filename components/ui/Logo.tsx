"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
    href?: string;
    width?: number;
    height?: number;
    className?: string;
    imageClassName?: string;
    priority?: boolean;
    onClick?: () => void;
}

export default function Logo({
    href = "/dashboard",
    width = 130,
    height = 32,
    className = "",
    imageClassName = "",
    priority = false,
    onClick,
}: LogoProps) {
    return (
        <Link
            href={href}
            className={`flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm ${className}`.trim()}
            aria-label="CareerTrack Home"
            onClick={onClick}
        >
            <Image
                src="/images/logov2.png"
                alt="CareerTrack"
                width={width}
                height={height}
                className={`object-contain ${imageClassName}`.trim()}
                style={{ height: "auto" }}
                priority={priority}
            />
        </Link>
    );
}

