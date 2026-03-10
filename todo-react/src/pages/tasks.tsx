import type { FC, ReactElement } from "react";
import { useEffect, useState } from "react";
import { TasksCounter } from "@/components/tasksCounter/tasksCounter";
import { Task } from "@/components/task/task";
import { TaskSidebar } from "@/components/taskSidebar/taskSidebar";
import { useFetchTasks } from "@/hooks/useFetchTasks.hook";
import type { ITask } from "@/types/task.interface";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { LogOut, NotebookIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { PushSettings } from "@/push/pushSettings";

function todaysDate() {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-GB", options);
  return formattedDate;
}

// Function component, returns reactelement
export const Tasks: FC = (): ReactElement => {
  const { data }: { data: any } = useFetchTasks({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState<ITask | undefined>(
    undefined,
  );
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showDailyTasks, setShowDailyTasks] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const autoLoginToken = localStorage.getItem("token");
    if (!autoLoginToken) navigate("/login", { replace: true });
    if (autoLoginToken) {
      const token = JSON.parse(autoLoginToken);
      if (token.tokenExp > new Date().getTime()) {
        navigate("/", { replace: true });
      } else {
        localStorage.removeItem("token");
        console.log("Token expired, please login again");
      }
    }

    const mediaQuery = window.matchMedia("(min-width: 1028px)");
    const handleChange = () => {
      setIsDesktop(mediaQuery.matches);
    };
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [navigate]);

  // EDIT TASK
  function openEditTask(task: ITask) {
    setEditTaskData(task); //
    setIsSidebarOpen(true);
  }

  function showTaskSidebar() {
    setEditTaskData(undefined);
    setIsSidebarOpen(true);
  }

  function logout() {
    // For development purposes, as SW is not working in development, we can just remove the token and navigate to login page. In production, we will also unsubscribe from push notifications.

    if (import.meta.env.MODE === "development") {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
    setIsLoggedOut(true);
  }

  function handlePushUnsubscribed(isUnsubscribed: boolean) {
    if (isUnsubscribed) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }

  return (
    <>
      {!data && (
        <div className="flex items-center justify-center h-screen">
          <Button disabled size="sm" variant="outline">
            <Spinner data-icon="inline-start" className="h-8 w-8" />
            Loading...
          </Button>
        </div>
      )}
      {data && (
        <section className="lg:flex lg:flex-row w-full p-1 lg:p-4 gap-8 grid">
          <section className="lg:flex lg:basis-2/3 md:justify-start justify-center">
            <div className="flex flex-col lg:w-4/5 p-4">
              <PushSettings
                onUnsubscribed={handlePushUnsubscribed}
                isLoggedOut={isLoggedOut}
              ></PushSettings>
              <h1 className="text-white font-bold text-2xl mt-3 mb-3">
                {`Task as on: ${todaysDate()}`}
              </h1>
              <div className="flex justify-around mb-5 sm:mb-12">
                <div
                  onClick={() => {
                    setShowCompletedTasks(false);
                    setShowDailyTasks(false);
                  }}
                >
                  <TasksCounter
                    status="todo"
                    count={
                      data && data.meta && "todoTasks" in data.meta
                        ? (data.meta.todoTasks as number)
                        : 0
                    }
                    isActive={!showCompletedTasks && !showDailyTasks}
                  ></TasksCounter>
                </div>
                <div
                  onClick={() => {
                    setShowCompletedTasks(false);
                    setShowDailyTasks(true);
                  }}
                >
                  <TasksCounter
                    // CHANGE TO DAILY LATER!
                    status="inProgress"
                    count={
                      data && data.meta && "dailyTasks" in data.meta
                        ? (data.meta.dailyTasks as number)
                        : 0
                    }
                    isActive={showDailyTasks}
                  ></TasksCounter>
                </div>

                <div
                  onClick={() => {
                    setShowCompletedTasks(true);
                    setShowDailyTasks(false);
                  }}
                >
                  <TasksCounter
                    status="completed"
                    count={
                      data && data.meta && "completedTasks" in data.meta
                        ? (data.meta.completedTasks as number)
                        : 0
                    }
                    isActive={showCompletedTasks}
                  ></TasksCounter>
                </div>
              </div>
              <div className="mb-2 flex justify-between gap-4">
                <Button onClick={showTaskSidebar}>
                  <NotebookIcon className="h-4 w-4" /> New Task
                </Button>
                <button onClick={logout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
              {data?.data &&
                !showCompletedTasks &&
                !showDailyTasks &&
                Array.isArray(data.data.todo) &&
                data.data.todo.every(
                  (item: any): item is ITask =>
                    "_id" in item &&
                    "title" in item &&
                    "status" in item &&
                    "priority" in item &&
                    "dueDate" in item,
                ) &&
                data.data.todo.map((task: any) => (
                  <Task
                    key={task._id}
                    _id={task._id}
                    title={task.title}
                    description={task.description}
                    status={task.status}
                    priority={task.priority}
                    dueDate={task.dueDate}
                    imageUrl={task.imageUrl}
                    isDaily={task.isDaily}
                    onEdit={() => openEditTask(task)}
                  ></Task>
                ))}

              {data?.data &&
                showCompletedTasks &&
                Array.isArray(data.data.completed) &&
                data.data.completed.every(
                  (item: any): item is ITask =>
                    "_id" in item &&
                    "title" in item &&
                    "status" in item &&
                    "priority" in item &&
                    "dueDate" in item &&
                    "updatedAt" in item,
                ) &&
                data.data.completed.map((task: any) => (
                  <Task
                    key={task._id}
                    _id={task._id}
                    title={task.title}
                    description={task.description}
                    status={task.status}
                    priority={task.priority}
                    dueDate={task.dueDate}
                    imageUrl={task.imageUrl}
                    isDaily={task.isDaily}
                    updatedAt={task.updatedAt}
                    onEdit={() => openEditTask(task)}
                  ></Task>
                ))}

              {data?.data &&
                showDailyTasks &&
                Array.isArray(data.data.dailyTasks) &&
                data.data.dailyTasks.every(
                  (item: any): item is ITask =>
                    "_id" in item &&
                    "title" in item &&
                    "status" in item &&
                    "priority" in item &&
                    "dueDate" in item &&
                    "isDaily" in item,
                ) &&
                data.data.dailyTasks.map((task: any) => (
                  <Task
                    key={task._id}
                    _id={task._id}
                    title={task.title}
                    description={task.description}
                    status={task.status}
                    priority={task.priority}
                    isDaily={task.isDaily}
                    dueDate={task.dueDate}
                    imageUrl={task.imageUrl}
                    onEdit={() => openEditTask(task)}
                  ></Task>
                ))}
            </div>
          </section>
          <section className="sm:flex sm:basis-1/3">
            {(isDesktop || isSidebarOpen) && (
              <TaskSidebar
                onClose={() => {
                  if (!isDesktop) setIsSidebarOpen(false);
                }}
                editTaskData={editTaskData}
                isDesktop={isDesktop}
                user={data.meta.user}
              ></TaskSidebar>
            )}
          </section>
        </section>
      )}
    </>
  );
};
