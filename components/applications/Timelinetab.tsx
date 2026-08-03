import StatusBadge from "./StatusBadge";
import type { StatusHistoryEntry } from "@/types/application";
import { Clock } from "lucide-react";

function relativeTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const mins = Math.floor((now.getTime() - date.getTime()) / 60_000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function TimelineTab({ history }: { history: StatusHistoryEntry[] }) {
    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/40 py-10 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-muted/30">
                    <Clock className="h-4 w-4 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground">No status changes recorded yet.</p>
                <p className="mt-0.5 text-xs text-muted-foreground/50">
                    Updates will appear here as you progress.
                </p>
            </div>
        );
    }

    return (
        <ol className="relative flex flex-col gap-0">
            {history.map((entry, index) => (
                <li key={entry.id} className="relative flex gap-4 pb-7 last:pb-0">

                    {index < history.length - 1 && (
                        <div className="absolute left-3.75 top-7 h-full w-px bg-linear-to-b from-border/60 to-transparent" />
                    )}


                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card ring-4 ring-background">
                        <span className="h-2 w-2 rounded-full bg-indigo-400" />
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1">

                        <div className="flex flex-wrap items-center gap-2">
                            {entry.from_status && (
                                <>
                                    <StatusBadge status={entry.from_status} />
                                    <span className="text-xs text-muted-foreground/50">→</span>
                                </>
                            )}
                            <StatusBadge status={entry.to_status} />
                        </div>

                        {entry.note && (
                            <p className="max-w-xs rounded-lg border-l-2 border-border/60 pl-3 text-sm italic text-muted-foreground">
                                {entry.note}
                            </p>
                        )}

                        <p
                            className="text-xs text-muted-foreground/50"
                            title={new Date(entry.changed_at).toLocaleString()}
                        >
                            {relativeTime(entry.changed_at)}
                        </p>
                    </div>
                </li>
            ))}
        </ol>
    );
}