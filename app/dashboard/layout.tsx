import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const sidebarUser = {
        name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Job Seeker",
        email: user.email ?? "",
        avatarUrl:
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            null,
    };

    return (
        <div className="min-h-screen flex bg-background">
            <Sidebar user={sidebarUser} />
            <main className="light flex-1 min-w-0 overflow-y-auto p-4 pt-14 md:p-8">
                {children}
            </main>
        </div>
    );
}