import { Task, TaskLog } from '../types';
import { DonutChart } from './DonutChart';
import { getWeekProgress, getMonthProgress, getTodayCount } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  taskLogs: TaskLog[];
  dayStartTime: number;
  onToggle: () => void;
  onClick: () => void;
}

export function TaskCard({ task, taskLogs, dayStartTime, onToggle, onClick }: TaskCardProps) {
  const { current, target } = task.type === 'goal' 
    ? (task.frequencyType === 'weekly' 
        ? getWeekProgress(taskLogs, dayStartTime)
        : task.frequencyType === 'monthly'
        ? getMonthProgress(taskLogs, dayStartTime)
        : { current: getTodayCount(taskLogs, dayStartTime), target: task.targetCount || 1 })
    : { current: taskLogs.length, target: 0 };

  const frequencyLabel = task.type === 'goal' 
    ? task.frequencyType === 'weekly' 
      ? `주 ${task.targetCount}회 목표`
      : task.frequencyType === 'monthly'
      ? `월 ${task.targetCount}회 목표`
      : `일 ${task.targetCount}회 목표`
    : '기록 중';

  return (
    <div 
      className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
    >
      <div 
        className="flex items-center gap-3 flex-1"
        onClick={onClick}
      >
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={{ backgroundColor: `${task.color}20` }}
        >
          {task.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-[#333333] mb-1">{task.title}</h3>
          <p className="text-sm text-[#888888]">{frequencyLabel}</p>
        </div>
      </div>

      <div 
        className="flex items-center gap-3"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        {task.type === 'goal' ? (
          <DonutChart
            current={current}
            target={target}
            color={task.color}
            size={64}
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center">
            <span className="text-2xl font-mono text-[#333333]">{current}</span>
          </div>
        )}
      </div>
    </div>
  );
}
