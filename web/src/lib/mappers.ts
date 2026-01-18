import { DbAppSettings, DbTask, DbTaskLog, Task, TaskLog } from "../types";

export function mapTask(row: DbTask): Task {
  return {
    id: row.id,
    title: row.title,
    icon: row.icon,
    color: row.color,
    type: row.type,
    frequencyType: row.frequency_type,
    targetCount: row.target_count ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapTaskLog(row: DbTaskLog): TaskLog {
  return {
    id: row.id,
    taskId: row.task_id,
    performedAt: row.performed_at,
    logicalDate: row.logical_date,
  };
}

export function mapSettings(row: DbAppSettings) {
  return {
    dayStartHour: row.day_start_hour,
  };
}

export function taskToDbInsert(task: Omit<Task, "id" | "createdAt" | "status">) {
  return {
    title: task.title,
    icon: task.icon,
    color: task.color,
    type: task.type,
    frequency_type: task.frequencyType,
    target_count: task.type === "goal" ? task.targetCount ?? 1 : null,
    status: "active",
  };
}
