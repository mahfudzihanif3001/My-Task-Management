import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/**
 * GET /api/tasks
 * Ambil semua tasks untuk user yang authenticated
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID dari header (dari client yang sudah terauth)
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User tidak authenticated" },
        { status: 401 }
      );
    }

    // Ambil tasks dari database (RLS akan filter by user_id)
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get tasks error:", error);
      return NextResponse.json(
        { error: "Gagal mengambil tasks" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        tasks: data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks
 * Buat task baru
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User tidak authenticated" },
        { status: 401 }
      );
    }

    const { description, dueDate, priority, notes } = await request.json();

    // Validasi input
    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: "Description tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Insert task ke database
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        description,
        due_date: dueDate || null,
        priority: priority || 2,
        notes: notes || null,
        completed: false,
      })
      .select();

    if (error) {
      console.error("Create task error:", error);
      return NextResponse.json(
        { error: "Gagal membuat task" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Task berhasil dibuat",
        task: data[0],
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
