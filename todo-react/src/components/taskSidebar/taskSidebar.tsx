import type { FC, ReactElement } from "react";
import { Card } from "@/components/ui/card";
import { UserProfile } from "../userProfile/userProfile";
import { CreateTaskForm } from "../createTaskForm/createTaskForm";
import type { ITask } from "@/types/task.interface";
import { XIcon } from "lucide-react";

type TaskSidebarProps = {
  onClose: () => void;
  editTaskData?: ITask;
  isDesktop: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export const TaskSidebar: FC<TaskSidebarProps> = ({
  onClose,
  editTaskData,
  isDesktop,
  user,
}: TaskSidebarProps): ReactElement => {
  return (
    <section
      className={`fixed top-0 max-sm:left-0 sm:top-4 sm:right-4 w-full h-full sm:w-md`}
    >
      <Card className="flex flex-col w-full h-full p-6 justify-between relative">
        {!isDesktop && (
          <XIcon
            className="self-end text-red-500 hover:text-red-600 rounded cursor-pointer absolute top-2 right-2"
            onClick={onClose}
          ></XIcon>
        )}
        <UserProfile user={user}></UserProfile>
        <CreateTaskForm
          editTaskData={editTaskData}
          onCreated={onClose}
        ></CreateTaskForm>
        <div className="spacer-div"></div>
      </Card>
    </section>
  );
};
