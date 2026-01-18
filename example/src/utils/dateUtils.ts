import { TaskLog } from '../types';

export function getLogicalDate(date: Date, dayStartHour: number): string {
  const adjustedDate = new Date(date);
  if (adjustedDate.getHours() < dayStartHour) {
    adjustedDate.setDate(adjustedDate.getDate() - 1);
  }
  return adjustedDate.toISOString().split('T')[0];
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  return new Date(d.setDate(diff));
}

export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getWeekProgress(taskLogs: TaskLog[], dayStartTime: number): { current: number; target: number } {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = getWeekEnd(now);
  
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weekEndStr = weekEnd.toISOString().split('T')[0];
  
  const logsThisWeek = taskLogs.filter(log => {
    return log.logicalDate >= weekStartStr && log.logicalDate <= weekEndStr;
  });
  
  // Count unique dates
  const uniqueDates = new Set(logsThisWeek.map(log => log.logicalDate));
  
  return {
    current: uniqueDates.size,
    target: 0, // Will be set from task.targetCount
  };
}

export function getMonthProgress(taskLogs: TaskLog[], dayStartTime: number): { current: number; target: number } {
  const now = new Date();
  const monthStart = getMonthStart(now);
  const monthEnd = getMonthEnd(now);
  
  const monthStartStr = monthStart.toISOString().split('T')[0];
  const monthEndStr = monthEnd.toISOString().split('T')[0];
  
  const logsThisMonth = taskLogs.filter(log => {
    return log.logicalDate >= monthStartStr && log.logicalDate <= monthEndStr;
  });
  
  // Count unique dates
  const uniqueDates = new Set(logsThisMonth.map(log => log.logicalDate));
  
  return {
    current: uniqueDates.size,
    target: 0, // Will be set from task.targetCount
  };
}

export function getTodayCount(taskLogs: TaskLog[], dayStartTime: number): number {
  const today = getLogicalDate(new Date(), dayStartTime);
  return taskLogs.filter(log => log.logicalDate === today).length;
}

export function getStreak(taskLogs: TaskLog[], dayStartTime: number): number {
  if (taskLogs.length === 0) return 0;
  
  const uniqueDates = Array.from(new Set(taskLogs.map(log => log.logicalDate))).sort().reverse();
  const today = getLogicalDate(new Date(), dayStartTime);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const logDate of uniqueDates) {
    const expectedDate = currentDate.toISOString().split('T')[0];
    if (logDate === expectedDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}
