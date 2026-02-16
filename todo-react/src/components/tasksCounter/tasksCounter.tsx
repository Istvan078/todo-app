import type { FC, ReactElement } from "react";
import type { ITaskCounter } from "@/types/taskCounter.interface";
import styles from "./tasksCounter.module.css";

export const TasksCounter: FC<ITaskCounter> = (props): ReactElement => {
  const { status, count, isActive } = props;
  return (
    <div
      className={`flex flex-col items-center justify-center ${styles["trans-all"]} ${isActive && "font-bold"}`}
    >
      <div
        className={`p-2 sm:p-6 border-solid border-4 rounded-full mb-4 ${status === "todo" && "border-red-500"} ${status === "inProgress" && "border-orange-500"} ${status === "completed" && "border-green-500"} ${styles["trans-all"]} ${!isActive && "opacity-50"} ${isActive && styles["translate-y-1"]}`}
      >
        <div className="min-w-10 min-h-10 text-center justify-center text-white text-3xl leading-10">
          {count}
        </div>
      </div>
      <div className="text-white text-sm sm:text-xl text-center">
        {status === "todo" && "Todo"}
        {status === "inProgress" && "In-Progress"}
        {status === "completed" && "Completed"}
      </div>
    </div>
  );
};
