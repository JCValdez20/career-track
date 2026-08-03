"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { updateApplicationStatus } from "@/app/actions/application";
import { MapPin, Calendar, FileText, ArrowRight } from "lucide-react"; // Swapped icon here
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import type { Application } from "@/types/application";

const COLUMNS = [
    { key: "applied", label: "Applied", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
    { key: "screening", label: "Screening", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
    { key: "interview", label: "Interview", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
    { key: "test", label: "Test", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    { key: "offer", label: "Offer", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { key: "hired", label: "Hired", color: "bg-green-500/10 text-green-400 border-green-500/20" },
    { key: "rejected", label: "Rejected", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    { key: "withdrawn", label: "Withdrawn", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
] as const;

interface KanbanBoardProps {
    applications: (Application & {
        hasInterviews?: boolean;
        hasAttachments?: boolean;
    })[];
}

type BoardState = Record<string, Application[]>;

export default function KanbanBoard({ applications }: KanbanBoardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isMounted, setIsMounted] = useState(false);
    const [columns, setColumns] = useState<BoardState>({});

    useEffect(() => {
        setIsMounted(true);

        const originalWarn = console.warn;
        console.warn = (...args) => {
            if (
                typeof args[0] === "string" &&
                args[0].includes("unsupported nested scroll container")
            ) {
                return;
            }
            originalWarn(...args);
        };

        return () => {
            console.warn = originalWarn;
        };
    }, []);

    useEffect(() => {
        const grouped: BoardState = {
            applied: [], screening: [], interview: [], test: [],
            offer: [], hired: [], rejected: [], withdrawn: []
        };

        applications.forEach((app) => {
            if (grouped[app.status]) {
                grouped[app.status].push(app);
            }
        });

        setColumns(grouped);
    }, [applications]);

    function openDetail(id: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("applicationId", id);
        router.push(`${pathname}?${params.toString()}`);
    }

    async function handleDragEnd(result: DropResult) {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceColKey = source.droppableId;
        const destColKey = destination.droppableId;

        const newColumns = { ...columns };
        const sourceList = [...newColumns[sourceColKey]];
        const destList = sourceColKey === destColKey ? sourceList : [...newColumns[destColKey]];

        const [movedItem] = sourceList.splice(source.index, 1);

        movedItem.status = destColKey as Application["status"];

        destList.splice(destination.index, 0, movedItem);

        newColumns[sourceColKey] = sourceList;
        newColumns[destColKey] = destList;
        setColumns(newColumns);

        if (sourceColKey !== destColKey) {
            await updateApplicationStatus(draggableId, destColKey);
        }
    }

    if (!isMounted) return null;

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex h-[calc(100vh-12rem)] w-full min-w-0 gap-4 overflow-x-auto pb-4 pt-2">
                {COLUMNS.map((col) => {
                    const columnApps = columns[col.key] || [];

                    return (
                        <div key={col.key} className="flex h-full w-72 shrink-0 flex-col rounded-2xl border border-border/60 bg-card/20">
                            <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
                                <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${col.color}`}>
                                    {col.label}
                                </span>
                                <span className="rounded-full bg-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                    {columnApps.length}
                                </span>
                            </div>

                            <Droppable droppableId={col.key}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex flex-1 flex-col gap-3 overflow-y-auto p-3 transition-colors ${snapshot.isDraggingOver ? "bg-white/5" : ""
                                            }`}
                                    >
                                        {columnApps.length === 0 && !snapshot.isDraggingOver && (
                                            <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border/40 text-xs text-muted-foreground/40">
                                                No applications
                                            </div>
                                        )}

                                        {columnApps.map((app, index) => (
                                            <Draggable key={app.id} draggableId={app.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => openDetail(app.id)}
                                                        className={`group relative rounded-xl border p-4 shadow-sm transition-colors ${snapshot.isDragging
                                                                ? "border-ring/50 bg-card rotate-2 shadow-xl z-50 cursor-grabbing"
                                                                : "border-border/60 bg-card/60 hover:border-ring/50 hover:bg-card/80 cursor-grab"
                                                            }`}
                                                        style={provided.draggableProps.style}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className="font-semibold text-foreground line-clamp-1">
                                                                {app.company}
                                                            </p>

                                                            <div onClick={(e) => e.stopPropagation()} className="shrink-0 cursor-default">
                                                                <DropdownMenu>
                                                                    {/* Replaced the triple dot with an explicit Move button */}
                                                                    <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1 text-[10px] font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                                                                        Move
                                                                        <ArrowRight className="h-3 w-3" />
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="w-48">
                                                                        <DropdownMenuGroup>
                                                                            <DropdownMenuLabel className="text-xs text-muted-foreground">Move to...</DropdownMenuLabel>
                                                                            <DropdownMenuSeparator />
                                                                            {COLUMNS.map((c) => (
                                                                                <DropdownMenuItem
                                                                                    key={c.key}
                                                                                    disabled={c.key === app.status}
                                                                                    onClick={() => updateApplicationStatus(app.id, c.key)}
                                                                                    className="flex items-center justify-between text-xs"
                                                                                >
                                                                                    {c.label}
                                                                                    {c.key === app.status && <div className="h-1.5 w-1.5 rounded-full bg-foreground" />}
                                                                                </DropdownMenuItem>
                                                                            ))}
                                                                        </DropdownMenuGroup>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </div>
                                                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                                                            {app.position}
                                                        </p>

                                                        {app.location && (
                                                            <div className="mt-2.5 flex items-center gap-1 text-[11px] text-muted-foreground/70">
                                                                <MapPin className="h-3 w-3 shrink-0 opacity-60" />
                                                                <span className="truncate">{app.location}</span>
                                                            </div>
                                                        )}

                                                        <div className="mt-3 flex items-center gap-2 border-t border-border/40 pt-2.5 text-[10px] text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3 text-violet-400" />
                                                                Interview
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <FileText className="h-3 w-3 text-sky-400" />
                                                                Files
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
}