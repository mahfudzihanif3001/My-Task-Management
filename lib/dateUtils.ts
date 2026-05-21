/**
 * Utility functions for date operations and formatting
 */

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getTodayDateString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

/**
 * Format date to readable string for navbar
 * @returns {string} Formatted date and time
 */
export const formatCurrentDateTime = (): string => {
  const now = new Date();
  return now.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

/**
 * Check if a task is overdue (past deadline and not completed)
 * @param {string | null} dueDate - The due date of task
 * @param {boolean} isCompleted - Whether task is completed
 * @returns {boolean} True if task is overdue
 */
export const isTaskOverdue = (dueDate: string | null, isCompleted: boolean): boolean => {
  if (!dueDate || isCompleted) return false;
  return dueDate < getTodayDateString();
};

/**
 * Check if a task has deadline today
 * @param {string | null} dueDate - The due date of task
 * @param {boolean} isCompleted - Whether task is completed
 * @returns {boolean} True if task is due today
 */
export const isTaskDeadlineToday = (dueDate: string | null, isCompleted: boolean): boolean => {
  if (!dueDate || isCompleted) return false;
  return dueDate === getTodayDateString();
};
