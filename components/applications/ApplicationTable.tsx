"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MoreHorizontal, Trash2, ExternalLink, MapPin, Briefcase } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { deleteApplication } from "@/app/actions/application";
import type { Application } from "@/types/application";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(company: string) {
    return company.split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_GRADIENTS = [
    "from-indigo-500 to-violet-500",
    "from-sky-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-pink-500",
    "from-violet-500 to-purple-500",
];

function avatarGradient(company: string) {
    let hash = 0;
    for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function relativeTime(dateStr: string) {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
}

export default function ApplicationsTable({ applications }: { applications: Application[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function openDetail(id: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("applicationId", id);
        router.push(`${pathname}?${params.toString()}`);
    }

    async function handleDelete(e: React.MouseEvent, id: string) {
        e.stopPropagation();
        if (!confirm("Delete this application? This can't be undone.")) return;
        await deleteApplication(id);
    }

    if (applications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card/20 px-4 py-16 text-center sm:py-20">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/50 bg-muted/40">
                    <Briefcase className="h-6 w-6 text-muted-foreground/60" />
                </div>
                <p className="text-base font-semibold text-foreground">No applications found</p>
                <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
                    No applications match your current filters. Try adjusting your search or add a new one.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 overflow-x-auto rounded-2xl border border-border/60 bg-card/40">
            <ul className="divide-y divide-border/40 sm:hidden">
                {applications.map((app) => (
                    <li key={app.id}>
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => openDetail(app.id)}
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openDetail(app.id)}
                            className="group flex w-full cursor-pointer items-start gap-2.5 px-3 py-3.5 text-left transition-colors hover:bg-white/[0.035] sm:gap-3 sm:px-4 sm:py-4"
                        >
                            <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-xs font-bold text-white shadow-sm sm:h-10 sm:w-10 ${avatarGradient(app.company)}`}
                            >
                                {getInitials(app.company)}
                            </div>

                            {/* AGGRESSIVE OVERFLOW CONTROL: Forced flex-1, min-w-0, and overflow-hidden */}
                            <div className="min-w-0 flex-1 overflow-hidden">
                                <div className="flex w-full items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1 overflow-hidden">
                                        <p className="truncate font-semibold text-foreground">
                                            {app.company}
                                        </p>
                                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                                            {app.position}
                                        </p>
                                    </div>
                                    <div className="shrink-0">
                                        <StatusBadge status={app.status} />
                                    </div>
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground/60">
                                    <span className="shrink-0" title={new Date(app.applied_date).toLocaleDateString("en-US")}>
                                        {relativeTime(app.applied_date)}
                                    </span>
                                    {app.location && (
                                        <span className="flex min-w-0 items-center gap-1">
                                            <MapPin className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{app.location}</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                        {app.job_url && (
                                            <DropdownMenuItem
                                                render={<a href={app.job_url} target="_blank" rel="noopener noreferrer" />}
                                            >
                                                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                                Open job posting
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            onClick={(e) => handleDelete(e, app.id)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <table className="hidden w-full min-w-150 text-sm sm:table">
                <thead>
                    <tr className="border-b border-border/60">
                        {["Company", "Position", "Status", "Applied", "Location"].map((h) => (
                            <th
                                key={h}
                                className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60"
                            >
                                {h}
                            </th>
                        ))}
                        <th className="w-12 px-3 py-3.5" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                    {applications.map((app) => (
                        <tr
                            key={app.id}
                            onClick={() => openDetail(app.id)}
                            className="group cursor-pointer transition-colors duration-100 hover:bg-white/[0.035]"
                        >
                            <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-[11px] font-bold text-white shadow-sm ${avatarGradient(app.company)}`}>
                                        {getInitials(app.company)}
                                    </div>
                                    <span className="font-semibold text-foreground">{app.company}</span>
                                </div>
                            </td>

                            <td className="max-w-50 px-5 py-3.5 text-muted-foreground">
                                <span className="line-clamp-1">{app.position}</span>
                            </td>

                            <td className="px-5 py-3.5">
                                <StatusBadge status={app.status} />
                            </td>

                            <td className="px-5 py-3.5 text-muted-foreground" title={new Date(app.applied_date).toLocaleDateString("en-US")}>
                                {relativeTime(app.applied_date)}
                            </td>

                            <td className="px-5 py-3.5">
                                {app.location ? (
                                    <span className="flex items-center gap-1.5 text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5 shrink-0 opacity-60" />
                                        {app.location}
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground/30">—</span>
                                )}
                            </td>

                            <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                        {app.job_url && (
                                            <DropdownMenuItem
                                                render={<a href={app.job_url} target="_blank" rel="noopener noreferrer" />}
                                            >
                                                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                                Open job posting
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            onClick={(e) => handleDelete(e, app.id)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}