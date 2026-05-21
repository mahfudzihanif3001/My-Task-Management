/**
 * API Client untuk communicate dengan backend API routes
 * Menggantikan direct Supabase calls dengan API routes
 */

import { auth } from "./auth";

const API_BASE = "/api";

/**
 * Helper function untuk fetch dengan error handling
 */
async function apiFetch(url: string, options: RequestInit = {}) {
  const session = auth.getSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Attach user ID untuk authorization
  if (session?.userId) {
    headers["x-user-id"] = session.userId;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

// ============ Auth API ============

export const apiAuth = {
  /**
   * Login dengan email dan password
   */
  login: async (email: string, password: string) => {
    const result = await apiFetch(`${API_BASE}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return result;
  },

  /**
   * Signup dengan email dan password
   */
  signup: async (email: string, password: string) => {
    const result = await apiFetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return result;
  },

  /**
   * Logout
   */
  logout: async () => {
    const result = await apiFetch(`${API_BASE}/auth/logout`, {
      method: "POST",
    });
    return result;
  },
};

// ============ Tasks API ============

export const apiTasks = {
  /**
   * Get all tasks
   */
  list: async () => {
    const result = await apiFetch(`${API_BASE}/tasks`, {
      method: "GET",
    });
    return result.tasks;
  },

  /**
   * Create new task
   */
  create: async (taskData: {
    description: string;
    dueDate?: string;
    priority?: number;
    notes?: string;
  }) => {
    const result = await apiFetch(`${API_BASE}/tasks`, {
      method: "POST",
      body: JSON.stringify(taskData),
    });
    return result.task;
  },

  /**
   * Update task (toggle completed)
   */
  update: async (taskId: string, completed: boolean) => {
    const result = await apiFetch(`${API_BASE}/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    });
    return result.task;
  },

  /**
   * Delete task
   */
  delete: async (taskId: string) => {
    await apiFetch(`${API_BASE}/tasks/${taskId}`, {
      method: "DELETE",
    });
  },
};
