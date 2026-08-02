import { LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
                <form action={signOut}>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-red-600 hover:border-red-200 active:scale-[0.98]"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </form>
            </header>

            <main className="p-6">
                <p className="text-slate-500 text-sm">Welcome to your dashboard.</p>
            </main>
        </div>
    );
}