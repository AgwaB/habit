import { useState } from "react";
import { MainDashboard } from "./components/MainDashboard";
import { TaskDetailView } from "./components/TaskDetailView";
import { AddEditTaskModal } from "./components/AddEditTaskModal";
import { SettingsModal } from "./components/SettingsModal";
import { Task, TaskLog } from "./types";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "운동하기",
      icon: "💪",
      color: "#6366f1",
      type: "goal",
      frequencyType: "weekly",
      targetCount: 3,
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "책 읽기",
      icon: "📚",
      color: "#06b6d4",
      type: "goal",
      frequencyType: "weekly",
      targetCount: 5,
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "물 마시기",
      icon: "💧",
      color: "#10b981",
      type: "counter",
      frequencyType: "daily",
      status: "active",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([
    // Sample data for demonstration
    {
      id: "log1",
      taskId: "1",
      performedAt: new Date().toISOString(),
      logicalDate: new Date().toISOString().split("T")[0],
    },
    {
      id: "log2",
      taskId: "2",
      performedAt: new Date(Date.now() - 86400000).toISOString(),
      logicalDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    },
    {
      id: "log3",
      taskId: "2",
      performedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      logicalDate: new Date(Date.now() - 2 * 86400000)
        .toISOString()
        .split("T")[0],
    },
  ]);

  const [dayStartTime, setDayStartTime] = useState(0); // 0-23 hours
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = (task: Omit<Task, "id" | "createdAt" | "status">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setIsAddModalOpen(false);
  };

  const handleEditTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
    setEditingTask(null);
    setIsAddModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: "archived" } : t)),
    );
    setSelectedTaskId(null);
  };

  const handleToggleTask = (taskId: string) => {
    const today = getLogicalDate(new Date(), dayStartTime);
    const existingLog = taskLogs.find(
      (log) => log.taskId === taskId && log.logicalDate === today,
    );

    if (existingLog) {
      // Remove the log (uncheck)
      setTaskLogs(taskLogs.filter((log) => log.id !== existingLog.id));
    } else {
      // Add a new log (check)
      const newLog: TaskLog = {
        id: Date.now().toString(),
        taskId,
        performedAt: new Date().toISOString(),
        logicalDate: today,
      };
      setTaskLogs([...taskLogs, newLog]);
    }
  };

  const handleIncrementCounter = (taskId: string) => {
    const newLog: TaskLog = {
      id: Date.now().toString(),
      taskId,
      performedAt: new Date().toISOString(),
      logicalDate: getLogicalDate(new Date(), dayStartTime),
    };
    setTaskLogs([...taskLogs, newLog]);
  };

  const handleDecrementCounter = (taskId: string) => {
    const today = getLogicalDate(new Date(), dayStartTime);
    const logsToday = taskLogs.filter(
      (log) => log.taskId === taskId && log.logicalDate === today,
    );

    if (logsToday.length > 0) {
      const lastLog = logsToday[logsToday.length - 1];
      setTaskLogs(taskLogs.filter((log) => log.id !== lastLog.id));
    }
  };

  const activeTasks = tasks.filter((t) => t.status === "active");

  return (
    <div className="min-h-screen">
      {!selectedTaskId ? (
        <MainDashboard
          tasks={activeTasks}
          taskLogs={taskLogs}
          dayStartTime={dayStartTime}
          onToggleTask={handleToggleTask}
          onIncrementCounter={handleIncrementCounter}
          onTaskClick={setSelectedTaskId}
          onAddClick={() => setIsAddModalOpen(true)}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />
      ) : (
        <TaskDetailView
          task={tasks.find((t) => t.id === selectedTaskId)!}
          taskLogs={taskLogs.filter((log) => log.taskId === selectedTaskId)}
          dayStartTime={dayStartTime}
          onBack={() => setSelectedTaskId(null)}
          onEdit={(task) => {
            setEditingTask(task);
            setIsAddModalOpen(true);
          }}
          onDelete={handleDeleteTask}
          onIncrement={() => handleIncrementCounter(selectedTaskId)}
          onDecrement={() => handleDecrementCounter(selectedTaskId)}
        />
      )}

      {isAddModalOpen && (
        <AddEditTaskModal
          task={editingTask}
          onSave={
            editingTask
              ? (updates) => handleEditTask(editingTask.id, updates)
              : handleAddTask
          }
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          dayStartTime={dayStartTime}
          onDayStartTimeChange={setDayStartTime}
          archivedTasks={tasks.filter((t) => t.status === "archived")}
          onRestoreTask={(taskId) => {
            setTasks(
              tasks.map((t) =>
                t.id === taskId ? { ...t, status: "active" } : t,
              ),
            );
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}

function getLogicalDate(date: Date, dayStartHour: number): string {
  const adjustedDate = new Date(date);
  if (adjustedDate.getHours() < dayStartHour) {
    adjustedDate.setDate(adjustedDate.getDate() - 1);
  }
  return adjustedDate.toISOString().split("T")[0];
}
