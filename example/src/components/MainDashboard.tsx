import { Settings, Plus } from 'lucide-react';
import { Task, TaskLog } from '../types';
import { TaskCard } from './TaskCard';

interface MainDashboardProps {
  tasks: Task[];
  taskLogs: TaskLog[];
  dayStartTime: number;
  onToggleTask: (taskId: string) => void;
  onIncrementCounter: (taskId: string) => void;
  onTaskClick: (taskId: string) => void;
  onAddClick: () => void;
  onSettingsClick: () => void;
}

export function MainDashboard({
  tasks,
  taskLogs,
  dayStartTime,
  onToggleTask,
  onIncrementCounter,
  onTaskClick,
  onAddClick,
  onSettingsClick,
}: MainDashboardProps) {
  const today = new Date();
  const dateString = today.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg text-[#333333]">{dateString}</h1>
          <button
            onClick={onSettingsClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="설정"
          >
            <Settings className="w-6 h-6 text-[#888888]" />
          </button>
        </div>
      </header>

      {/* Task List */}
      <div className="px-4 py-6 space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-16 px-6">
            <p className="text-[#888888] mb-2">아직 습관이 없습니다.</p>
            <p className="text-[#888888] text-sm">오늘부터 시작해보세요!</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              taskLogs={taskLogs.filter(log => log.taskId === task.id)}
              dayStartTime={dayStartTime}
              onToggle={() => {
                if (task.type === 'goal') {
                  onToggleTask(task.id);
                } else {
                  onIncrementCounter(task.id);
                }
              }}
              onClick={() => onTaskClick(task.id)}
            />
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onAddClick}
        className="fixed right-6 bottom-6 w-14 h-14 bg-[#6366f1] text-white rounded-full shadow-lg hover:bg-[#5558e3] transition-all hover:scale-105 flex items-center justify-center"
        aria-label="새 습관 추가"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}