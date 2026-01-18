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
