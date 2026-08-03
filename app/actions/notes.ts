"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error: string | null };

export async function addNote(
    applicationId: string,
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const content = (formData.get("content") as string)?.trim();
    if (!content) return { error: "Note can't be empty." };

    const supabase = await createClient();
    const { error } = await supabase.from("notes").insert({
        application_id: applicationId,
        content,
    });

    if (error) return { error: error.message };

    revalidatePath("/dashboard/applications");
    return { error: null };
}

export async function deleteNote(id: string): Promise<ActionState> {
    const supabase = await createClient();
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/dashboard/applications");
    return { error: null };
}