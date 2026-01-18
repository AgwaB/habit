import { TaskLog } from '../types';

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getLogicalDate(date: Date, dayStartHour: number): string {
  const adjustedDate = new Date(date);
  if (adjustedDate.getHours() < dayStartHour) {
    adjustedDate.setDate(adjustedDate.getDate() - 1);
  }
  return formatLocalDate(adjustedDate);
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

export function getWeekProgress(taskLogs: TaskLog[], dayStartTime: number): number {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = getWeekEnd(now);
  
  const weekStartStr = formatLocalDate(weekStart);
  const weekEndStr = formatLocalDate(weekEnd);
  
  const logsThisWeek = taskLogs.filter(log => {
    return log.logicalDate >= weekStartStr && log.logicalDate <= weekEndStr;
  });
  
  // Count unique dates
  const uniqueDates = new Set(logsThisWeek.map(log => log.logicalDate));
  
  return uniqueDates.size;
}

export function getMonthProgress(taskLogs: TaskLog[], dayStartTime: number): number {
  const now = new Date();
  const monthStart = getMonthStart(now);
  const monthEnd = getMonthEnd(now);
  
  const monthStartStr = formatLocalDate(monthStart);
  const monthEndStr = formatLocalDate(monthEnd);
  
  const logsThisMonth = taskLogs.filter(log => {
    return log.logicalDate >= monthStartStr && log.logicalDate <= monthEndStr;
  });
  
  // Count unique dates
  const uniqueDates = new Set(logsThisMonth.map(log => log.logicalDate));
  
  return uniqueDates.size;
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
  let currentDate = parseLocalDate(today);
  
  for (const logDate of uniqueDates) {
    const expectedDate = formatLocalDate(currentDate);
    if (logDate === expectedDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}
