"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error: string | null };

const loginSchema = z.object({
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(1, "Password is required."),
});

const registerSchema = z.object({
    fullName: z.string().min(2, "Enter your full name."),
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function signIn(_prevState: AuthState, formData: FormData): Promise<AuthState> {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signUp(_prevState: AuthState, formData: FormData): Promise<AuthState> {
    const parsed = registerSchema.safeParse({
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
            data: { full_name: parsed.data.fullName },
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/login?registered=true");
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}

export async function signInWithGoogle() {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error || !data.url) {
        redirect("/login?error=oauth");
    }

    redirect(data.url);
}