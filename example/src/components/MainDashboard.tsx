import { Settings, Plus, Sparkles } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Task, TaskLog } from "../types";
import { TaskCard } from "./TaskCard";

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
  const dateString = today.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="glass sticky top-0 z-10 px-6 py-4 mb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            {dateString}
          </h1>
          <button
            onClick={onSettingsClick}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            aria-label="설정"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Task List */}
      <div className="px-4 py-4 space-y-4">
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 px-6 glass-card rounded-2xl mx-2 mt-10"
              >
                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  새로운 시작
                </h3>
                <p className="text-gray-500 mb-6">
                  아직 등록된 습관이 없습니다.
                  <br />
                  작은 목표부터 시작해보세요!
                </p>
                <button
                  onClick={onAddClick}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium shadow-lg hover:bg-indigo-700 transition-colors"
                >
                  첫 습관 만들기
                </button>
              </motion.div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  taskLogs={taskLogs.filter((log) => log.taskId === task.id)}
                  dayStartTime={dayStartTime}
                  onToggle={() => {
                    if (task.type === "goal") {
                      onToggleTask(task.id);
                    } else {
                      onIncrementCounter(task.id);
                    }
                  }}
                  onClick={() => onTaskClick(task.id)}
                />
              ))
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddClick}
        className="fixed right-6 bottom-8 w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl hover:bg-black flex items-center justify-center z-20"
        aria-label="새 습관 추가"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
