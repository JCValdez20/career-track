"use client";

import { useState, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import AuthToggle from "@/components/auth/AuthToggle";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { signIn } from "@/app/actions/auth";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(signIn, { error: null });
    const searchParams = useSearchParams();
    const justRegistered = searchParams.get("registered") === "true";

    return (
        <div className="min-h-screen flex bg-white">


            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">
                <Image
                    src="/images/authimage.jpg"
                    alt="CareerTrack Background"
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 0vw"
                    className="object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-linear-to-br from-indigo-950/90 via-slate-900/80 to-slate-950/95" />

                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full max-w-xl mx-auto">

                    <Link href="/" className="inline-block w-fit" aria-label="Back to home">
                        <Image
                            src="/images/logov2.png"
                            alt="CareerTrack"
                            width={144}
                            height={36}
                            className="w-36 object-contain hover:opacity-90 transition-opacity"
                            style={{ height: "auto" }}
                            priority
                        />
                    </Link>

                    <div className="space-y-4 my-auto py-12">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                            <span className="text-[11px] font-medium uppercase tracking-wider text-indigo-200">
                                Built for Job Seekers
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight leading-tight">
                            Find your next role, <br />
                            <span className="bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                                with intention.
                            </span>
                        </h1>
                        <p className="text-indigo-100/70 text-sm leading-relaxed max-w-sm">
                            Track applications, manage interview rounds, and organize your job search in one unified pipeline.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <div>
                            <p className="text-2xl font-bold tracking-tight text-white">12k+</p>
                            <p className="text-xs text-indigo-200/70 mt-0.5">Active job seekers</p>
                        </div>
                        <div className="border-l border-white/10 pl-6">
                            <p className="text-2xl font-bold tracking-tight text-white">3.2k</p>
                            <p className="text-xs text-indigo-200/70 mt-0.5">Offers landed this year</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-sm">


                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        <span>Back to home</span>
                    </Link>

                    <div className="flex lg:hidden mb-8">
                        <Link href="/" aria-label="Back to home">
                            <Image
                                src="/images/logov2.png"
                                alt="CareerTrack"
                                width={112}
                                height={28}
                                className="w-28 object-contain hover:opacity-90 transition-opacity"
                                style={{ height: "auto" }}
                                priority
                            />
                        </Link>
                    </div>

                    <AuthToggle active="login" />

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Welcome back
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Sign in to access your application pipeline.
                        </p>
                    </div>

                    {justRegistered && (
                        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 mb-5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-emerald-700">
                                Account created! Check your email to verify, then sign in.
                            </p>
                        </div>
                    )}

                    {state.error && (
                        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-5">
                            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-700">{state.error}</p>
                        </div>
                    )}

                    <form className="space-y-4" action={formAction}>
                        <div>
                            <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                                    Password
                                </label>
                                <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id="login-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-semibold py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign in</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                            or continue with
                        </span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    <GoogleLoginButton />
                </div>
            </div>

        </div>
    );
}