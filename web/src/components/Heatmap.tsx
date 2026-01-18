import { TaskLog } from '../types';

interface HeatmapProps {
  taskLogs: TaskLog[];
  color: string;
}

export function Heatmap({ taskLogs, color }: HeatmapProps) {
  const today = new Date();
  const weeks = 52;
  const days = weeks * 7;

  // Count logs per date
  const logCounts = new Map<string, number>();
  taskLogs.forEach(log => {
    const count = logCounts.get(log.logicalDate) || 0;
    logCounts.set(log.logicalDate, count + 1);
  });

  const maxCount = Math.max(...Array.from(logCounts.values()), 1);

  // Generate grid data
  const grid: { date: Date; count: number }[][] = [];
  
  for (let week = weeks - 1; week >= 0; week--) {
    const weekData: { date: Date; count: number }[] = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7 + (6 - day)));
      const dateStr = date.toISOString().split('T')[0];
      const count = logCounts.get(dateStr) || 0;
      weekData.push({ date, count });
    }
    grid.push(weekData);
  }

  const getOpacity = (count: number) => {
    if (count === 0) return 0;
    return 0.2 + (count / maxCount) * 0.8;
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-1">
        {/* Weekday labels */}
        <div className="flex flex-col gap-1 pr-2">
          {weekdayLabels.map((label, i) => (
            <div key={i} className="h-3 flex items-center text-xs text-[#888888]">
              {i % 2 === 1 ? label : ''}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-1">
          {grid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((cell, dayIndex) => (
                <div
                  key={dayIndex}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: cell.count > 0 ? color : '#E5E7EB',
                    opacity: cell.count > 0 ? getOpacity(cell.count) : 1,
                  }}
                  title={`${cell.date.toLocaleDateString()}: ${cell.count}회`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-[#888888]">
        <span>적음</span>
        <div className="flex gap-1">
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((opacity, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: opacity === 0 ? '#E5E7EB' : color,
                opacity: opacity === 0 ? 1 : 0.2 + opacity * 0.8,
              }}
            />
          ))}
        </div>
        <span>많음</span>
      </div>
    </div>
  );
}
