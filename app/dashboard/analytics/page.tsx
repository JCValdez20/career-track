import { createClient } from "@/lib/supabase/server";
import AnalyticsClient from "@/components/analytics/AnalyticsClient";
import type { Application } from "@/types/application";

export default async function AnalyticsPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: applications } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user!.id)
        .order("applied_date", { ascending: true });

    return (

        <div className="mx-auto flex min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)] w-full min-w-0 max-w-380 flex-col px-4 py-4 sm:px-6">
            <div className="mb-4 flex shrink-0 flex-col gap-1">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    Analytics Overview
                </h1>
                <p className="text-sm text-muted-foreground">
                    Visualize your job hunt momentum and conversion rates.
                </p>
            </div>

            <AnalyticsClient applications={(applications as Application[]) || []} />
        </div>
    );
}