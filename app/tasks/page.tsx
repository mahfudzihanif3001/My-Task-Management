"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { apiTasks } from "@/lib/apiClient";
import toast from "react-hot-toast";
import { LogOut, Plus } from "lucide-react";
import { COLORS, FILTER_STATUS, SORT_OPTIONS, API_MESSAGES } from "@/lib/constants";
import { getTodayDateString, formatCurrentDateTime } from "@/lib/dateUtils";
import { filterAndSortTasks, calculateTaskStats, countTasksDueToday } from "@/lib/taskUtils";
import { TaskItem } from "@/components/TaskItem";
import "@/app/tasks.css";

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
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(2);
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");
  const [sortBy, setSortBy] = useState<"created" | "due_date" | "priority" | "description">("created");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasNotifiedDue, setHasNotifiedDue] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [toastId, setToastId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

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
    return () => { isMounted = false; };
  }, [router]);

  useEffect(() => {
    if (status === "ready" && userId) fetchTasks(userId);
  }, [status, userId]);

  useEffect(() => {
    if (tasks.length > 0 && !hasNotifiedDue) {
      const todayStr = getTodayDateString();
      const dueTodayCount = countTasksDueToday(tasks, todayStr);
      if (dueTodayCount > 0) {
        const id = toast.custom((t) => (
          <div style={{ background: "white", border: `1px solid ${COLORS.PRIMARY_DARK}`, borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <span style={{ color: COLORS.PRIMARY_DARK, fontWeight: "600", fontSize: "13px" }}>✓ {dueTodayCount} task(s) due today!</span>
            <button onClick={() => toast.dismiss(t.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: COLORS.TEXT_LIGHT, padding: "0", display: "flex", alignItems: "center" }}>×</button>
          </div>
        ), { duration: Infinity });
        setToastId(id as string);
        setHasNotifiedDue(true);
      }
    }
  }, [tasks, hasNotifiedDue]);

  useEffect(() => {
    const updateTime = () => setCurrentTime(formatCurrentDateTime());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async (uId: string) => {
    try {
      const tasks = await apiTasks.list();
      setTasks(tasks || []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      toast.error(API_MESSAGES.TASK_FAILED_DELETE);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace("/");
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !userId) return;
    try {
      await apiTasks.create({
        description,
        dueDate: dueDate || undefined,
        priority,
        notes: notes || undefined,
      });
      setDescription("");
      setDueDate("");
      setPriority(2);
      setNotes("");
      fetchTasks(userId);
      toast.success(API_MESSAGES.TASK_CREATED);
    } catch (err) {
      toast.error(API_MESSAGES.TASK_FAILED_CREATE);
    }
  };

  const toggleComplete = async (taskId: string, currentCompleted: boolean) => {
    try {
      await apiTasks.update(taskId, !currentCompleted);
      fetchTasks(userId!);
      if (!currentCompleted) toast.success(API_MESSAGES.TASK_UPDATED);
    } catch (err) {
      toast.error(API_MESSAGES.TASK_FAILED_UPDATE);
    }
  };

  const confirmDeleteTask = (taskId: string) => {
    const foundTask = tasks.find((t) => t.id === taskId);
    if (foundTask) {
      setTaskToDelete(foundTask);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await apiTasks.delete(taskToDelete.id);
      fetchTasks(userId!);
      toast.success(API_MESSAGES.TASK_DELETED);
    } catch (err) {
      toast.error(API_MESSAGES.TASK_FAILED_DELETE);
    } finally {
      setTaskToDelete(null);
    }
  };

  const todayStr = getTodayDateString();
  const displayedTasks = filterAndSortTasks(tasks, searchQuery, filterStatus, sortBy);
  const stats = calculateTaskStats(tasks);

  if (status === "loading") {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#2D5E41]/30 border-t-[#2D5E41] rounded-full animate-spin"></div></div>;
  }

  return (
    <>
      <div className="dashboard">
        <div className="main-content">
          <header className="header">
            <div><div className="header-title">My Task Dashboard</div><div className="header-email">{userEmail}</div></div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ fontSize: "11px", color: "var(--text-gray)", fontWeight: "500", minWidth: "180px", textAlign: "right" }}>{currentTime}</div>
              <button onClick={() => { if (toastId) toast.dismiss(toastId); handleSignOut(); }} style={{ padding: "8px 16px", background: "var(--primary-dark)", color: "white", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--primary-light)"} onMouseLeave={(e) => e.currentTarget.style.background = "var(--primary-dark)"}>Logout</button>
            </div>
          </header>

          <div className="content">
            <div>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-value">{stats.total}</div><div className="stat-label">Total</div></div>
                <div className="stat-card"><div className="stat-value">{stats.completed}</div><div className="stat-label">Completed</div></div>
                <div className="stat-card"><div className="stat-value">{stats.active}</div><div className="stat-label">Active</div></div>
              </div>

              <div className="tasks-section">
                <div className="tasks-header"><div className="tasks-title">Tasks</div></div>
                <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                  <input type="text" className="search-box" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                  <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                    <option value="created">Created</option>
                    <option value="due_date">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="description">Description</option>
                  </select>
                </div>

                <div className="task-list">
                  {displayedTasks.length === 0 ? (
                    <div className="task-list-empty">No tasks yet. Create one to get started!</div>
                  ) : (
                    displayedTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleComplete}
                        onDelete={confirmDeleteTask}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-title"><Plus /> New Task</div>
              <form onSubmit={handleCreateTask}>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input type="text" className="form-input" placeholder="Task description..." value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input type="date" className="form-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-textarea" placeholder="Additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                </div>
                <button type="submit" className="form-submit">Create Task</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {taskToDelete && (
        <div className="modal-backdrop" onClick={() => setTaskToDelete(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              ⚠️ Hapus Task
            </div>
            <div className="modal-body">
              Apakah Anda yakin ingin menghapus task ini secara permanen? Tindakan ini tidak dapat dibatalkan.
              <div className="modal-task-desc">
                {taskToDelete.description}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setTaskToDelete(null)}>
                Batal
              </button>
              <button className="btn-confirm-delete" onClick={handleDeleteTask}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
