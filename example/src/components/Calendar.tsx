import { TaskLog } from '../types';

interface CalendarProps {
  taskLogs: TaskLog[];
  color: string;
  dayStartTime: number;
  onDateClick?: (date: string) => void;
}

export function Calendar({ taskLogs, color, onDateClick }: CalendarProps) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const logDates = new Set(taskLogs.map(log => log.logicalDate));

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];

  // Fill in empty days at the start
  for (let i = 0; i < startingDayOfWeek; i++) {
    currentWeek.push(null);
  }

  // Fill in the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill in empty days at the end
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekdays.map(day => (
          <div key={day} className="text-center text-sm text-[#888888] py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIndex) => {
              if (day === null) {
                return <div key={dayIndex} />;
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const hasLog = logDates.has(dateStr);
              const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

              return (
                <div
                  key={dayIndex}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                    hasLog
                      ? 'text-white shadow-sm'
                      : isToday
                      ? 'bg-gray-100 text-[#333333] hover:bg-gray-200'
                      : 'text-[#888888] hover:bg-gray-50'
                  }`}
                  style={hasLog ? { backgroundColor: color } : {}}
                  onClick={() => onDateClick && onDateClick(dateStr)}
                >
                  {day}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}