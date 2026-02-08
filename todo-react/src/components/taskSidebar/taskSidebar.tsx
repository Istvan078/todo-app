import type { FC, ReactElement } from "react";
import { Card } from "@/components/ui/card";
import { UserProfile } from "../userProfile/userProfile";
import { CreateTaskForm } from "../createTaskForm/createTaskForm";
import { Logout } from "../logout/logout";

type TaskSidebarProps = {
  onClose: () => void;
};

export const TaskSidebar: FC<TaskSidebarProps> = ({
  onClose,
}: {
  onClose: () => void;
}): ReactElement => {
  return (
    <section
      className={`fixed top-0 max-sm:left-0 sm:top-4 sm:right-4 w-full h-full sm:w-md`}
    >
      <Card className="flex flex-col w-full h-full p-6 justify-between">
        <UserProfile firstName="Paba"></UserProfile>
        <CreateTaskForm onCreated={onClose}></CreateTaskForm>
        <Logout></Logout>
      </Card>
    </section>
  );
};
