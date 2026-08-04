import { createClient } from "@/lib/supabase/server";
import CalendarClient from "@/components/calendar/CalendarClient";
import type { Application, InterviewWithApplication } from "@/types/application";

export default async function CalendarPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 1. Fetch applications (so we can select them in the "Add Interview" dropdown)
    const { data: applications } = await supabase
        .from("applications")
        .select("id, company, position")
        .eq("user_id", user!.id)
        .order("company", { ascending: true });

    // 2. Fetch interviews (joining the application details and specific interview notes)
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
        // FIX: Changed max-w-380 back to max-w-[95rem]
        <div className="mx-auto w-full min-w-0 max-w-[95rem] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
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