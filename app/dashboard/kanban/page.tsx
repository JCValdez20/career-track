import { createClient } from "@/lib/supabase/server";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import ApplicationDetailSheet from "@/components/applications/ApplicationDetailSheet";
import type { Application, Attachment, Note, StatusHistoryEntry } from "@/types/application";

interface PageProps {
    searchParams: Promise<{
        applicationId?: string;
    }>;
}

export default async function KanbanPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();


    const { data: applications } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user!.id)
        .order("applied_date", { ascending: false });


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
                supabase.from("notes").select("*").eq("application_id", params.applicationId).order("created_at", { ascending: false }),
                supabase.from("status_history").select("*").eq("application_id", params.applicationId).order("changed_at", { ascending: false }),
                supabase.from("attachments").select("*").eq("application_id", params.applicationId).order("uploaded_at", { ascending: false }),
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

    return (
        <div className="mx-auto w-full min-w-0 overflow-hidden max-w-380 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mb-5 flex flex-col gap-1 sm:mb-6">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    Kanban Board
                </h1>
                <p className="text-sm text-muted-foreground">
                    Drag and drop applications across stages to manage your pipeline.
                </p>
            </div>


            <KanbanBoard applications={applications ?? []} />
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