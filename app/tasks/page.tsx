"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";

export default function TasksPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const session = auth.getSession();
      if (!isMounted) return;

      const email = session?.email ?? null;
      if (!email) {
        router.replace("/");
        return;
      }

      setUserEmail(email);
      setStatus("ready");
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace("/");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <main className="mx-auto max-w-md">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-black">Hello World</h1>
          <p className="text-sm text-gray-600">Signed in as: {userEmail}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="px-4 py-2 bg-black text-white text-sm font-semibold hover:bg-gray-900"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
