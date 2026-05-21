import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/**
 * POST /api/auth/signup
 * Signup dengan email dan password
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

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Sign up dengan Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Signup gagal" },
        { status: 400 }
      );
    }

    if (!data.session) {
      return NextResponse.json(
        { error: "Session tidak ditemukan" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Akun berhasil dibuat",
        session: {
          email: data.user?.email,
          token: data.session.access_token,
          userId: data.user?.id,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
