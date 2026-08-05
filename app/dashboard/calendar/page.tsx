import { createClient } from "@/lib/supabase/server";
import CalendarClient from "@/components/calendar/CalendarClient";
import type { Application, InterviewWithApplication } from "@/types/application";

export default async function CalendarPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();


    const { data: applications } = await supabase
        .from("applications")
        .select("id, company, position")
        .eq("user_id", user!.id)
        .order("company", { ascending: true });


    const { data: interviews } = await supabase
        .from("interviews")
        .select(`
            *,
            applications!inner(id, company, position, user_id),
            interview_notes:notes(*)
        `)
        .eq("applications.user_id", user!.id)
        .order("scheduled_at", { ascending: true });

    return (

        <div className="mx-auto w-full min-w-0 max-w-380 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mb-6 flex flex-col gap-1 sm:mb-8">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    Interview Calendar
                </h1>
                <p className="text-sm text-muted-foreground">
                    Track your upcoming interviews, technical tests, and recruiter calls.
                </p>
            </div>

            <CalendarClient
                applications={(applications as unknown as Application[]) || []}
                interviews={(interviews as unknown as InterviewWithApplication[]) || []}
            />
        </div>
    );
}