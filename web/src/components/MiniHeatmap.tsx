import { useEffect, useMemo, useRef, useState } from 'react';
import { TaskLog } from '../types';
import { getLogicalDate } from '../utils/dateUtils';

interface MiniHeatmapProps {
  taskLogs: TaskLog[];
  color: string;
  dayStartTime: number;
  minDays?: number;
  maxDays?: number;
}

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

export function MiniHeatmap({
  taskLogs,
  color,
  dayStartTime,
  minDays = 7,
  maxDays = 14,
}: MiniHeatmapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleDays, setVisibleDays] = useState(maxDays);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const cellSize = 12;
    const gap = 4;

    const update = () => {
      const width = element.getBoundingClientRect().width;
      const capacity = Math.floor((width + gap) / (cellSize + gap));
      const next = Math.max(minDays, Math.min(maxDays, capacity));
      setVisibleDays(next);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [minDays, maxDays]);

  const logDates = useMemo(
    () => new Set(taskLogs.map((log) => log.logicalDate)),
    [taskLogs],
  );

  const heatmapData = useMemo(() => {
    const todayLogical = getLogicalDate(new Date(), dayStartTime);
    const baseDate = parseLocalDate(todayLogical);

    return Array.from({ length: visibleDays }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() - (visibleDays - 1 - i));
      const dateStr = formatLocalDate(date);
      const hasLog = logDates.has(dateStr);
      const isToday = i === visibleDays - 1;
      return { date: dateStr, hasLog, isToday };
    });
  }, [dayStartTime, logDates, visibleDays]);

  return (
    <div ref={containerRef} className="flex items-center gap-1">
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
