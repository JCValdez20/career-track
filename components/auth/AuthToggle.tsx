"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthToggle({ active }: { active: "login" | "register" }) {
    const pathname = usePathname();
    const [selected, setSelected] = useState<"login" | "register">(active);

    useEffect(() => {
        setSelected(active);
    }, [active, pathname]);

    return (
        <div className="relative grid grid-cols-2 bg-slate-100/80 p-1 rounded-xl mb-8 border border-slate-200/60 select-none">

            <div
                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm ring-1 ring-black/5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${selected === "register" ? "translate-x-full" : "translate-x-0"
                    }`}
            />

            <Link
                href="/login"
                onClick={() => setSelected("login")}
                className={`relative z-10 text-center text-sm font-semibold py-2 rounded-lg transition-colors duration-200 ${selected === "login"
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                    }`}
            >
                Log in
            </Link>

            <Link
                href="/register"
                onClick={() => setSelected("register")}
                className={`relative z-10 text-center text-sm font-semibold py-2 rounded-lg transition-colors duration-200 ${selected === "register"
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                    }`}
            >
                Register
            </Link>
        </div>
    );
}