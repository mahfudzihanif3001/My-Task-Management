import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/**
 * PATCH /api/tasks/[id]
 * Update task (toggle completed status)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User tidak authenticated" },
        { status: 401 }
      );
    }

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID diperlukan" },
        { status: 400 }
      );
    }

    const { completed } = await request.json();

    // Update task (RLS akan memastikan hanya owner yang bisa update)
    const { data, error } = await supabase
      .from("tasks")
      .update({ completed })
      .eq("id", taskId)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.error("Update task error:", error);
      return NextResponse.json(
        { error: "Gagal update task" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Task tidak ditemukan atau tidak punya akses" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Task berhasil diupdate",
        task: data[0],
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("PATCH /api/tasks/[id] error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/[id]
 * Hapus task
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User tidak authenticated" },
        { status: 401 }
      );
    }

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID diperlukan" },
        { status: 400 }
      );
    }

    // Delete task (RLS / filter memastikan hanya owner yang bisa delete)
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", userId);

    if (error) {
      console.error("Delete task error:", error);
      return NextResponse.json(
        { error: "Gagal menghapus task" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Task berhasil dihapus",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/tasks/[id] error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
