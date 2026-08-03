"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "./StatusBadge";
import DetailsTab from "./DetailsTab";
import NotesTab from "./NotesStab";
import TimelineTab from "./Timelinetab";
import FilesTab from "./Filestab";
import type { Application, Attachment, Note, StatusHistoryEntry } from "@/types/application";
import { FileText, MessageSquare, Settings, Clock } from "lucide-react";

function getInitials(company: string) {
    return company
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
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
    for (let i = 0; i < company.length; i++) {
        hash = company.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

interface DetailData {
    application: Application;
    notes: Note[];
    history: StatusHistoryEntry[];
    attachments: Attachment[];
}

export default function ApplicationDetailSheet({
    application,
    notes,
    history,
    attachments,
}: {
    application: Application | null;
    notes: Note[];
    history: StatusHistoryEntry[];
    attachments: Attachment[];
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();


    const [cached, setCached] = useState<DetailData | null>(
        application ? { application, notes, history, attachments } : null
    );

    useEffect(() => {
        if (application) {
            setCached({ application, notes, history, attachments });
        }
    }, [application, notes, history, attachments]);

    function close() {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("applicationId");
        router.push(`${pathname}?${params.toString()}`);
    }

    if (!cached) return null;

    const { application: app, notes: cachedNotes, history: cachedHistory, attachments: cachedAttachments } = cached;

    return (
        <Sheet open={!!application} onOpenChange={(open) => !open && close()}>
            <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 data-[side=right]:sm:max-w-2xl data-[side=right]:md:max-w-3xl data-[side=right]:lg:max-w-225">


                <SheetHeader className="border-b border-border/50 px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">

                    <div className="flex items-start gap-3 sm:gap-4">

                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-sm font-bold text-white shadow-lg sm:h-12 sm:w-12 ${avatarGradient(app.company)}`}
                        >
                            {getInitials(app.company)}
                        </div>


                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <SheetTitle className="text-lg font-semibold leading-tight text-foreground sm:text-xl">
                                    {app.company}
                                </SheetTitle>
                                <StatusBadge status={app.status} />
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{app.position}</p>


                            <div className="mt-2.5 flex flex-wrap gap-1.5 sm:gap-2">
                                {app.location && (
                                    <span className="rounded-full border border-border/50 bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground sm:px-2.5">
                                        📍 {app.location}
                                    </span>
                                )}
                                {app.salary_range && (
                                    <span className="rounded-full border border-border/50 bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground sm:px-2.5">
                                        💰 {app.salary_range}
                                    </span>
                                )}
                                {app.source && (
                                    <span className="rounded-full border border-border/50 bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground sm:px-2.5">
                                        🔗 {app.source}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </SheetHeader>


                <div className="flex flex-1 flex-col px-4 pb-6 pt-4 sm:px-6">
                    <Tabs defaultValue="details" className="flex flex-1 flex-col gap-4">
                        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-muted/40 p-1">
                            <TabsTrigger
                                value="details"
                                className="flex items-center justify-center gap-1 rounded-lg text-xs data-active:bg-background data-active:shadow-sm sm:gap-1.5"
                            >
                                <Settings className="h-3 w-3 shrink-0" />
                                <span className="hidden min-[380px]:inline">Details</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="notes"
                                className="flex items-center justify-center gap-1 rounded-lg text-xs data-active:bg-background data-active:shadow-sm sm:gap-1.5"
                            >
                                <MessageSquare className="h-3 w-3 shrink-0" />
                                <span className="hidden min-[380px]:inline">Notes</span>
                                {cachedNotes.length > 0 && (
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-medium text-indigo-400">
                                        {cachedNotes.length}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="timeline"
                                className="flex items-center justify-center gap-1 rounded-lg text-xs data-active:bg-background data-active:shadow-sm sm:gap-1.5"
                            >
                                <Clock className="h-3 w-3 shrink-0" />
                                <span className="hidden min-[380px]:inline">Timeline</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="files"
                                className="flex items-center justify-center gap-1 rounded-lg text-xs data-active:bg-background data-active:shadow-sm sm:gap-1.5"
                            >
                                <FileText className="h-3 w-3 shrink-0" />
                                <span className="hidden min-[380px]:inline">Files</span>
                                {cachedAttachments.length > 0 && (
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-medium text-indigo-400">
                                        {cachedAttachments.length}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details">
                            <DetailsTab application={app} />
                        </TabsContent>
                        <TabsContent value="notes">
                            <NotesTab applicationId={app.id} notes={cachedNotes} />
                        </TabsContent>
                        <TabsContent value="timeline">
                            <TimelineTab history={cachedHistory} />
                        </TabsContent>
                        <TabsContent value="files">
                            <FilesTab applicationId={app.id} attachments={cachedAttachments} />
                        </TabsContent>
                    </Tabs>
                </div>
            </SheetContent>
        </Sheet>
    );
}