/**
 * TaskItem Component
 * Displays individual task with status, priority, and action buttons
 * 
 * @component
 */

import { CheckCircle2, Circle, AlertCircle, Lock, Calendar, Trash2 } from "lucide-react";
import { COLORS, PRIORITY_LABEL, PRIORITY_COLOR } from "@/lib/constants";
import { isTaskOverdue, isTaskDeadlineToday } from "@/lib/dateUtils";

interface Task {
  id: string;
  user_id: string;
  description: string;
  due_date: string | null;
  priority: number;
  notes: string | null;
  completed: boolean;
}

interface TaskItemProps {
  /** Task data */
  task: Task;
  /** Callback when checkbox is clicked */
  onToggle: (taskId: string, currentCompleted: boolean) => void;
  /** Callback when delete button is clicked */
  onDelete: (taskId: string) => void;
}

/**
 * TaskItem Component
 * 
 * Features:
 * - Shows task description with icons for overdue/deadline
 * - Displays priority badge with color coding
 * - Shows notes preview
 * - Disabled checkbox for overdue tasks
 * - Delete button
 */
export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const isOverdue = isTaskOverdue(task.due_date, task.completed);
  const isDeadlineToday = isTaskDeadlineToday(task.due_date, task.completed);
  const priorityColor =
    PRIORITY_COLOR[task.priority as keyof typeof PRIORITY_COLOR] ||
    PRIORITY_COLOR[3];
  const priorityLabel =
    PRIORITY_LABEL[task.priority as keyof typeof PRIORITY_LABEL] ||
    PRIORITY_LABEL[3];

  const handleCheckClick = (e: React.MouseEvent) => {
    if (isOverdue) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onToggle(task.id, task.completed);
  };

  return (
    <div
      className={`task-item ${task.completed ? "task-completed" : ""} ${
        isOverdue ? "deadline" : ""
      }`}
    >
      {/* Checkbox Button */}
      <button
        type="button"
        className="task-checkbox"
        disabled={!!isOverdue}
        onClick={handleCheckClick}
        style={{
          opacity: isOverdue ? 0.5 : 1,
          cursor: isOverdue ? "not-allowed" : "pointer",
          pointerEvents: isOverdue ? "none" : "auto",
        }}
        title={
          isOverdue ? "Cannot complete overdue tasks" : "Mark as complete"
        }
      >
        {task.completed ? <CheckCircle2 /> : <Circle />}
      </button>

      {/* Task Content */}
      <div className="task-content">
        {/* Task Description with Icons */}
        <div className="task-description">
          {isOverdue && (
            <Lock
              size={14}
              style={{ flexShrink: 0, marginRight: "4px" }}
              color={COLORS.ERROR}
            />
          )}
          {isDeadlineToday && !isOverdue && (
            <AlertCircle
              size={14}
              style={{ flexShrink: 0, marginRight: "4px" }}
              color={COLORS.WARNING}
            />
          )}
          <span>{task.description}</span>
        </div>

        {/* Task Metadata (Due Date & Priority) */}
        <div className="task-meta">
          {task.due_date && (
            <span className={isOverdue ? "task-deadline-badge" : ""}>
              {isOverdue && <AlertCircle size={12} />}
              <Calendar size={12} /> {task.due_date}
            </span>
          )}
          <span
            style={{
              background: priorityColor.bg,
              padding: "2px 8px",
              borderRadius: "4px",
              color: priorityColor.text,
              fontSize: "11px",
              fontWeight: "600",
            }}
          >
            {priorityLabel}
          </span>
        </div>

        {/* Notes Preview */}
        {task.notes && <div className="task-notes">📝 {task.notes}</div>}
      </div>

      {/* Delete Button */}
      <button className="task-delete" onClick={() => onDelete(task.id)}>
        <Trash2 />
      </button>
    </div>
  );
}
