import type { ApplicationStatus } from "@/types/application";

const STATUS_CONFIG: Record<
    ApplicationStatus,
    { label: string; containerClass: string; dotClass: string; pulse: boolean }
> = {
    applied: {
        label: "Applied",
        containerClass: "bg-indigo-500/10 text-indigo-400 ring-indigo-500/25",
        dotClass: "bg-indigo-400",
        pulse: false,
    },
    screening: {
        label: "Screening",
        containerClass: "bg-sky-500/10 text-sky-400 ring-sky-500/25",
        dotClass: "bg-sky-400",
        pulse: true,
    },
    interview: {
        label: "Interview",
        containerClass: "bg-violet-500/10 text-violet-400 ring-violet-500/25",
        dotClass: "bg-violet-400",
        pulse: true,
    },
    test: {
        label: "Test",
        containerClass: "bg-amber-500/10 text-amber-400 ring-amber-500/25",
        dotClass: "bg-amber-400",
        pulse: true,
    },
    offer: {
        label: "Offer",
        containerClass: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/25",
        dotClass: "bg-emerald-400",
        pulse: true,
    },
    hired: {
        label: "Hired",
        containerClass: "bg-green-500/10 text-green-400 ring-green-500/25",
        dotClass: "bg-green-400",
        pulse: false,
    },
    rejected: {
        label: "Rejected",
        containerClass: "bg-rose-500/10 text-rose-400 ring-rose-500/25",
        dotClass: "bg-rose-400",
        pulse: false,
    },
    withdrawn: {
        label: "Withdrawn",
        containerClass: "bg-slate-500/10 text-slate-400 ring-slate-500/25",
        dotClass: "bg-slate-400",
        pulse: false,
    },
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
    const config = STATUS_CONFIG[status];
    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 transition-all ${config.containerClass}`}
        >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
                {config.pulse && (
                    <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${config.dotClass}`}
                    />
                )}
                <span
                    className={`relative inline-flex h-1.5 w-1.5 rounded-full ${config.dotClass}`}
                />
            </span>
            {config.label}
        </span>
    );
}