import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskLog } from '../types';

interface CalendarProps {
  taskLogs: TaskLog[];
  color: string;
  dayStartTime: number;
  onDateClick?: (date: string) => void;
}

export function Calendar({ taskLogs, color, onDateClick }: CalendarProps) {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());

  const year = currentYear;
  const month = currentMonth;

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

  const goToPreviousMonth = () => {
    if (month === 0) {
      setCurrentMonth(11);
      setCurrentYear(year - 1);
    } else {
      setCurrentMonth(month - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setCurrentMonth(0);
      setCurrentYear(year + 1);
    } else {
      setCurrentMonth(month + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  };

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  return (
    <div>
      {/* Month Navigator */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="이전 달"
        >
          <ChevronLeft className="w-5 h-5 text-[#333333]" />
        </button>

        <div className="flex items-center gap-2">
          <h3 className="text-[#333333]">
            {year}년 {month + 1}월
          </h3>
          {!isCurrentMonth && (
            <button
              onClick={goToToday}
              className="px-2 py-1 text-xs text-[#6366f1] hover:bg-indigo-50 rounded transition-colors"
            >
              오늘
            </button>
          )}
        </div>

        <button
          onClick={goToNextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="다음 달"
        >
          <ChevronRight className="w-5 h-5 text-[#333333]" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {weekdays.map(day => (
          <div key={day} className="text-center text-xs text-[#888888] py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1.5">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1.5">
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
                  className={`aspect-square flex items-center justify-center rounded-md text-xs transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                    hasLog
                      ? 'text-white shadow-sm'
                      : isToday
                      ? 'bg-gray-200 text-[#333333]'
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
