export type TaskType = 'goal' | 'counter';
export type FrequencyType = 'daily' | 'weekly' | 'monthly';
export type TaskStatus = 'active' | 'archived';

export interface Task {
  id: string;
  title: string;
  icon: string;
  color: string;
  type: TaskType;
  frequencyType: FrequencyType;
  targetCount?: number; // Only for goal type
  status: TaskStatus;
  createdAt: string;
}

export interface TaskLog {
  id: string;
  taskId: string;
  performedAt: string; // ISO timestamp
  logicalDate: string; // YYYY-MM-DD format
}

export interface AppSettings {
  dayStartHour: number;
}

export interface DbTask {
  id: string;
  title: string;
  icon: string;
  color: string;
  type: TaskType;
  frequency_type: FrequencyType;
  target_count: number | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface DbTaskLog {
  id: string;
  task_id: string;
  performed_at: string;
  logical_date: string;
  created_at: string;
}

export interface DbAppSettings {
  id: number;
  day_start_hour: number;
  created_at: string;
  updated_at: string;
}
