import { useRef } from "react";
import { motion } from "framer-motion";
import { Task, TaskLog } from "../types";
import { DonutChart } from "./DonutChart";
import {
  getWeekProgress,
  getMonthProgress,
  getTodayCount,
} from "../utils/dateUtils";

interface TaskCardProps {
  task: Task;
  taskLogs: TaskLog[];
  dayStartTime: number;
  onToggle: () => void;
  onClick: () => void;
}

export function TaskCard({
  task,
  taskLogs,
  dayStartTime,
  onToggle,
  onClick,
}: TaskCardProps) {
  const { current, target } =
    task.type === "goal"
      ? task.frequencyType === "weekly"
        ? getWeekProgress(taskLogs, dayStartTime)
        : task.frequencyType === "monthly"
          ? getMonthProgress(taskLogs, dayStartTime)
          : {
              current: getTodayCount(taskLogs, dayStartTime),
              target: task.targetCount || 1,
            }
      : { current: taskLogs.length, target: 0 };

  const frequencyLabel =
    task.type === "goal"
      ? task.frequencyType === "weekly"
        ? `주 ${task.targetCount}회 목표`
        : task.frequencyType === "monthly"
          ? `월 ${task.targetCount}회 목표`
          : `일 ${task.targetCount}회 목표`
      : "기록 중";

  const handleToggle = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    onToggle();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-lg hover:border-white/80 group"
    >
      <div className="flex items-center gap-3 flex-1" onClick={onClick}>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner"
          style={{ backgroundColor: `${task.color}15` }}
        >
          {task.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-gray-900 font-semibold mb-0.5">{task.title}</h3>
          <p className="text-sm text-gray-500 font-medium">{frequencyLabel}</p>
        </div>
      </div>

      <div
        className="flex items-center gap-3"
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
      >
        {task.type === "goal" ? (
          <div className="relative transform transition-transform group-hover:scale-110">
            <DonutChart
              current={current}
              target={target}
              color={task.color}
              size={64}
            />
          </div>
        ) : (
          <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-full border border-gray-100 shadow-inner group-hover:scale-110 transition-transform">
            <span className="text-2xl font-mono text-gray-700 font-bold">
              {current}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
