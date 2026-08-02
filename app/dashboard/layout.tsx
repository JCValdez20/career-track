import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();


    const userName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        "Job Seeker";
    const userEmail = user?.email || "";

    return (
        <DashboardShell userName={userName} userEmail={userEmail}>
            {children}
        </DashboardShell>
    );
}