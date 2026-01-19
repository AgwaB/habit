import { TaskLog } from '../types';

interface MiniHeatmapProps {
  taskLogs: TaskLog[];
  color: string;
  days?: number;
}

export function MiniHeatmap({ taskLogs, color, days = 14 }: MiniHeatmapProps) {
  const today = new Date();
  const logDates = new Set(taskLogs.map(log => log.logicalDate));

  // Generate array of last N days
  const heatmapData = Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (days - 1 - i));
    const dateStr = date.toISOString().split('T')[0];
    const hasLog = logDates.has(dateStr);
    const isToday = i === days - 1;
    
    return { date: dateStr, hasLog, isToday };
  });

  return (
    <div className="flex items-center gap-1">
      {heatmapData.map((day, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-sm transition-all ${
            day.isToday ? 'ring-1 ring-offset-1 ring-gray-400' : ''
          }`}
          style={{
            backgroundColor: day.hasLog ? color : '#E0E0E0',
          }}
          title={day.date}
        />
      ))}
    </div>
  );
}
