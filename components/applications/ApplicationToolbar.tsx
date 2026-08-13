"use client";

import { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Plus, ArrowUp, ArrowDown, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AddApplicationDialog from "./AddApplicationDialog";

const STATUS_OPTIONS = [
    { value: "all", label: "All statuses" },
    { value: "applied", label: "Applied" },
    { value: "screening", label: "Screening" },
    { value: "interview", label: "Interview" },
    { value: "test", label: "Test" },
    { value: "offer", label: "Offer" },
    { value: "hired", label: "Hired" },
    { value: "rejected", label: "Rejected" },
    { value: "withdrawn", label: "Withdrawn" },
    { value: "ghosted", label: "Ghosted (14d+)" }, // Added so the select box syncs with the button
];

const SORT_OPTIONS = [
    { value: "applied_date", label: "Date applied" },
    { value: "company", label: "Company" },
    { value: "position", label: "Position" },
    { value: "status", label: "Status" },
];

export default function ApplicationsToolbar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();
    const [search, setSearch] = useState(searchParams.get("q") ?? "");
    const [addOpen, setAddOpen] = useState(false);

    const currentStatus = searchParams.get("status") ?? "all";
    const currentSort = searchParams.get("sort") ?? "applied_date";
    const currentOrder = searchParams.get("order") ?? "desc";

    function updateParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") params.set(key, value);
        else params.delete(key);
        startTransition(() => router.push(`${pathname}?${params.toString()}`));
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (searchParams.get("q") ?? "")) updateParam("q", search);
        }, 350);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <div className="flex flex-col gap-3">
            <div className="relative w-full min-w-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <input
                    id="app-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search company or position…"
                    className="h-9 w-full rounded-xl border border-border/60 bg-card/40 py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none backdrop-blur-sm transition-colors focus:border-ring/50 focus:ring-1 focus:ring-ring/30"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">

                    <div className="relative min-w-0 flex-1">
                        <select
                            id="app-status-filter"
                            value={currentStatus}
                            onChange={(e) => updateParam("status", e.target.value)}
                            className="h-9 w-full appearance-none overflow-hidden text-ellipsis whitespace-nowrap rounded-xl border border-border/60 bg-card/40 pl-3 pr-7 text-sm text-foreground outline-none backdrop-blur-sm transition-colors focus:border-ring/50 focus:ring-1 focus:ring-ring/30"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>

                    <div className="relative min-w-0 flex-1">
                        <select
                            id="app-sort-select"
                            value={currentSort}
                            onChange={(e) => updateParam("sort", e.target.value)}
                            className="h-9 w-full appearance-none overflow-hidden text-ellipsis whitespace-nowrap rounded-xl border border-border/60 bg-card/40 pl-3 pr-7 text-sm text-foreground outline-none backdrop-blur-sm transition-colors focus:border-ring/50 focus:ring-1 focus:ring-ring/30"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>

                    <button
                        id="app-sort-order"
                        type="button"
                        onClick={() => updateParam("order", currentOrder === "asc" ? "desc" : "asc")}
                        aria-label="Toggle sort order"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card/40 text-muted-foreground backdrop-blur-sm transition-colors hover:border-ring/50 hover:text-foreground"
                    >
                        {currentOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </button>

                    {/* NEW GHOSTED FILTER BUTTON */}
                    <button
                        type="button"
                        onClick={() => updateParam("status", currentStatus === "ghosted" ? "all" : "ghosted")}
                        className={`flex h-9 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition-colors ${currentStatus === "ghosted"
                                ? "bg-amber-500/20 border-amber-500/40 text-amber-500 shadow-sm"
                                : "border-border/60 bg-card/40 text-muted-foreground hover:bg-muted hover:text-foreground backdrop-blur-sm"
                            }`}
                    >
                        <AlertCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Ghosted</span>
                    </button>
                </div>

                <Button
                    id="add-application-btn"
                    onClick={() => setAddOpen(true)}
                    className="h-9 w-full shrink-0 gap-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500/50 sm:w-auto sm:ml-auto"
                >
                    <Plus className="h-4 w-4" />
                    Add application
                </Button>
            </div>

            <AddApplicationDialog open={addOpen} onOpenChange={setAddOpen} />
        </div>
    );
}