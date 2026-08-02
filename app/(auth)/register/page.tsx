"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import AuthToggle from "@/components/auth/AuthToggle";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
                            className="w-36 h-auto object-contain hover:opacity-90 transition-opacity"
                            priority
                        />
                    </Link>

                    <div className="space-y-4 my-auto py-12">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[11px] font-medium uppercase tracking-wider text-indigo-200">
                                Get Started Free
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight leading-tight">
                            Your entire career, <br />
                            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                                beautifully organized.
                            </span>
                        </h1>
                        <p className="text-indigo-100/70 text-sm leading-relaxed max-w-sm">
                            Create an account in seconds and track every application, technical interview, and offer letter.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <div>
                            <p className="text-2xl font-bold tracking-tight text-white">12k+</p>
                            <p className="text-xs text-indigo-200/70 mt-0.5">Active job seekers</p>
                        </div>
                        <div className="border-l border-white/10 pl-6">
                            <p className="text-2xl font-bold tracking-tight text-white">4.8/5</p>
                            <p className="text-xs text-indigo-200/70 mt-0.5">Average community rating</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-sm py-6">

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
                                className="w-28 h-auto object-contain hover:opacity-90 transition-opacity"
                                priority
                            />
                        </Link>
                    </div>

                    <AuthToggle active="register" />

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Create your account
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Start tracking your job search pipeline today.
                        </p>
                    </div>

                    <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Jane Cooper"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                                    required
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

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((s) => !s)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    aria-label={showConfirm ? "Hide password" : "Show password"}
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <label className="flex items-start gap-2 pt-1 text-xs text-slate-600 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                required
                            />
                            <span>
                                I agree to the{" "}
                                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-2">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-2">
                                    Privacy Policy
                                </a>
                            </span>
                        </label>

                        <button
                            type="submit"
                            className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-semibold py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-150"
                        >
                            <span>Create account</span>
                            <ArrowRight className="w-4 h-4" />
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