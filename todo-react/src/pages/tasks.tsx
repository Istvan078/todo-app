import type { FC, ReactElement } from "react";
import { useEffect, useState } from "react";
import { TasksCounter } from "@/components/tasksCounter/tasksCounter";
import { Task } from "@/components/task/task";
import { TaskSidebar } from "@/components/taskSidebar/taskSidebar";
import { useFetchTasks } from "@/hooks/useFetchTasks.hook";
import type { ITask } from "@/types/task.interface";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

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
  const { data } = useFetchTasks({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState<ITask | undefined>(
    undefined,
  );
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  console.log("Fetched tasks data:", data);

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
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
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
        <section className="sm:flex sm:flex-row w-full p-1 sm:p-4 gap-8 grid">
          <section className="sm:flex sm:basis-2/3 justify-center">
            <div className="flex flex-col sm:w-4/5 p-4">
              <h1 className="text-white font-bold text-2xl mb-8">
                {`Task as on: ${todaysDate()}`}
              </h1>
              <div className="flex justify-around mb-5 sm:mb-12">
                <TasksCounter
                  status="todo"
                  count={
                    data && data.meta && "todoTasks" in data.meta
                      ? (data.meta.todoTasks as number)
                      : 0
                  }
                ></TasksCounter>
                <TasksCounter
                  status="inProgress"
                  count={
                    data && data.meta && "inProgressTasks" in data.meta
                      ? (data.meta.inProgressTasks as number)
                      : 0
                  }
                ></TasksCounter>

                <div
                  onClick={setShowCompletedTasks.bind(
                    null,
                    !showCompletedTasks,
                  )}
                >
                  <TasksCounter
                    status="completed"
                    count={
                      data && data.meta && "completedTasks" in data.meta
                        ? (data.meta.completedTasks as number)
                        : 0
                    }
                  ></TasksCounter>
                </div>
              </div>
              <div className="mb-2 flex justify-between gap-4">
                <Button onClick={showTaskSidebar}>New Task</Button>
                <button onClick={logout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
              {data &&
                !showCompletedTasks &&
                Array.isArray(data.data) &&
                data.data.every(
                  (item): item is ITask =>
                    "_id" in item &&
                    "title" in item &&
                    "status" in item &&
                    "priority" in item &&
                    "dueDate" in item,
                ) &&
                data.data.map((task) => (
                  <Task
                    key={task._id}
                    _id={task._id}
                    title={task.title}
                    description={task.description}
                    status={task.status}
                    priority={task.priority}
                    dueDate={task.dueDate}
                    onEdit={() => openEditTask(task)}
                  ></Task>
                ))}

              {data &&
                showCompletedTasks &&
                Array.isArray((data as any).completedTasks) &&
                (data as any).completedTasks.every(
                  (item: any): item is ITask =>
                    "_id" in item &&
                    "title" in item &&
                    "status" in item &&
                    "priority" in item &&
                    "dueDate" in item,
                ) &&
                (data as any).completedTasks.map((task: any) => (
                  <Task
                    key={task._id}
                    _id={task._id}
                    title={task.title}
                    description={task.description}
                    status={task.status}
                    priority={task.priority}
                    dueDate={task.dueDate}
                    onEdit={() => openEditTask(task)}
                  ></Task>
                ))}
            </div>
          </section>
          <section className="sm:flex sm:basis-1/3">
            {isSidebarOpen && (
              <TaskSidebar
                onClose={() => setIsSidebarOpen(false)}
                editTaskData={editTaskData}
              ></TaskSidebar>
            )}
          </section>
        </section>
      )}
    </>
  );
};
