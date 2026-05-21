/**
 * Utility functions for task operations and filtering
 */

interface Task {
  id: string;
  user_id: string;
  description: string;
  due_date: string | null;
  priority: number;
  notes: string | null;
  completed: boolean;
}

type FilterStatus = "all" | "active" | "completed";
type SortBy = "created" | "due_date" | "priority" | "description";

/**
 * Filter tasks based on search query, status, and sort criteria
 * @param {Task[]} tasks - Array of tasks to filter
 * @param {string} searchQuery - Search text
 * @param {FilterStatus} filterStatus - Filter by status (all/active/completed)
 * @param {SortBy} sortBy - Sort criteria
 * @returns {Task[]} Filtered and sorted tasks
 */
export const filterAndSortTasks = (
  tasks: Task[],
  searchQuery: string,
  filterStatus: FilterStatus,
  sortBy: SortBy
): Task[] => {
  // Filter by search query
  let filtered = tasks.filter((task) =>
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter by status
  if (filterStatus === "active") {
    filtered = filtered.filter((task) => !task.completed);
  } else if (filterStatus === "completed") {
    filtered = filtered.filter((task) => task.completed);
  }

  // Sort tasks
  filtered.sort((a, b) => {
    if (sortBy === "due_date") {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return a.due_date.localeCompare(b.due_date);
    } else if (sortBy === "priority") {
      return a.priority - b.priority;
    } else if (sortBy === "description") {
      return a.description.localeCompare(b.description);
    }
    return 0; // Keep original order for "created"
  });

  return filtered;
};

/**
 * Calculate task statistics
 * @param {Task[]} tasks - Array of tasks
 * @returns {object} Object with total, completed, and active counts
 */
export const calculateTaskStats = (tasks: Task[]) => {
  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    active: tasks.filter((t) => !t.completed).length,
  };
};

/**
 * Count tasks due today and not completed
 * @param {Task[]} tasks - Array of tasks
 * @param {string} todayStr - Today's date in YYYY-MM-DD format
 * @returns {number} Count of tasks due today
 */
export const countTasksDueToday = (tasks: Task[], todayStr: string): number => {
  return tasks.filter((t) => !t.completed && t.due_date === todayStr).length;
};
