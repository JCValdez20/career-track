"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, Clock, MapPin, Video, ExternalLink } from "lucide-react";
import { createInterview, addInterviewNote, deleteInterview } from "@/app/actions/interview";
import type { Application, InterviewWithApplication } from "@/types/application";

interface CalendarClientProps {
    applications: Pick<Application, "id" | "company" | "position">[];
    interviews: InterviewWithApplication[];
}

export default function CalendarClient({ applications, interviews }: CalendarClientProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<"month" | "week">("month");

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const selectedEvent = useMemo(() => {
        return interviews.find(inv => inv.id === selectedEventId) || null;
    }, [interviews, selectedEventId]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = [];

        if (viewMode === "month") {
            const daysInMonth = getDaysInMonth(year, month);
            const startDay = new Date(year, month, 1).getDay();

            for (let i = startDay - 1; i >= 0; i--) {
                days.push({ date: new Date(year, month - 1, getDaysInMonth(year, month - 1) - i), isCurrentMonth: false });
            }
            for (let i = 1; i <= daysInMonth; i++) {
                days.push({ date: new Date(year, month, i), isCurrentMonth: true });
            }
            const remaining = 42 - days.length;
            for (let i = 1; i <= remaining; i++) {
                days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
            }
        } else {
            const date = currentDate.getDate();
            const day = currentDate.getDay();
            const startOfWeek = new Date(year, month, date - day);

            for (let i = 0; i < 7; i++) {
                days.push({
                    date: new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i),
                    isCurrentMonth: true
                });
            }
        }
        return days;
    }, [currentDate, viewMode]);

    const nextPeriod = () => {
        setCurrentDate(prev => {
            const next = new Date(prev);
            if (viewMode === "month") next.setMonth(next.getMonth() + 1);
            else next.setDate(next.getDate() + 7);
            return next;
        });
    };

    const prevPeriod = () => {
        setCurrentDate(prev => {
            const back = new Date(prev);
            if (viewMode === "month") back.setMonth(back.getMonth() - 1);
            else back.setDate(back.getDate() - 7);
            return back;
        });
    };

    const jumpToToday = () => setCurrentDate(new Date());


    async function handleCreate(formData: FormData) {
        const date = formData.get("scheduledDate");
        const time = formData.get("scheduledTime");

        if (date && time) {
            const localDateTime = new Date(`${date}T${time}`);
            formData.set("scheduledAtIso", localDateTime.toISOString());
        }

        const res = await createInterview({ error: null }, formData);
        if (res.error) alert(res.error);
        else setIsAddOpen(false);
    }

    async function handleAddNote(formData: FormData) {
        if (!selectedEvent) return;
        const res = await addInterviewNote(selectedEvent.id, { error: null }, formData);
        if (res.error) {
            alert(res.error);
        } else {
            (document.getElementById("note-form") as HTMLFormElement)?.reset();
        }
    }

    async function handleDelete() {
        if (!selectedEvent) return;
        if (!confirm("Are you sure you want to delete this interview?")) return;

        const res = await deleteInterview(selectedEvent.id);
        if (res.error) {
            alert(res.error);
        } else {
            setIsDetailOpen(false);
            setSelectedEventId(null);
        }
    }

    const formatMonthYear = (d: Date) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const isToday = (d: Date) => {
        const today = new Date();
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    };

    if (!isMounted) return null;

    return (
        <div className="flex flex-col rounded-2xl border border-border/60 bg-card/40 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 p-4 sm:p-6 bg-card/60">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                    {formatMonthYear(currentDate)}
                </h2>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
                    <div className="order-1 sm:order-2 flex items-center rounded-lg border border-border/60 bg-background/50 p-1">
                        <button onClick={() => setViewMode("month")} className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold rounded-md transition-all ${viewMode === "month" ? "bg-indigo-500/20 text-indigo-400" : "text-muted-foreground hover:bg-muted"}`}>Month</button>
                        <button onClick={() => setViewMode("week")} className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold rounded-md transition-all ${viewMode === "week" ? "bg-indigo-500/20 text-indigo-400" : "text-muted-foreground hover:bg-muted"}`}>Week</button>
                    </div>

                    <div className="order-2 sm:order-1 flex items-center justify-between sm:justify-center rounded-lg border border-border/60 bg-background/50 p-1">
                        <button onClick={prevPeriod} className="p-2 sm:p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft size={18} /></button>
                        <button onClick={jumpToToday} className="flex-1 sm:flex-none px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold hover:bg-muted rounded-md transition-colors">Today</button>
                        <button onClick={nextPeriod} className="p-2 sm:p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-border/40 bg-muted/20">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="py-2 text-center text-[10px] sm:text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                        <span className="sm:hidden">{day.charAt(0)}</span>
                        <span className="hidden sm:inline">{day}</span>
                    </div>
                ))}
            </div>

            <div className={`grid grid-cols-7 bg-border/40 gap-px ${viewMode === "month" ? "auto-rows-[1fr]" : ""}`}>
                {calendarDays.map((dayItem, idx) => {
                    const dayEvents = interviews.filter(inv => {
                        const invDate = new Date(inv.scheduled_at);
                        return invDate.getDate() === dayItem.date.getDate() && invDate.getMonth() === dayItem.date.getMonth() && invDate.getFullYear() === dayItem.date.getFullYear();
                    });

                    return (
                        <div key={idx} onClick={() => { setSelectedDate(dayItem.date); setIsAddOpen(true); }} className={`min-h-20 sm:min-h-30 bg-card p-1 sm:p-2 transition-colors hover:bg-muted/30 cursor-pointer flex flex-col gap-1 sm:gap-1.5 ${!dayItem.isCurrentMonth ? "opacity-40" : ""}`}>
                            <span className={`text-[10px] sm:text-xs font-semibold ml-0.5 sm:ml-1 mt-0.5 sm:mt-1 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full ${isToday(dayItem.date) ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30" : "text-foreground"}`}>
                                {dayItem.date.getDate()}
                            </span>

                            <div className="flex flex-col gap-1 mt-1 px-0.5 sm:px-0">
                                {dayEvents.map(event => (
                                    <div key={event.id} onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedEventId(event.id);
                                        setIsDetailOpen(true);
                                    }} className="group truncate rounded-full sm:rounded-md bg-transparent sm:bg-indigo-500/10 sm:border sm:border-indigo-500/20 p-0.5 sm:px-2 sm:py-1.5 text-[11px] font-medium text-indigo-300 hover:bg-indigo-500/20 transition-colors cursor-pointer">
                                        <div className="flex sm:hidden justify-center items-center h-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" /></div>
                                        <div className="hidden sm:flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                            <span className="truncate">{new Date(event.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="hidden sm:block font-semibold text-indigo-100 truncate mt-0.5">{event.applications?.company}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {isAddOpen && selectedDate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-4 sm:p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
                        <button onClick={() => setIsAddOpen(false)} className="absolute right-4 top-4 p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors"><X size={18} /></button>
                        <h3 className="text-lg font-bold mb-4">Schedule Interview</h3>

                        <form action={handleCreate} className="flex flex-col gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">Application</label>
                                <select name="applicationId" required className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-indigo-500">
                                    <option value="">Select a company...</option>
                                    {applications.map(app => (
                                        <option key={app.id} value={app.id}>{app.company} - {app.position}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Date</label>
                                    <input
                                        type="date"
                                        name="scheduledDate"
                                        required
                                        defaultValue={
                                            selectedDate
                                                ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
                                                : ""
                                        }
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Time</label>
                                    <input
                                        type="time"
                                        name="scheduledTime"
                                        required
                                        defaultValue="09:00"
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Round Type</label>
                                    <select name="type" required className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-indigo-500">
                                        <option value="phone">Phone Screen</option>
                                        <option value="technical">Technical</option>
                                        <option value="onsite">On-site</option>
                                        <option value="final">Final Round</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Duration (mins)</label>
                                    <input type="number" name="durationMinutes" defaultValue={60} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-indigo-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Location / Link</label>
                                    <input type="text" name="location" placeholder="Zoom link or address" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-indigo-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Interviewer Name</label>
                                    <input type="text" name="interviewer" placeholder="e.g. Jane Doe" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-indigo-500" />
                                </div>
                            </div>

                            <div className="mt-2 flex gap-3">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-md">Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {isDetailOpen && selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-lg rounded-2xl border border-border/60 bg-card shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden">

                        <div className="p-6 border-b border-border/40 shrink-0 bg-muted/10 relative">
                            <button onClick={() => setIsDetailOpen(false)} className="absolute right-4 top-4 p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                                <X size={18} />
                            </button>

                            <div className="flex items-center gap-2 mb-3">
                                <span className="rounded-md bg-indigo-500/15 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                                    {selectedEvent.type}
                                </span>
                                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider
                                    ${selectedEvent.outcome === "passed" ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400" :
                                        selectedEvent.outcome === "failed" ? "bg-rose-500/15 border-rose-500/20 text-rose-400" :
                                            "bg-slate-500/15 border-slate-500/20 text-slate-400"}`
                                }>
                                    {selectedEvent.outcome || "PENDING"}
                                </span>
                            </div>

                            <div className="pr-8">
                                <h3 className="text-2xl font-bold text-foreground leading-tight tracking-tight">{selectedEvent.applications?.company}</h3>
                                <p className="text-muted-foreground text-sm mt-1">{selectedEvent.applications?.position}</p>
                            </div>

                            <div className="mt-4 flex">
                                <Link href={`/dashboard/applications?applicationId=${selectedEvent.application_id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-background border border-border/60 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-sm">
                                    <ExternalLink size={14} className="text-indigo-400" /> View Application
                                </Link>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-card p-4 shadow-sm">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                                        <Clock size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-foreground">
                                            {new Date(selectedEvent.scheduled_at).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {new Date(selectedEvent.scheduled_at).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })} • {selectedEvent.duration_minutes} mins
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-card p-4 shadow-sm">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                                        <Video size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">
                                            {selectedEvent.interviewer || "TBA"}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                                            {selectedEvent.location || "No location"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                    Interview Notes
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground">
                                        {selectedEvent.interview_notes?.length || 0}
                                    </span>
                                </h4>

                                <div className="flex flex-col gap-3 mb-4">
                                    {(!selectedEvent.interview_notes || selectedEvent.interview_notes.length === 0) ? (
                                        <div className="text-sm text-muted-foreground/60 italic p-6 text-center border border-dashed border-border/40 rounded-xl bg-muted/10">
                                            No prep notes yet. Jot down questions or talking points here.
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-border/40 bg-card divide-y divide-border/40 shadow-sm overflow-hidden">
                                            {selectedEvent.interview_notes.map(note => (
                                                <div key={note.id} className="p-3.5 text-sm text-foreground hover:bg-muted/30 transition-colors">
                                                    {note.content}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <form id="note-form" action={handleAddNote} className="relative">
                                    <input
                                        type="text"
                                        name="content"
                                        placeholder="Add a preparation note..."
                                        className="w-full rounded-xl border border-input bg-background pl-4 pr-16 py-3 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm placeholder:text-muted-foreground/60"
                                        autoComplete="off"
                                    />
                                    <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors">
                                        Add
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 border-t border-border/40 shrink-0 flex justify-between items-center bg-muted/10">
                            <button onClick={handleDelete} className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors">
                                Delete Interview
                            </button>
                            <button onClick={() => setIsDetailOpen(false)} className="rounded-xl border border-border/60 bg-background shadow-sm px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}