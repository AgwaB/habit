import { useEffect, useMemo, useRef, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { MainDashboard } from "./components/MainDashboard";
import { TaskDetailView } from "./components/TaskDetailView";
import { AddEditTaskModal } from "./components/AddEditTaskModal";
import { SettingsModal } from "./components/SettingsModal";
import { Task, TaskLog } from "./types";
import { isSupabaseConfigured, supabase } from "./lib/supabaseClient";
import {
  mapTask,
  mapTaskLog,
  mapSettings,
  taskToDbInsert,
} from "./lib/mappers";
import { getLogicalDate } from "./utils/dateUtils";

type TaskDraft = Omit<Task, "id" | "createdAt" | "status">;

export default function App() {
  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center space-y-3">
          <h1 className="text-xl font-semibold text-gray-900">
            Supabase 설정이 필요합니다
          </h1>
          <p className="text-sm text-gray-600">
            `web/.env`에 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`를
            설정한 뒤 개발 서버를 다시 실행하세요.
          </p>
        </div>
      </div>
    );
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([]);
  const [dayStartTime, setDayStartTime] = useState(0); // 0-23 hours
  const [settingsId, setSettingsId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const savingTaskRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const activeTasks = useMemo(
    () => tasks.filter((t) => t.status === "active"),
    [tasks],
  );

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const [settingsResult, tasksResult, logsResult] = await Promise.all([
      supabase.from("app_settings").select("*").limit(1).maybeSingle(),
      supabase.from("tasks").select("*").order("created_at", { ascending: true }),
      supabase
        .from("task_logs")
        .select("*")
        .order("performed_at", { ascending: true }),
    ]);

    const errors: string[] = [];
    if (settingsResult.error) errors.push("설정");
    if (tasksResult.error) errors.push("습관");
    if (logsResult.error) errors.push("기록");

    if (errors.length > 0) {
      setErrorMessage(`${errors.join(", ")} 데이터를 불러오지 못했습니다.`);
    }

    if (settingsResult.data) {
      const settings = mapSettings(settingsResult.data);
      setDayStartTime(settings.dayStartHour);
      setSettingsId(settingsResult.data.id);
    }

    if (tasksResult.data) {
      setTasks(tasksResult.data.map(mapTask));
    }

    if (logsResult.data) {
      setTaskLogs(logsResult.data.map(mapTaskLog));
    }

    setIsLoading(false);
  };

  const handleAddTask = async (task: TaskDraft) => {
    if (savingTaskRef.current) return;
    savingTaskRef.current = true;
    setIsSavingTask(true);
    setErrorMessage(null);
    const { data, error } = await supabase
      .from("tasks")
      .insert(taskToDbInsert(task))
      .select("*")
      .single();

    if (error || !data) {
      setErrorMessage("습관을 저장하지 못했습니다.");
      savingTaskRef.current = false;
      setIsSavingTask(false);
      return;
    }

    setTasks((prev) => [...prev, mapTask(data)]);
    setIsAddModalOpen(false);
    savingTaskRef.current = false;
    setIsSavingTask(false);
  };

  const handleEditTask = async (taskId: string, updates: TaskDraft) => {
    if (savingTaskRef.current) return;
    savingTaskRef.current = true;
    setIsSavingTask(true);
    setErrorMessage(null);
    const payload = {
      title: updates.title,
      icon: updates.icon,
      color: updates.color,
      type: updates.type,
      frequency_type: updates.frequencyType,
      target_count: updates.type === "goal" ? updates.targetCount ?? 1 : null,
    };

    const { data, error } = await supabase
      .from("tasks")
      .update(payload)
      .eq("id", taskId)
      .select("*")
      .single();

    if (error || !data) {
      setErrorMessage("습관을 수정하지 못했습니다.");
      savingTaskRef.current = false;
      setIsSavingTask(false);
      return;
    }

    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? mapTask(data) : task)),
    );
    setEditingTask(null);
    setIsAddModalOpen(false);
    savingTaskRef.current = false;
    setIsSavingTask(false);
  };

  const handleArchiveTask = async (taskId: string) => {
    setErrorMessage(null);
    const { data, error } = await supabase
      .from("tasks")
      .update({ status: "archived" })
      .eq("id", taskId)
      .select("*")
      .single();

    if (error || !data) {
      setErrorMessage("습관을 보관하지 못했습니다.");
      return;
    }

    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? mapTask(data) : task)),
    );
    setSelectedTaskId(null);
  };

  const handleRestoreTask = async (taskId: string) => {
    setErrorMessage(null);
    const { data, error } = await supabase
      .from("tasks")
      .update({ status: "active" })
      .eq("id", taskId)
      .select("*")
      .single();

    if (error || !data) {
      setErrorMessage("습관을 복구하지 못했습니다.");
      return;
    }

    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? mapTask(data) : task)),
    );
  };

  const handleToggleTask = async (taskId: string) => {
    const today = getLogicalDate(new Date(), dayStartTime);
    const existingLog = taskLogs.find(
      (log) => log.taskId === taskId && log.logicalDate === today,
    );

    if (existingLog) {
      return;
    }

    setErrorMessage(null);
    const { data, error } = await supabase
      .from("task_logs")
      .insert({
        task_id: taskId,
        performed_at: new Date().toISOString(),
        logical_date: today,
      })
      .select("*")
      .single();

    if (error || !data) {
      setErrorMessage("기록을 저장하지 못했습니다.");
      return;
    }

    setTaskLogs((prev) => [...prev, mapTaskLog(data)]);
  };

  const handleIncrementCounter = async (taskId: string) => {
    const logicalDate = getLogicalDate(new Date(), dayStartTime);
    setErrorMessage(null);
    const { data, error } = await supabase
      .from("task_logs")
      .insert({
        task_id: taskId,
        performed_at: new Date().toISOString(),
        logical_date: logicalDate,
      })
      .select("*")
      .single();

    if (error || !data) {
      setErrorMessage("기록을 저장하지 못했습니다.");
      return;
    }

    setTaskLogs((prev) => [...prev, mapTaskLog(data)]);
  };

  const handleDecrementCounter = async (taskId: string) => {
    const today = getLogicalDate(new Date(), dayStartTime);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("task_logs")
      .select("id")
      .eq("task_id", taskId)
      .eq("logical_date", today)
      .order("performed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setErrorMessage("기록을 불러오지 못했습니다.");
      return;
    }

    if (!data) {
      return;
    }

    const { error: deleteError } = await supabase
      .from("task_logs")
      .delete()
      .eq("id", data.id);

    if (deleteError) {
      setErrorMessage("기록을 삭제하지 못했습니다.");
      return;
    }

    setTaskLogs((prev) => prev.filter((log) => log.id !== data.id));
  };

  const handleAddLogForDate = async (taskId: string, date: string) => {
    setErrorMessage(null);
    const { data, error } = await supabase
      .from("task_logs")
      .insert({
        task_id: taskId,
        performed_at: new Date().toISOString(),
        logical_date: date,
      })
      .select("*")
      .single();

    if (error || !data) {
      setErrorMessage("기록을 저장하지 못했습니다.");
      return;
    }

    setTaskLogs((prev) => [...prev, mapTaskLog(data)]);
  };

  const handleRemoveLogForDate = async (taskId: string, date: string) => {
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("task_logs")
      .select("id")
      .eq("task_id", taskId)
      .eq("logical_date", date)
      .order("performed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setErrorMessage("기록을 불러오지 못했습니다.");
      return;
    }

    if (!data) {
      return;
    }

    const { error: deleteError } = await supabase
      .from("task_logs")
      .delete()
      .eq("id", data.id);

    if (deleteError) {
      setErrorMessage("기록을 삭제하지 못했습니다.");
      return;
    }

    setTaskLogs((prev) => prev.filter((log) => log.id !== data.id));
  };

  const handleDayStartTimeChange = (hour: number) => {
    setDayStartTime(hour);
    void persistDayStartTime(hour);
  };

  const persistDayStartTime = async (hour: number) => {
    setErrorMessage(null);
    const payload: { singleton: boolean; day_start_hour: number; id?: number } =
      {
        singleton: true,
        day_start_hour: hour,
      };
    if (settingsId) {
      payload.id = settingsId;
    }

    const { data, error } = await supabase
      .from("app_settings")
      .upsert(payload, { onConflict: "singleton" })
      .select("*")
      .single();

    if (error || !data) {
      setErrorMessage("설정을 저장하지 못했습니다.");
      return;
    }

    setSettingsId(data.id);
  };

  return (
    <div className="min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <MainDashboard
              tasks={activeTasks}
              taskLogs={taskLogs}
              dayStartTime={dayStartTime}
              onToggleTask={handleToggleTask}
              onIncrementCounter={handleIncrementCounter}
              onTaskClick={(taskId) => navigate(`/task/${taskId}`)}
              onAddClick={() => setIsAddModalOpen(true)}
              onSettingsClick={() => setIsSettingsOpen(true)}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
          }
        />
        <Route
          path="/task/:taskId"
          element={
            <TaskDetailRoute
              tasks={tasks}
              taskLogs={taskLogs}
              dayStartTime={dayStartTime}
              onEdit={(task) => {
                setEditingTask(task);
                setIsAddModalOpen(true);
              }}
              onDelete={handleArchiveTask}
              onIncrementCounter={handleIncrementCounter}
              onDecrementCounter={handleDecrementCounter}
              onAddLogForDate={handleAddLogForDate}
              onRemoveLogForDate={handleRemoveLogForDate}
              errorMessage={errorMessage}
            />
          }
        />
      </Routes>

      {isAddModalOpen && (
        <AddEditTaskModal
          task={editingTask}
          onSave={
            editingTask
              ? (updates) => handleEditTask(editingTask.id, updates)
              : handleAddTask
          }
          isSaving={isSavingTask}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          dayStartTime={dayStartTime}
          onDayStartTimeChange={handleDayStartTimeChange}
          archivedTasks={tasks.filter((t) => t.status === "archived")}
          onRestoreTask={handleRestoreTask}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}

function TaskDetailRoute({
  tasks,
  taskLogs,
  dayStartTime,
  onEdit,
  onDelete,
  onIncrementCounter,
  onDecrementCounter,
  onAddLogForDate,
  onRemoveLogForDate,
  errorMessage,
}: {
  tasks: Task[];
  taskLogs: TaskLog[];
  dayStartTime: number;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onIncrementCounter: (taskId: string) => void;
  onDecrementCounter: (taskId: string) => void;
  onAddLogForDate: (taskId: string, date: string) => void;
  onRemoveLogForDate: (taskId: string, date: string) => void;
  errorMessage: string | null;
}) {
  const { taskId } = useParams();
  const navigate = useNavigate();

  if (!taskId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        불러오는 중...
      </div>
    );
  }

  const selectedTask = tasks.find((task) => task.id === taskId) ?? null;

  if (!selectedTask) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        해당 습관을 찾을 수 없습니다.
      </div>
    );
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <TaskDetailView
      task={selectedTask}
      taskLogs={taskLogs.filter((log) => log.taskId === taskId)}
      dayStartTime={dayStartTime}
      onBack={handleBack}
      onEdit={onEdit}
      onDelete={onDelete}
      onIncrement={() => onIncrementCounter(taskId)}
      onDecrement={() => onDecrementCounter(taskId)}
      onAddLogForDate={(date) => onAddLogForDate(taskId, date)}
      onRemoveLogForDate={(date) => onRemoveLogForDate(taskId, date)}
      errorMessage={errorMessage}
    />
  );
}
