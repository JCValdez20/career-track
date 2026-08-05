"use client";

import { useActionState, useEffect, useRef } from "react";
import { Trash2, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { addNote, deleteNote } from "@/app/actions/notes";
import type { Note } from "@/types/application";

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
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function NotesTab({
    applicationId,
    notes,
}: {
    applicationId: string;
    notes: Note[];
}) {
    const addWithId = addNote.bind(null, applicationId);
    const [state, formAction, pending] = useActionState(addWithId, { error: null });
    const formRef = useRef<HTMLFormElement>(null);
    const wasPending = useRef(false);

    useEffect(() => {
        if (wasPending.current && !pending && !state.error) {
            formRef.current?.reset();
        }
        wasPending.current = pending;
    }, [pending, state.error]);

    return (
        <div className="flex flex-col gap-5">

            <form ref={formRef} action={formAction} className="flex flex-col gap-2.5">
                <textarea
                    name="content"
                    rows={3}
                    placeholder="Add a note about this application…"
                    className="w-full resize-none rounded-xl border border-border/60 bg-background/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none transition-colors focus:border-ring/50 focus:ring-1 focus:ring-ring/30"
                />
                {state.error && (
                    <p className="text-sm text-destructive">{state.error}</p>
                )}
                <Button
                    type="submit"
                    disabled={pending}
                    size="sm"
                    className="self-end gap-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500/50"
                >
                    {pending ? (
                        <span className="flex items-center gap-2">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Adding…
                        </span>
                    ) : (
                        <>
                            <Plus className="h-3.5 w-3.5" />
                            Add note
                        </>
                    )}
                </Button>
            </form>

            {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/40 py-10 text-center">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-muted/30">
                        <MessageSquare className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm text-muted-foreground">No notes yet.</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/50">
                        Add notes to track your progress.
                    </p>
                </div>
            ) : (
                <ul className="flex flex-col gap-2.5">
                    {notes.map((note) => (
                        <li
                            key={note.id}
                            className="group relative rounded-xl border border-border/50 bg-card/40 p-4 transition-colors hover:border-border/70"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <p className="text-sm leading-relaxed text-foreground">
                                    {note.content}
                                </p>
                                <form
                                    action={async () => {
                                        await deleteNote(note.id);
                                    }}
                                    className="shrink-0"
                                >
                                    <button
                                        type="submit"
                                        aria-label="Delete note"
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/0 opacity-0 transition-all group-hover:text-muted-foreground group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </form>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground/50" title={new Date(note.created_at).toLocaleString()}>
                                {relativeTime(note.created_at)}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}