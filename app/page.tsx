"use client"
import React from "react";
import { useTheme } from "next-themes";
import { Navbar } from "@/components/navbar";
import cookie from "js-cookie";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
interface Props {
  onSignIn?: () => void;
  onGuest?: () => void;
}

export default function HomeLanding({ onSignIn, onGuest }: Props) {
  const { theme, setTheme } = useTheme();
  const { isAuth, user } = useAuth()
  if(isAuth && user) {
    window.location.href = "/app"
  }
  const router = useRouter()
  const handleSignIn = () => {
    if (onSignIn) return onSignIn();
    if (typeof window !== "undefined") isAuth ? router.replace("/app") : router.replace("/login")
  };

  const handleGuest = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (onGuest) return onGuest();
    if (typeof window !== "undefined") window.location.href = "/app";
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 flex flex-col transition-colors">
      <Navbar />

      {/* Hero */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="max-w-md w-full flex flex-col items-center text-center">
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight text-slate-900 dark:text-slate-100">
            Keep it simple
          </h1>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Minimal, focused, and fast. Sign in to sync across devices or try Guest Mode.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:justify-center">
            <button
              onClick={handleSignIn}
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg shadow-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors bg-gradient-to-r from-indigo-600 to-sky-500 text-white"
              aria-label="Sign in to your account"
            >
              Sign In
            </button>

            <a
              href="#guest"
              onClick={handleGuest}
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg border border-transparent bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              aria-label="Continue as guest"
            >
              Continue as Guest
            </a>
          </div>

          <div className="mt-6 text-xs text-slate-400 dark:text-slate-500">
            No credit card needed • Try guest mode to explore features
          </div>
        </div>
      </div>
    </main>
  );
}
