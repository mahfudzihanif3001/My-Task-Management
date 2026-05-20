import { supabase } from "./supabaseClient";

export const auth = {
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Translate Supabase error to user-friendly message
        const friendlyError =
          error.message.includes("Invalid login credentials")
            ? "Email atau password salah"
            : error.message;
        return { success: false, error: friendlyError };
      }

      if (data.session?.user) {
        const sessionData = {
          email: data.session.user.email,
          token: data.session.access_token,
          userId: data.session.user.id,
        };
        localStorage.setItem("auth_session", JSON.stringify(sessionData));
        return { success: true, email: data.session.user.email };
      }

      return { success: false, error: "Login gagal" };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Auto sign in after signup
      if (data.user) {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (!signInError && signInData.session?.user) {
          const sessionData = {
            email: signInData.session.user.email,
            token: signInData.session.access_token,
            userId: signInData.session.user.id,
          };
          localStorage.setItem("auth_session", JSON.stringify(sessionData));
          return {
            success: true,
            message: "Account created and signed in successfully.",
          };
        }
      }

      return {
        success: true,
        message: "Account created. You can now sign in.",
      };
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
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_session");
    }
  },

  onAuthStateChange: (callback: (session: any) => void) => {
    const unsubscribe = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        const sessionData = {
          email: session.user.email,
          token: session.access_token,
          userId: session.user.id,
        };
        localStorage.setItem("auth_session", JSON.stringify(sessionData));
        callback(sessionData);
      } else {
        localStorage.removeItem("auth_session");
        callback(null);
      }
    });

    return () => unsubscribe.data?.subscription?.unsubscribe?.();
  },
};
