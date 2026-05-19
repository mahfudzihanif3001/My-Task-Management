"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type StatusType = "idle" | "loading" | "error" | "success";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<StatusType>("idle");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setUserEmail(data.session?.user.email ?? null);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUserEmail(session?.user.email ?? null);
    });

    loadSession();

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async () => {
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("success");
    setMessage("Signup success. Check your email to confirm.");
  };

  const handleSignIn = async () => {
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("success");
    setMessage("Signed in successfully.");
  };

  const handleSignOut = async () => {
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signOut();
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("success");
    setMessage("Signed out.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-lime-50 px-6 py-10">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <section className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Task Manager Challenge
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Sign in to manage your daily tasks.
            </h1>
            <p className="max-w-2xl text-base text-zinc-600">
              Login with email + password. Your tasks stay private and are secured with
              Supabase Row Level Security.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <label className="mb-2 block text-sm font-medium text-zinc-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-black/10 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:bg-white"
              />

              <label className="mb-2 mt-4 block text-sm font-medium text-zinc-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-black/10 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-amber-400 focus:bg-white"
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={status === "loading"}
                  className="flex-1 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={handleSignUp}
                  disabled={status === "loading"}
                  className="flex-1 rounded-xl border border-zinc-900/10 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Create Account
                </button>
              </div>

              {message && (
                <div
                  className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                    status === "error"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-black/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                Session Status
              </p>
              <div className="mt-4 text-sm text-zinc-200">
                {userEmail ? (
                  <div className="space-y-3">
                    <p>
                      Signed in as <span className="font-semibold">{userEmail}</span>
                    </p>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={status === "loading"}
                      className="w-full rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <p>Not signed in yet.</p>
                )}
              </div>
              <p className="mt-6 text-xs text-zinc-300">
                Next: build tasks list, sorting, and due-today alerts.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
