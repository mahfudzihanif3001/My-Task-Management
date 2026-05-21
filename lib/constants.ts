/**
 * Application constants for colors, sizes, and configurations
 */

// Color Palette
export const COLORS = {
  PRIMARY_DARK: "#2D5E41",
  PRIMARY_LIGHT: "#43B87A",
  PRIMARY_BG: "#f0f7f3",
  TEXT_DARK: "#1a1a1a",
  TEXT_GRAY: "#666666",
  TEXT_LIGHT: "#999999",
  BORDER_LIGHT: "#e0e0e0",
  WHITE: "#ffffff",
  SUCCESS: "#2e7d32",
  WARNING: "#ffa500",
  ERROR: "#ff6b6b",
  ERROR_BG: "#ffebee",
  WARNING_BG: "#fff3e0",
  SUCCESS_BG: "#e8f5e9",
} as const;

// Priority Levels
export const PRIORITY = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
} as const;

export const PRIORITY_LABEL = {
  [PRIORITY.HIGH]: "High",
  [PRIORITY.MEDIUM]: "Med",
  [PRIORITY.LOW]: "Low",
} as const;

export const PRIORITY_COLOR = {
  [PRIORITY.HIGH]: { bg: "#ffebee", text: "#c62828" },
  [PRIORITY.MEDIUM]: { bg: "#fff3e0", text: "#e65100" },
  [PRIORITY.LOW]: { bg: "#e8f5e9", text: "#2e7d32" },
} as const;

// Task Filter Status
export const FILTER_STATUS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
} as const;

// Sorting Options
export const SORT_OPTIONS = {
  CREATED: "created",
  DUE_DATE: "due_date",
  PRIORITY: "priority",
  DESCRIPTION: "description",
} as const;

// API Responses
export const API_MESSAGES = {
  TASK_CREATED: "Task created!",
  TASK_DELETED: "Task deleted",
  TASK_UPDATED: "Task completed!",
  TASK_FAILED_CREATE: "Failed to create task",
  TASK_FAILED_DELETE: "Error deleting task",
  TASK_FAILED_UPDATE: "Error updating task",
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  DESCRIPTION_REQUIRED: "Description is required",
} as const;
