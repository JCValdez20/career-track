import { createClient } from "@/lib/supabase/server";
import ApplicationsToolbar from "@/components/applications/ApplicationToolbar";
import ApplicationsTable from "@/components/applications/ApplicationTable";
import ApplicationDetailSheet from "@/components/applications/ApplicationDetailSheet";
import type { Application, Attachment, Note, StatusHistoryEntry } from "@/types/application";

interface PageProps {
    searchParams: Promise<{
        q?: string;
        status?: string;
        sort?: string;
        order?: string;
        applicationId?: string;
    }>;
}

const STAT_BADGES = [
    { key: "screening", label: "Screening", dot: "bg-sky-400" },
    { key: "interview", label: "Interviews", dot: "bg-violet-400" },
    { key: "test", label: "Tests", dot: "bg-amber-400" },
    { key: "offer", label: "Offers", dot: "bg-emerald-400" },
    { key: "hired", label: "Hired", dot: "bg-green-400" },
] as const;

export default async function ApplicationsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    let query = supabase.from("applications").select("*").eq("user_id", user!.id);

    if (params.q) {
        query = query.or(`company.ilike.%${params.q}%,position.ilike.%${params.q}%`);
    }
    if (params.status && params.status !== "all") {
        query = query.eq("status", params.status);
    }
    query = query.order(params.sort ?? "applied_date", { ascending: params.order === "asc" });

    const { data: applications } = await query;

    const { data: allApps } = await supabase
        .from("applications")
        .select("status")
        .eq("user_id", user!.id);

    const statusCounts = (allApps ?? []).reduce<Record<string, number>>((acc, app) => {
        acc[app.status] = (acc[app.status] ?? 0) + 1;
        return acc;
    }, {});

    let detail: {
        application: Application;
        notes: Note[];
        history: StatusHistoryEntry[];
        attachments: Attachment[];
    } | null = null;

    if (params.applicationId) {
        const [{ data: app }, { data: notes }, { data: history }, { data: attachments }] =
            await Promise.all([
                supabase.from("applications").select("*").eq("id", params.applicationId).single(),
                supabase
                    .from("notes")
                    .select("*")
                    .eq("application_id", params.applicationId)
                    .order("created_at", { ascending: false }),
                supabase
                    .from("status_history")
                    .select("*")
                    .eq("application_id", params.applicationId)
                    .order("changed_at", { ascending: false }),
                supabase
                    .from("attachments")
                    .select("*")
                    .eq("application_id", params.applicationId)
                    .order("uploaded_at", { ascending: false }),
            ]);

        if (app) {
            const attachmentsWithUrls = await Promise.all(
                (attachments ?? []).map(async (a) => {
                    const { data: signed } = await supabase.storage
                        .from("attachments")
                        .createSignedUrl(a.file_path, 3600);
                    return { ...a, signedUrl: signed?.signedUrl };
                })
            );

            detail = {
                application: app,
                notes: notes ?? [],
                history: history ?? [],
                attachments: attachmentsWithUrls,
            };
        }
    }

    const totalCount = allApps?.length ?? 0;
    const filteredCount = applications?.length ?? 0;

    return (
        <div className="mx-auto w-full min-w-0 overflow-hidden max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        Applications
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {filteredCount === totalCount
                            ? `${totalCount} application${totalCount === 1 ? "" : "s"} total`
                            : `${filteredCount} of ${totalCount} application${totalCount === 1 ? "" : "s"}`}
                    </p>
                </div>

                {totalCount > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {STAT_BADGES.map((s) => {
                            const count = statusCounts[s.key] ?? 0;
                            if (count === 0) return null;
                            return (
                                <span
                                    key={s.key}
                                    className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/40 px-2.5 py-0.5 text-xs text-muted-foreground backdrop-blur-sm sm:px-3 sm:py-1"
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                                    <span className="font-semibold text-foreground">{count}</span>
                                    {s.label}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>

            <ApplicationsToolbar />

            <div className="mt-4">
                <ApplicationsTable applications={applications ?? []} />
            </div>

            {detail && (
                <ApplicationDetailSheet
                    application={detail.application}
                    notes={detail.notes}
                    history={detail.history}
                    attachments={detail.attachments}
                />
            )}
        </div>
    );
}