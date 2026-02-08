import type { FC, ReactElement } from "react";
import { Card } from "@/components/ui/card";
import { UserProfile } from "../userProfile/userProfile";
import { CreateTaskForm } from "../createTaskForm/createTaskForm";
import { Logout } from "../logout/logout";
import styles from "./style.module.css";

export const TaskSidebar: FC = (): ReactElement => {
  return (
    <section
      className={`fixed top-4 right-4 ${styles.sidebarHeight} ${styles.taskSidebar}`}
    >
      <Card className="flex flex-col w-full h-full p-6 justify-between">
        <UserProfile firstName="Paba"></UserProfile>
        <CreateTaskForm></CreateTaskForm>
        <Logout></Logout>
      </Card>
    </section>
  );
};
