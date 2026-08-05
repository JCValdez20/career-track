"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { updateApplication } from "@/app/actions/application";
import type { Application } from "@/types/application";
import { Briefcase, Link2, MapPin, DollarSign, Rss, CalendarDays, CheckCircle2 } from "lucide-react";

const STATUSES = [
    { value: "applied", label: "Applied", color: "indigo" },
    { value: "screening", label: "Screening", color: "sky" },
    { value: "interview", label: "Interview", color: "violet" },
    { value: "test", label: "Test", color: "amber" },
    { value: "offer", label: "Offer", color: "emerald" },
    { value: "hired", label: "Hired", color: "green" },
    { value: "rejected", label: "Rejected", color: "rose" },
    { value: "withdrawn", label: "Withdrawn", color: "slate" },
] as const;

const STATUS_ACTIVE_CLASSES: Record<string, string> = {
    indigo: "bg-indigo-500/20 text-indigo-400 ring-indigo-500/40",
    sky: "bg-sky-500/20 text-sky-400 ring-sky-500/40",
    violet: "bg-violet-500/20 text-violet-400 ring-violet-500/40",
    amber: "bg-amber-500/20 text-amber-400 ring-amber-500/40",
    emerald: "bg-emerald-500/20 text-emerald-400 ring-emerald-500/40",
    green: "bg-green-500/20 text-green-400 ring-green-500/40",
    rose: "bg-rose-500/20 text-rose-400 ring-rose-500/40",
    slate: "bg-slate-500/20 text-slate-400 ring-slate-500/40",
};

export default function DetailsTab({ application }: { application: Application }) {
    const updateWithId = updateApplication.bind(null, application.id);
    const [state, formAction, pending] = useActionState(updateWithId, { error: null });
    const [saved, setSaved] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(application.status);
    const wasPending = useRef(false);

    useEffect(() => {
        if (wasPending.current && !pending && !state.error) {
            setSaved(true);
            const t = setTimeout(() => setSaved(false), 2500);
            return () => clearTimeout(t);
        }
        wasPending.current = pending;

    }, [pending, state.error]);

    return (
        <form action={formAction} className="grid gap-4">


            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                    label="Company"
                    name="company"
                    defaultValue={application.company}
                    required
                    icon={<Briefcase className="h-3.5 w-3.5" />}
                />
                <Field
                    label="Position"
                    name="position"
                    defaultValue={application.position}
                    required
                />
            </div>

            <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                    Status
                </label>
                <input type="hidden" name="status" value={selectedStatus} />
                <div className="flex flex-wrap gap-1.5">
                    {STATUSES.map((s) => {
                        const isActive = selectedStatus === s.value;
                        return (
                            <button
                                key={s.value}
                                type="button"
                                onClick={() => setSelectedStatus(s.value)}
                                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 transition-all ${isActive
                                        ? STATUS_ACTIVE_CLASSES[s.color]
                                        : "text-muted-foreground ring-border/50 hover:text-foreground hover:ring-border"
                                    }`}
                            >
                                {s.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                    label="Applied date"
                    name="appliedDate"
                    type="date"
                    defaultValue={application.applied_date}
                    icon={<CalendarDays className="h-3.5 w-3.5" />}
                />
                <Field
                    label="Job URL"
                    name="jobUrl"
                    type="url"
                    defaultValue={application.job_url ?? ""}
                    placeholder="https://…"
                    icon={<Link2 className="h-3.5 w-3.5" />}
                />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                    label="Location"
                    name="location"
                    defaultValue={application.location ?? ""}
                    icon={<MapPin className="h-3.5 w-3.5" />}
                />
                <Field
                    label="Salary range"
                    name="salaryRange"
                    defaultValue={application.salary_range ?? ""}
                    placeholder="$120k – $140k"
                    icon={<DollarSign className="h-3.5 w-3.5" />}
                />
            </div>

            <Field
                label="Source"
                name="source"
                defaultValue={application.source ?? ""}
                icon={<Rss className="h-3.5 w-3.5" />}
            />

            {state.error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                    {state.error}
                </div>
            )}

            <div className="flex items-center gap-3">
                <Button
                    type="submit"
                    disabled={pending}
                    size="sm"
                    className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500/50"
                >
                    {pending ? (
                        <span className="flex items-center gap-2">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Saving…
                        </span>
                    ) : (
                        "Save changes"
                    )}
                </Button>

                {saved && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Saved!
                    </span>
                )}
            </div>
        </form>
    );
}



function Field({
    label,
    name,
    type = "text",
    defaultValue,
    required,
    placeholder,
    icon,
}: {
    label: string;
    name: string;
    type?: string;
    defaultValue?: string;
    required?: boolean;
    placeholder?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    name={name}
                    defaultValue={defaultValue}
                    required={required}
                    placeholder={placeholder}
                    className={`h-9 w-full rounded-xl border border-border/60 bg-background/50 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none transition-colors focus:border-ring/50 focus:ring-1 focus:ring-ring/30 ${icon ? "pl-9 pr-3" : "px-3"}`}
                />
            </div>
        </div>
    );
}