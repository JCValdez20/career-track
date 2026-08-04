export type ApplicationStatus =
    | "applied"
    | "screening"
    | "interview"
    | "test"
    | "offer"
    | "hired"
    | "rejected"
    | "withdrawn";

export interface Application {
    id: string;
    user_id: string;
    company: string;
    position: string;
    job_url: string | null;
    location: string | null;
    salary_range: string | null;
    source: string | null;
    status: ApplicationStatus;
    applied_date: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface StatusHistoryEntry {
    id: string;
    application_id: string;
    from_status: ApplicationStatus | null;
    to_status: ApplicationStatus;
    note: string | null;
    changed_at: string;
}

export interface Note {
    id: string;
    application_id: string | null;
    interview_id: string | null;
    content: string;
    created_at: string;
}

export interface Attachment {
    id: string;
    application_id: string;
    file_name: string;
    file_path: string;
    file_type: string | null;
    file_size: number | null;
    uploaded_at: string;

    signedUrl?: string;
}

export type InterviewType = "phone" | "technical" | "onsite" | "final" | "other";
export type InterviewOutcome = "pending" | "passed" | "failed" | "cancelled";

export interface Interview {
    id: string;
    application_id: string;
    type: InterviewType;
    scheduled_at: string;
    duration_minutes: number | null;
    location: string | null;
    interviewer: string | null;
    outcome: InterviewOutcome | null;
    notes: string | null;
    created_at: string;
}

export interface InterviewWithApplication extends Interview {
    applications: { id: string; company: string; position: string } | null;
    // Aliased from the `notes` table in the query (see interview.ts) to
    // avoid colliding with the interview's own `notes` text column above.
    interview_notes: Note[];
}
