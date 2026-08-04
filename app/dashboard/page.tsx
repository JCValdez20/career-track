import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/dashboard/DashboardClient";
import type { Application, InterviewWithApplication } from "@/types/application";

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();


    const { data: applications } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false });


    const now = new Date().toISOString();
    const { data: interviews } = await supabase
        .from("interviews")
        .select(`
            *,
            applications!inner(id, company, position, user_id)
        `)
        .eq("applications.user_id", user!.id)
        .gte("scheduled_at", now)
        .order("scheduled_at", { ascending: true })
        .limit(3);

    return (
        <div className="mx-auto flex w-full min-w-0 max-w-380 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="flex flex-col gap-1 shrink-0">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                    Your job hunt command center.
                </p>
            </div>

            <DashboardClient
                applications={(applications as Application[]) || []}
                upcomingInterviews={(interviews as unknown as InterviewWithApplication[]) || []}
            />
        </div>
    );
}