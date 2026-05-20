"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

interface Task {
  id: string;
  user_id: string;
  description: string;
  due_date: string | null;
  priority: number;
  notes: string | null;
  completed: boolean;
}

export default function TasksPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  const [tasks, setTasks] = useState<Task[]>([]);

  // Form fields
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(2); // 2 = sedang
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isToastDismissed, setIsToastDismissed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const session = auth.getSession();
      if (!isMounted) return;

      if (!session?.email || !session?.userId) {
        router.replace("/");
        return;
      }

      setUserEmail(session.email);
      setUserId(session.userId);
      setStatus("ready");
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (status === "ready" && userId) {
      fetchTasks();
    }
  }, [status, userId]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data || []);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace("/");
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg("Description is required");
      return;
    }
    setErrorMsg("");

    const newTask = {
      description,
      due_date: dueDate || null,
      priority,
      notes: notes || null,
      user_id: userId,
    };

    const { error } = await supabase.from("tasks").insert([newTask]);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setDescription("");
      setDueDate("");
      setPriority(2);
      setNotes("");
      fetchTasks();
    }
  };

  const toggleComplete = async (taskId: string, currentCompleted: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !currentCompleted })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task:", error);
    } else {
      fetchTasks();
    }
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) {
      console.error("Error deleting task:", error);
    } else {
      fetchTasks();
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const dueTodayTasks = tasks.filter(t => !t.completed && t.due_date === todayStr);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-black">
      <main className="mx-auto max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Tasks</h1>
            <p className="text-sm text-gray-600">{userEmail}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-200 text-black text-sm font-semibold hover:bg-gray-300"
          >
            Sign Out
          </button>
        </div>

        <form onSubmit={handleCreateTask} className="mb-8 p-4 border border-gray-300 space-y-4">
          <h2 className="font-semibold text-lg">Create New Task</h2>
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 bg-white text-black px-3 py-2"
              placeholder="What needs to be done?"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 bg-white text-black px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full border border-gray-300 bg-white text-black px-3 py-2"
              >
                <option value={1}>High</option>
                <option value={2}>Medium</option>
                <option value={3}>Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 bg-white text-black px-3 py-2"
              rows={2}
            ></textarea>
          </div>

          <button type="submit" className="px-4 py-2 bg-black text-white font-semibold text-sm hover:bg-gray-900">
            Add Task
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Your Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="p-4 border border-gray-300 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id, task.completed)}
                      className="w-5 h-5 cursor-pointer accent-black"
                    />
                    <span className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                      {task.description}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>

                <div className="flex gap-4 text-xs ml-8 items-center">
                  {task.due_date && <span className="text-gray-600">Due: {task.due_date}</span>}
                  <span className={`px-2 py-0.5 rounded text-white font-semibold ${task.priority === 1 ? 'bg-red-500' : task.priority === 2 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                   {task.priority === 1 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'} Priority
                  </span>
                </div>
                {task.notes && (
                  <div className="text-sm text-gray-700 ml-8 mt-1 p-2 bg-gray-50 border whitespace-pre-wrap">
                    {task.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Toast Alert for Due Today */}
      {!isToastDismissed && dueTodayTasks.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded shadow-lg max-w-sm z-50">
          <div className="flex justify-between items-center border-b border-blue-300 pb-1 mb-2">
            <span className="font-bold">⚠️ Due Today!</span>
            <button 
              onClick={() => setIsToastDismissed(true)} 
              className="text-blue-800 hover:text-blue-600 font-bold ml-4 leading-none text-xl"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <ul className="text-sm list-disc pl-4 space-y-1">
            {dueTodayTasks.map(t => (
              <li key={t.id}>{t.description}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
