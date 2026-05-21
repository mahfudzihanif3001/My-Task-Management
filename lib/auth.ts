import { supabase } from "./supabaseClient";

/**
 * Auth utilities - menggunakan API routes sebagai backend
 * Ini lebih secure daripada direct Supabase calls dari client
 */
export const auth = {
  signIn: async (email: string, password: string) => {
    try {
      // Call API route instead of direct Supabase
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Login gagal" };
      }

      // Store session in localStorage
      if (data.session) {
        localStorage.setItem("auth_session", JSON.stringify(data.session));
        return { success: true, email: data.session.email };
      }

      return { success: false, error: "Login gagal" };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      // Call API route instead of direct Supabase
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Signup gagal" };
      }

      // Store session in localStorage
      if (data.session) {
        localStorage.setItem("auth_session", JSON.stringify(data.session));
        return {
          success: true,
          message: "Akun berhasil dibuat dan siap digunakan",
        };
      }

      return { success: false, error: "Signup gagal" };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  },

  getSession: () => {
    if (typeof window === "undefined") return null;
    try {
      const session = localStorage.getItem("auth_session");
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },

  signOut: async () => {
    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Sign out error:", err);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_session");
    }
  },

  onAuthStateChange: (callback: (session: any) => void) => {
    // For now, using localStorage-based state management
    // In a more advanced setup, could use subscription pattern
    const session = auth.getSession();
    callback(session);

    // Optional: Listen for storage changes (e.g., from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_session") {
        const newSession = e.newValue ? JSON.parse(e.newValue) : null;
        callback(newSession);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  },
};
