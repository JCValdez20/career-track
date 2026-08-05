"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Download, Trash2, Upload, FolderOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { uploadAttachment, deleteAttachment } from "@/app/actions/attachments";
import type { Attachment } from "@/types/application";


const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB (must match server action)
const MAX_FILE_LABEL = "10 MB";


function formatSize(bytes: number | null) {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(filename: string) {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "PDF";
    if (["doc", "docx"].includes(ext ?? "")) return "DOC";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext ?? "")) return "IMG";
    if (["xls", "xlsx", "csv"].includes(ext ?? "")) return "XLS";
    return "FILE";
}

const FILE_BADGE_CLASSES: Record<string, string> = {
    PDF: "bg-rose-500/10 text-rose-400",
    DOC: "bg-sky-500/10 text-sky-400",
    IMG: "bg-violet-500/10 text-violet-400",
    XLS: "bg-emerald-500/10 text-emerald-400",
    FILE: "bg-muted text-muted-foreground",
};


export default function FilesTab({
    applicationId,
    attachments,
}: {
    applicationId: string;
    attachments: Attachment[];
}) {
    const uploadWithId = uploadAttachment.bind(null, applicationId);
    const [serverState, formAction, pending] = useActionState(uploadWithId, { error: null });

    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<number | null>(null);
    const [clientError, setClientError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const wasPending = useRef(false);

    useEffect(() => {
        if (wasPending.current && !pending && !serverState.error) {
            formRef.current?.reset();
            setFileName(null);
            setFileSize(null);
            setClientError(null);
        }
        wasPending.current = pending;

    }, [pending, serverState.error]);


    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) {
            setFileName(null);
            setFileSize(null);
            setClientError(null);
            return;
        }
        if (file.size > MAX_FILE_BYTES) {
            setClientError(
                `"${file.name}" is ${formatSize(file.size)} — over the ${MAX_FILE_LABEL} limit. Please choose a smaller file.`
            );
            setFileName(null);
            setFileSize(null);
            e.target.value = "";
            return;
        }
        setClientError(null);
        setFileName(file.name);
        setFileSize(file.size);
    }

    const displayError = clientError ?? serverState.error;

    const canSubmit = !clientError && !!fileName;

    return (
        <div className="flex flex-col gap-5">


            <form ref={formRef} action={formAction} className="flex flex-col gap-2.5">
                <label
                    className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all ${clientError
                            ? "border-destructive/40 bg-destructive/5"
                            : isDragging
                                ? "border-indigo-500/60 bg-indigo-500/5"
                                : fileName
                                    ? "border-emerald-500/40 bg-emerald-500/5"
                                    : "border-border/50 bg-card/20 hover:border-border hover:bg-card/40"
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={() => setIsDragging(false)}
                >

                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${clientError
                            ? "bg-destructive/10"
                            : fileName
                                ? "bg-emerald-500/10"
                                : "bg-muted/50"
                        }`}>
                        {clientError ? (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                        ) : (
                            <Upload className={`h-5 w-5 ${fileName ? "text-emerald-400" : "text-muted-foreground/50"}`} />
                        )}
                    </div>


                    <div>
                        <p className="text-sm font-medium text-foreground">
                            {fileName ?? "Drop files here or click to browse"}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground/50">
                            {fileSize
                                ? `${formatSize(fileSize)} · Ready to upload`
                                : `Resume, cover letter, or any file — up to ${MAX_FILE_LABEL}`}
                        </p>
                    </div>

                    <input
                        type="file"
                        name="file"
                        className="hidden"
                        required
                        onChange={handleFileChange}
                    />
                </label>


                {displayError && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-3">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        <div>
                            <p className="text-sm font-medium text-destructive">Upload failed</p>
                            <p className="mt-0.5 text-xs text-destructive/80">{displayError}</p>
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={pending || !canSubmit}
                    size="sm"
                    className="self-end gap-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500/50 disabled:opacity-40"
                >
                    {pending ? (
                        <span className="flex items-center gap-2">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Uploading…
                        </span>
                    ) : (
                        <>
                            <Upload className="h-3.5 w-3.5" />
                            Upload
                        </>
                    )}
                </Button>
            </form>


            {attachments.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/40 py-10 text-center">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-muted/30">
                        <FolderOpen className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/50">
                        Upload your resume or cover letter above.
                    </p>
                </div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {attachments.map((file) => {
                        const badge = getFileIcon(file.file_name);
                        return (
                            <li
                                key={file.id}
                                className="group flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/40 p-3 transition-colors hover:border-border/70"
                            >
                                <div className="flex min-w-0 items-center gap-3">

                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${FILE_BADGE_CLASSES[badge]}`}>
                                        {badge}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {file.file_name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground/50">
                                            {formatSize(file.file_size)}
                                            {file.file_size ? " · " : ""}
                                            {new Date(file.uploaded_at).toLocaleDateString("en-US")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-1">
                                    {file.signedUrl && (
                                        <a
                                            href={file.signedUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download={file.file_name}
                                            aria-label="Download file"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground"
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                    <form
                                        action={async () => {
                                            await deleteAttachment(file.id, file.file_path);
                                        }}
                                    >
                                        <button
                                            type="submit"
                                            aria-label="Delete file"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </form>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}