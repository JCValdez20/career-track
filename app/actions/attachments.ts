"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error: string | null };

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function uploadAttachment(
    applicationId: string,
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) return { error: "Choose a file first." };
    if (file.size > MAX_FILE_SIZE) return { error: "File must be under 10MB." };

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in." };
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${user.id}/${applicationId}/${Date.now()}-${cleanName}`;

    const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, file);
    if (uploadError) return { error: uploadError.message };

    const { error: insertError } = await supabase.from("attachments").insert({
        application_id: applicationId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type || null,
        file_size: file.size,
    });
    if (insertError) return { error: insertError.message };

    revalidatePath("/dashboard/applications");
    return { error: null };
}

export async function deleteAttachment(id: string, filePath: string): Promise<ActionState> {
    const supabase = await createClient();

    await supabase.storage.from("attachments").remove([filePath]);

    const { error } = await supabase.from("attachments").delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/dashboard/applications");
    return { error: null };
}