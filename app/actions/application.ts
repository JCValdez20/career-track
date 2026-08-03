"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error: string | null };

const STATUSES = [
    "applied",
    "screening",
    "interview",
    "test",
    "offer",
    "hired",
    "rejected",
    "withdrawn",
] as const;

const applicationSchema = z.object({
    company: z.string().min(1, "Company is required."),
    position: z.string().min(1, "Position is required."),
    status: z.enum(STATUSES),
    appliedDate: z.string().min(1, "Applied date is required."),
    jobUrl: z.string().url("Enter a valid URL.").or(z.literal("")).optional(),
    location: z.string().optional(),
    salaryRange: z.string().optional(),
    source: z.string().optional(),
});

function parseApplicationForm(formData: FormData) {
    return applicationSchema.safeParse({
        company: formData.get("company"),
        position: formData.get("position"),
        status: formData.get("status"),
        appliedDate: formData.get("appliedDate"),
        jobUrl: formData.get("jobUrl") || "",
        location: formData.get("location") || "",
        salaryRange: formData.get("salaryRange") || "",
        source: formData.get("source") || "",
    });
}

export async function createApplication(
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const parsed = parseApplicationForm(formData);
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in." };

    const { error } = await supabase.from("applications").insert({
        user_id: user.id,
        company: parsed.data.company,
        position: parsed.data.position,
        status: parsed.data.status,
        applied_date: parsed.data.appliedDate,
        job_url: parsed.data.jobUrl || null,
        location: parsed.data.location || null,
        salary_range: parsed.data.salaryRange || null,
        source: parsed.data.source || null,
    });

    if (error) return { error: error.message };

    revalidatePath("/dashboard/applications");
    return { error: null };
}

export async function updateApplication(
    id: string,
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const parsed = parseApplicationForm(formData);
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    const supabase = await createClient();

    const { error } = await supabase
        .from("applications")
        .update({
            company: parsed.data.company,
            position: parsed.data.position,
            status: parsed.data.status,
            applied_date: parsed.data.appliedDate,
            job_url: parsed.data.jobUrl || null,
            location: parsed.data.location || null,
            salary_range: parsed.data.salaryRange || null,
            source: parsed.data.source || null,
        })
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/applications");
    return { error: null };
}


export async function updateApplicationStatus(
    id: string,
    newStatus: string
): Promise<ActionState> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/kanban");
    revalidatePath("/dashboard/applications");
    return { error: null };
}

export async function deleteApplication(id: string): Promise<ActionState> {
    const supabase = await createClient();

    const { data: interviews } = await supabase
        .from("interviews")
        .select("id")
        .eq("application_id", id);
    const interviewIds = (interviews ?? []).map((i) => i.id);

    const { data: attachments } = await supabase
        .from("attachments")
        .select("file_path")
        .eq("application_id", id);

    if (attachments && attachments.length > 0) {
        await supabase.storage.from("attachments").remove(attachments.map((a) => a.file_path));
    }

    if (interviewIds.length > 0) {
        await supabase.from("notes").delete().in("interview_id", interviewIds);
    }

    await supabase.from("notes").delete().eq("application_id", id);
    await supabase.from("attachments").delete().eq("application_id", id);
    await supabase.from("interviews").delete().eq("application_id", id);
    await supabase.from("status_history").delete().eq("application_id", id);

    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard/kanban"); // Ensure kanban updates on delete too
    return { error: null };
}