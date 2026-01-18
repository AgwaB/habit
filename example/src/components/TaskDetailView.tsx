import { ArrowLeft, MoreVertical, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Task, TaskLog } from "../types";
import { Calendar } from "./Calendar";
import { Heatmap } from "./Heatmap";
import {
  getWeekProgress,
  getMonthProgress,
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
}: TaskDetailViewProps) {
  const [showMenu, setShowMenu] = useState(false);

  const { current, target } =
    task.type === "goal"
      ? task.frequencyType === "weekly"
        ? getWeekProgress(taskLogs, dayStartTime)
        : getMonthProgress(taskLogs, dayStartTime)
      : { current: taskLogs.length, target: 0 };

  const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
  const streak = getStreak(taskLogs, dayStartTime);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen"
    >
      {/* Header */}
      <header className="glass sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">{task.icon}</span>
            <span>{task.title}</span>
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
              aria-label="메뉴"
            >
              <MoreVertical className="w-6 h-6 text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 glass-card rounded-xl shadow-xl overflow-hidden z-50">
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-white/50 text-gray-900 text-sm"
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
                  className="w-full px-4 py-3 text-left hover:bg-white/50 text-red-600 text-sm"
                >
                  보관하기
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Summary Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          {task.type === "goal" ? (
            <>
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {task.frequencyType === "weekly" ? "이번 주" : "이번 달"}{" "}
                  달성률 {percentage}%
                </p>
                <p className="text-gray-500 font-medium">
                  {current} / {target}회 완료
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 text-lg bg-white/40 rounded-xl py-3 mx-4">
                <span className="text-gray-600">현재 연속</span>
                <span className="text-2xl">🔥</span>
                <span className="font-bold text-indigo-600">{streak}일</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  총 {current}회
                </p>
                <p className="text-gray-500 font-medium">누적 기록</p>
              </div>
              <div className="flex items-center justify-center gap-3 text-lg bg-white/40 rounded-xl py-3 mx-4">
                <span className="text-gray-600">현재 연속</span>
                <span className="text-2xl">🔥</span>
                <span className="font-bold text-indigo-600">{streak}일</span>
              </div>
            </>
          )}
        </motion.div>

        {/* Counter Controls for Counter Mode */}
        {task.type === "counter" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-4"
          >
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={onDecrement}
                className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shadow-sm"
                aria-label="감소"
              >
                <Minus className="w-6 h-6 text-gray-600" />
              </button>
              <span className="text-sm font-medium text-gray-500">
                오늘 기록
              </span>
              <button
                onClick={onIncrement}
                className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition-colors shadow-lg shadow-indigo-200"
                aria-label="증가"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Calendar Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            이번 달 활동
          </h2>
          <Calendar
            taskLogs={taskLogs}
            color={task.color}
            dayStartTime={dayStartTime}
          />
        </motion.div>

        {/* Heatmap Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            지난 활동 기록
          </h2>
          {taskLogs.length > 0 ? (
            <Heatmap taskLogs={taskLogs} color={task.color} />
          ) : (
            <p className="text-center text-gray-400 py-8 text-sm">
              아직 기록이 없습니다.
              <br />
              오늘부터 시작해보세요!
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
