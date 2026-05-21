"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import "@/app/auth.css";

type StatusType = "idle" | "loading" | "error" | "success";
type AuthMode = "sign-in" | "sign-up";

const MIN_PASSWORD_LENGTH = 6;

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<StatusType>("idle");
  const [message, setMessage] = useState("");
  const [authMode, setAuthMode] = useState<AuthMode>("sign-in");
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const session = auth.getSession();
      if (session?.email) {
        setUserEmail(session.email);
      }
    };
    loadSession();

    const unsubscribe = auth.onAuthStateChange((session) => {
      setUserEmail(session?.email ?? null);
    });

    return () => unsubscribe();
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
      setMessage("Please enter a valid email address.");
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
        setMessage(result.message || "Account created successfully!");
        setTimeout(() => router.push("/tasks"), 1000);
        return;
      }
      result = await auth.signIn(email, password);
      if (!result.success) {
        setStatus("error");
        setMessage(result.error || "Login failed");
        return;
      }
      setStatus("success");
      setMessage("Welcome back!");
      router.push("/tasks");
    } catch (err) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-left">
          <div className="form-wrapper">
            <div className="brand-header">
              <div className="brand-logo">
                <div className="brand-logo-icon">
                  <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                </div>
                <span className="brand-name">MY TASK</span>
              </div>
              <h1>Welcome back, let's get started.</h1>
              <p>Sign in to your account to continue managing your tasks and projects.</p>
            </div>

            <div className="auth-toggle">
              <div className="auth-toggle-slider" style={{ transform: authMode === "sign-up" ? "translateX(calc(100% + 5px))" : "translateX(0)" }} />
              <button type="button" className={`auth-toggle-button ${authMode === "sign-in" ? "active" : ""}`} onClick={() => { setAuthMode("sign-in"); setMessage(""); }}>Sign In</button>
              <button type="button" className={`auth-toggle-button ${authMode === "sign-up" ? "active" : ""}`} onClick={() => { setAuthMode("sign-up"); setMessage(""); }}>Sign Up</button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
              <div className="form-fields">
                <div className="field-group">
                  <label className="field-label">Email Address</label>
                  <div className="field-input-wrapper">
                    <div className="field-icon"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg></div>
                    <div className="field-divider" />
                    <input type="email" className="field-input" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Password</label>
                  <div className="field-input-wrapper">
                    <div className="field-icon"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></div>
                    <div className="field-divider" />
                    <input type={showPassword ? "text" : "password"} className="field-input" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" className="eye-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      ) : (
                        <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <button type="submit" className="form-submit" disabled={status === "loading"}>
                {status === "loading" ? <div className="spinner" /> : (authMode === "sign-up" ? "CREATE ACCOUNT" : "SIGN IN")}
              </button>
              {message && <div className={`form-message ${status === "error" ? "error" : "success"}`}>{message}</div>}
            </form>
          </div>
        </div>

        <div className="auth-right">
          <div className="right-content">
            <div className="right-icon-box"><svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg></div>
            <h2>Elevate Your Productivity</h2>
            <p>Seamless task management designed for modern professionals and teams.</p>
            <div className="features-grid">
              <div className="feature-card"><div className="feature-card-value">12k+</div><div className="feature-card-label">Active Users</div></div>
              <div className="feature-card"><div className="feature-card-value">98%</div><div className="feature-card-label">Satisfaction</div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
