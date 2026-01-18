import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Task, TaskType, FrequencyType } from '../types';

interface AddEditTaskModalProps {
  task?: Task | null;
  onSave: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['💪', '📚', '💧', '🏃', '🧘', '🎯', '✍️', '🎨', '🎵', '🌱', '☕', '🥗'];
const COLOR_OPTIONS = [
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
];

export function AddEditTaskModal({ task, onSave, onClose }: AddEditTaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [icon, setIcon] = useState(task?.icon || '💪');
  const [color, setColor] = useState(task?.color || '#6366f1');
  const [type, setType] = useState<TaskType>(task?.type || 'goal');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(task?.frequencyType || 'weekly');
  const [targetCount, setTargetCount] = useState(task?.targetCount || 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title: title.trim(),
      icon,
      color,
      type,
      frequencyType,
      ...(type === 'goal' && { targetCount }),
    };

    onSave(taskData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg text-[#333333]">
            {task ? '습관 수정' : '새로운 습관'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <X className="w-6 h-6 text-[#888888]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm text-[#888888] mb-2">어떤 습관인가요?</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="운동하기"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6366f1] text-[#333333]"
              autoFocus
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm text-[#888888] mb-2">아이콘</label>
            <div className="grid grid-cols-6 gap-2">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`aspect-square rounded-lg text-2xl flex items-center justify-center transition-all ${
                    icon === emoji ? 'bg-gray-200 scale-110' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm text-[#888888] mb-2">색상</label>
            <div className="grid grid-cols-8 gap-2">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`aspect-square rounded-lg transition-all ${
                    color === c ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-sm text-[#888888] mb-2">유형</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('goal')}
                className={`py-3 rounded-lg transition-all ${
                  type === 'goal'
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-gray-100 text-[#888888] hover:bg-gray-200'
                }`}
              >
                목표 설정
              </button>
              <button
                type="button"
                onClick={() => setType('counter')}
                className={`py-3 rounded-lg transition-all ${
                  type === 'counter'
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-gray-100 text-[#888888] hover:bg-gray-200'
                }`}
              >
                단순 기록
              </button>
            </div>
          </div>

          {/* Frequency and Target (only for goal type) */}
          {type === 'goal' && (
            <>
              <div>
                <label className="block text-sm text-[#888888] mb-2">주기</label>
                <select
                  value={frequencyType}
                  onChange={(e) => setFrequencyType(e.target.value as FrequencyType)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6366f1] text-[#333333]"
                >
                  <option value="daily">매일</option>
                  <option value="weekly">주간</option>
                  <option value="monthly">월간</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#888888] mb-2">목표 횟수</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    aria-label="감소"
                  >
                    <Minus className="w-5 h-5 text-[#333333]" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-3xl font-mono text-[#333333]">{targetCount}</span>
                    <span className="text-[#888888] ml-2">회</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTargetCount(targetCount + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    aria-label="증가"
                  >
                    <Plus className="w-5 h-5 text-[#333333]" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full py-4 bg-[#6366f1] text-white rounded-lg hover:bg-[#5558e3] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {task ? '수정하기' : '시작하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
