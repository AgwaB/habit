import { ArrowLeft, MoreVertical, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Task, TaskLog } from "../types";
import { Calendar } from "./Calendar";
import { EditDateBottomSheet } from "./EditDateBottomSheet";
import {
  getLogicalDate,
  getWeekProgress,
  getMonthProgress,
  getTodayCount,
  getStreak,
} from "../utils/dateUtils";

interface TaskDetailViewProps {
  task: Task;
  taskLogs: TaskLog[];
  dayStartTime: number;
  onBack: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddLogForDate: (date: string) => void;
  onRemoveLogForDate: (date: string) => void;
  errorMessage?: string | null;
}

export function TaskDetailView({
  task,
  taskLogs,
  dayStartTime,
  onBack,
  onEdit,
  onDelete,
  onIncrement,
  onDecrement,
  onAddLogForDate,
  onRemoveLogForDate,
  errorMessage,
}: TaskDetailViewProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const current =
    task.type === "goal"
      ? task.frequencyType === "weekly"
        ? getWeekProgress(taskLogs, dayStartTime)
        : task.frequencyType === "monthly"
          ? getMonthProgress(taskLogs, dayStartTime)
          : getTodayCount(taskLogs, dayStartTime)
      : taskLogs.length;
  const target = task.type === "goal" ? task.targetCount || 1 : 0;

  const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
  const streak = getStreak(taskLogs, dayStartTime);
  const periodLabel =
    task.frequencyType === "weekly"
      ? "이번 주"
      : task.frequencyType === "monthly"
        ? "이번 달"
        : "오늘";

  const handleDateClick = (date: string) => {
    const today = getLogicalDate(new Date(), dayStartTime);
    if (date > today) return;
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-6 h-6 text-[#333333]" />
          </button>
          <h1 className="text-lg text-[#333333] flex items-center gap-2">
            <span>{task.icon}</span>
            <span>{task.title}</span>
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="메뉴"
            >
              <MoreVertical className="w-6 h-6 text-[#888888]" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 text-[#333333] text-sm"
                >
                  수정하기
                </button>
                <button
                  onClick={() => {
                    if (confirm("이 습관을 보관하시겠습니까?")) {
                      onDelete(task.id);
                    }
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 text-red-600 text-sm"
                >
                  보관하기
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}
        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {task.type === "goal" ? (
            <>
              <div className="text-center mb-4">
                <p className="text-3xl text-[#333333] mb-2">
                  {periodLabel} 달성률 {percentage}%
                </p>
                <p className="text-[#888888]">
                  {current} / {target}회 완료
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-lg">
                <span>현재 연속</span>
                <span className="text-2xl">🔥</span>
                <span className="text-[#6366f1]">{streak}일</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <p className="text-3xl text-[#333333] mb-2">
                  총 {current}회
                </p>
                <p className="text-[#888888]">누적 기록</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-lg">
                <span>현재 연속</span>
                <span className="text-2xl">🔥</span>
                <span className="text-[#6366f1]">{streak}일</span>
              </div>
            </>
          )}
        </div>

        {/* Counter Controls for Counter Mode */}
        {task.type === "counter" && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onDecrement}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="감소"
              >
                <Minus className="w-5 h-5 text-[#333333]" />
              </button>
              <span className="text-2xl text-[#888888]">오늘 기록 조정</span>
              <button
                onClick={onIncrement}
                className="w-12 h-12 rounded-full bg-[#6366f1] hover:bg-[#5558e3] flex items-center justify-center transition-colors"
                aria-label="증가"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg text-[#333333] mb-4">이번 달 활동</h2>
          <Calendar
            taskLogs={taskLogs}
            color={task.color}
            dayStartTime={dayStartTime}
            onDateClick={handleDateClick}
          />
        </div>

      </div>

      {/* Edit Date Bottom Sheet */}
      {selectedDate && (
        <EditDateBottomSheet
          date={selectedDate}
          taskId={task.id}
          taskLogs={taskLogs}
          color={task.color}
          onAddLog={onAddLogForDate}
          onRemoveLog={onRemoveLogForDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
