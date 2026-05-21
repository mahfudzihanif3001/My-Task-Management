import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Logout (client-side session clearing)
 */
export async function POST(request: NextRequest) {
  try {
    // Logout logic bisa lebih kompleks jika ada token blacklist
    // Untuk saat ini, client akan handle localStorage clearing

    return NextResponse.json(
      {
        success: true,
        message: "Logout berhasil",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
