"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error: string | null };

const TYPES = ["phone", "technical", "onsite", "final", "other"] as const;
const OUTCOMES = ["pending", "passed", "failed", "cancelled"] as const;

const interviewSchema = z.object({
    applicationId: z.string().uuid("Choose an application."),
    type: z.enum(TYPES),
    scheduledAtIso: z.string().min(1, "Date and time are required."),
    durationMinutes: z.coerce.number().int().positive().optional(),
    location: z.string().optional(),
    interviewer: z.string().optional(),
    outcome: z.enum(OUTCOMES).optional(),
});

function parseInterviewForm(formData: FormData) {
    return interviewSchema.safeParse({
        applicationId: formData.get("applicationId"),
        type: formData.get("type"),
        scheduledAtIso: formData.get("scheduledAtIso"),
        durationMinutes: formData.get("durationMinutes") || undefined,
        location: formData.get("location") || "",
        interviewer: formData.get("interviewer") || "",
        outcome: formData.get("outcome") || undefined,
    });
}

export async function createInterview(
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const parsed = parseInterviewForm(formData);
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    const supabase = await createClient();
    const { error } = await supabase.from("interviews").insert({
        application_id: parsed.data.applicationId,
        type: parsed.data.type,
        scheduled_at: parsed.data.scheduledAtIso,
        duration_minutes: parsed.data.durationMinutes ?? 60,
        location: parsed.data.location || null,
        interviewer: parsed.data.interviewer || null,
        outcome: parsed.data.outcome ?? "pending",
    });

    if (error) return { error: error.message };

    revalidatePath("/dashboard/calendar");
    return { error: null };
}

// Not wired into the UI yet — Calendar's spec only calls for viewing
// and deleting from the detail dialog — but kept here since rescheduling
// is a near-certain next request and the parsing logic is identical.
export async function updateInterview(
    id: string,
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const parsed = parseInterviewForm(formData);
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    const supabase = await createClient();
    const { error } = await supabase
        .from("interviews")
        .update({
            application_id: parsed.data.applicationId,
            type: parsed.data.type,
            scheduled_at: parsed.data.scheduledAtIso,
            duration_minutes: parsed.data.durationMinutes ?? 60,
            location: parsed.data.location || null,
            interviewer: parsed.data.interviewer || null,
            outcome: parsed.data.outcome ?? "pending",
        })
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/calendar");
    return { error: null };
}

export async function deleteInterview(id: string): Promise<ActionState> {
    const supabase = await createClient();

    // Same reasoning as deleteApplication — clean up dependent notes
    // explicitly rather than relying on a cascade the schema export
    // doesn't confirm exists.
    await supabase.from("notes").delete().eq("interview_id", id);

    const { error } = await supabase.from("interviews").delete().eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/dashboard/calendar");
    return { error: null };
}


export async function addInterviewNote(
    interviewId: string,
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const content = (formData.get("content") as string)?.trim();
    if (!content) return { error: "Note can't be empty." };

    const supabase = await createClient();

    // Send ONLY the interview_id
    const { error } = await supabase.from("notes").insert({
        interview_id: interviewId,
        content,
    });
    if (error) return { error: error.message };

    revalidatePath("/dashboard/calendar");
    return { error: null };
}