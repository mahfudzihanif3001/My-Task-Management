"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";

type StatusType = "idle" | "loading" | "error" | "success";
type AuthMode = "sign-in" | "sign-up";

const MIN_PASSWORD_LENGTH = 6;

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<StatusType>("idle");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("sign-in");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const session = auth.getSession();
      if (!isMounted) return;
      setUserEmail(session?.email ?? null);
    };

    loadSession();

    const unsubscribe = auth.onAuthStateChange((session) => {
      setUserEmail(session?.email ?? null);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userEmail) {
      router.replace("/tasks");
    }
  }, [router, userEmail]);

  const handleAuth = async () => {
    setMessage("");

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setStatus("error");
      setMessage(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setStatus("loading");

    try {
      let result;

      if (authMode === "sign-up") {
        result = await auth.signUp(email, password);
        if (!result.success) {
          setStatus("error");
          setMessage(result.error || "Sign up failed");
          return;
        }
        setStatus("success");
        setMessage(result.message || "Account created successfully.");
        // Auto redirect to dashboard after signup
        setTimeout(() => router.push("/tasks"), 800);
        return;
      }

      result = await auth.signIn(email, password);
      if (!result.success) {
        setStatus("error");
        setMessage(result.error || "Login failed");
        return;
      }

      setStatus("success");
      setMessage("Logged in successfully.");
      router.push("/tasks");
    } catch (err) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <main className="mx-auto max-w-md">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Task Manager</h1>
            <p className="text-sm text-gray-600">Sign in or create account</p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAuth();
            }} 
            className="space-y-4"
          >
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthMode("sign-in")}
                className={`flex-1 px-3 py-2 text-sm font-semibold ${
                  authMode === "sign-in"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("sign-up")}
                className={`flex-1 px-3 py-2 text-sm font-semibold ${
                  authMode === "sign-up"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 bg-white text-black text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Password</label>
              <div className="flex gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Min 6 characters"
                  className="flex-1 px-3 py-2 border border-gray-300 bg-white text-black text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="px-3 py-2 bg-gray-200 text-black text-sm font-medium hover:bg-gray-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-4 py-2 bg-black text-white text-sm font-semibold hover:bg-gray-900 disabled:opacity-50"
            >
              {status === "loading" ? "Processing..." : authMode === "sign-up" ? "Sign Up" : "Sign In"}
            </button>

            {message && (
              <div className={`px-3 py-2 text-sm ${status === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
