import { Minus, Plus, X } from 'lucide-react';
import { TaskLog } from '../types';

interface EditDateBottomSheetProps {
  date: string;
  taskId: string;
  taskLogs: TaskLog[];
  color: string;
  onAddLog: (date: string) => void;
  onRemoveLog: (date: string) => void;
  onClose: () => void;
}

export function EditDateBottomSheet({
  date,
  taskId,
  taskLogs,
  color,
  onAddLog,
  onRemoveLog,
  onClose,
}: EditDateBottomSheetProps) {
  const logsForDate = taskLogs.filter(log => log.logicalDate === date);
  const count = logsForDate.length;

  const dateObj = new Date(date + 'T00:00:00');
  const dateString = dateObj.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const handleIncrement = () => {
    onAddLog(date);
  };

  const handleDecrement = () => {
    if (count > 0) {
      onRemoveLog(date);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 animate-slide-up">
        <div className="px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg text-[#333333]">{dateString}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5 text-[#888888]" />
            </button>
          </div>

          {/* Counter Controls */}
          <div className="flex items-center justify-center gap-6 py-8">
            <button
              onClick={handleDecrement}
              disabled={count === 0}
              className="w-16 h-16 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
              aria-label="감소"
            >
              <Minus className="w-7 h-7 text-[#333333]" />
            </button>

            <div className="text-center" style={{ minWidth: 120 }}>
              <div className="text-6xl font-mono text-[#333333] mb-1">
                {count}
              </div>
              <div className="text-sm text-[#888888]">횟수</div>
            </div>

            <button
              onClick={handleIncrement}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95"
              style={{ backgroundColor: color }}
              aria-label="증가"
            >
              <Plus className="w-7 h-7 text-white" />
            </button>
          </div>

          {/* Helper text */}
          <p className="text-center text-sm text-[#888888] mt-4">
            탭하여 횟수를 조정하세요
          </p>
        </div>

        {/* Safe area spacing for mobile */}
        <div className="h-6" />
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
