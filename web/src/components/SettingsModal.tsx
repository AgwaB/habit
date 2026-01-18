import { X } from 'lucide-react';
import { Task } from '../types';

interface SettingsModalProps {
  dayStartTime: number;
  onDayStartTimeChange: (hour: number) => void;
  archivedTasks: Task[];
  onRestoreTask: (taskId: string) => void;
  onClose: () => void;
}

export function SettingsModal({
  dayStartTime,
  onDayStartTimeChange,
  archivedTasks,
  onRestoreTask,
  onClose,
}: SettingsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg text-[#333333]">설정</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <X className="w-6 h-6 text-[#888888]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Day Start Time */}
          <div>
            <label className="block text-sm text-[#888888] mb-2">
              하루 시작 시간
            </label>
            <p className="text-xs text-[#888888] mb-3">
              이 시간 이전의 활동은 전날로 기록됩니다
            </p>
            <select
              value={dayStartTime}
              onChange={(e) => onDayStartTimeChange(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6366f1] text-[#333333]"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {String(i).padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>

          {/* Archived Tasks */}
          {archivedTasks.length > 0 && (
            <div>
              <h3 className="text-sm text-[#888888] mb-3">보관된 습관</h3>
              <div className="space-y-2">
                {archivedTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{task.icon}</span>
                      <span className="text-[#333333]">{task.title}</span>
                    </div>
                    <button
                      onClick={() => onRestoreTask(task.id)}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm text-[#6366f1] hover:bg-gray-50 transition-colors"
                    >
                      복구
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* App Info */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-center text-[#888888]">
              My Habits v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
