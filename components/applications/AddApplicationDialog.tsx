"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { createApplication } from "@/app/actions/application";
import { Briefcase, Link2, MapPin, DollarSign, Rss, CalendarDays } from "lucide-react";

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

export default function AddApplicationDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [state, formAction, pending] = useActionState(createApplication, { error: null });
    const formRef = useRef<HTMLFormElement>(null);
    const wasPending = useRef(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("applied");

    useEffect(() => {
        if (wasPending.current && !pending && !state.error) {
            onOpenChange(false);
            formRef.current?.reset();
            setSelectedStatus("applied");
        }
        wasPending.current = pending;

    }, [pending, state.error]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/25">
                            <Briefcase className="h-4 w-4 text-indigo-400" />
                        </div>
                        <DialogTitle className="text-lg font-semibold">Add application</DialogTitle>
                    </div>
                </DialogHeader>

                <form ref={formRef} action={formAction} className="mt-2 grid gap-4">


                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field label="Company" name="company" required icon={<Briefcase className="h-3.5 w-3.5" />} />
                        <Field label="Position" name="position" required />
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
                            defaultValue={new Date().toISOString().split("T")[0]}
                            icon={<CalendarDays className="h-3.5 w-3.5" />}
                        />
                        <Field
                            label="Job URL"
                            name="jobUrl"
                            type="url"
                            placeholder="https://…"
                            icon={<Link2 className="h-3.5 w-3.5" />}
                        />
                    </div>


                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field
                            label="Location"
                            name="location"
                            icon={<MapPin className="h-3.5 w-3.5" />}
                        />
                        <Field
                            label="Salary range"
                            name="salaryRange"
                            placeholder="$120k – $140k"
                            icon={<DollarSign className="h-3.5 w-3.5" />}
                        />
                    </div>


                    <Field
                        label="Source"
                        name="source"
                        placeholder="LinkedIn, referral…"
                        icon={<Rss className="h-3.5 w-3.5" />}
                    />


                    {state.error && (
                        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
                            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                            {state.error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={pending}
                        className="mt-1 w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500/50"
                    >
                        {pending ? (
                            <span className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Adding…
                            </span>
                        ) : (
                            "Add application"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}



function Field({
    label,
    name,
    type = "text",
    required,
    placeholder,
    defaultValue,
    icon,
}: {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    defaultValue?: string;
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
                    required={required}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    className={`h-9 w-full rounded-xl border border-border/60 bg-background/50 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none transition-colors focus:border-ring/50 focus:ring-1 focus:ring-ring/30 ${icon ? "pl-9 pr-3" : "px-3"}`}
                />
            </div>
        </div>
    );
}