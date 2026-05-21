import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/**
 * POST /api/auth/login
 * Login dengan email dan password
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password diperlukan" },
        { status: 400 }
      );
    }

    // Sign in dengan Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Login gagal" },
        { status: 401 }
      );
    }

    if (!data.session) {
      return NextResponse.json(
        { error: "Session tidak ditemukan" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Login berhasil",
        session: {
          email: data.user?.email,
          token: data.session.access_token,
          userId: data.user?.id,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
