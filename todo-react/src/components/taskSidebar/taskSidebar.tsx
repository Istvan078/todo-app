import type { FC, ReactElement } from "react";
import { Card } from "@/components/ui/card";
import { UserProfile } from "../userProfile/userProfile";
import { CreateTaskForm } from "../createTaskForm/createTaskForm";
import type { ITask } from "@/types/task.interface";
import { XIcon } from "lucide-react";
import { useUpdateUser } from "@/hooks/useUpdateUser.hook";
import { useQueryClient } from "@tanstack/react-query";

type TaskSidebarProps = {
  onClose: () => void;
  editTaskData?: ITask;
  isDesktop: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
    avatarPublicId?: string;
  };
};

export const TaskSidebar: FC<TaskSidebarProps> = ({
  onClose,
  editTaskData,
  isDesktop,
  user,
}: TaskSidebarProps): ReactElement => {
  const { mutate: updateUser } = useUpdateUser();
  const queryClient = useQueryClient();

  function handleUpdateUser(file: File) {
    const formData = new FormData();
    if(file)
    formData.append("avatar", file);
    if(user.avatarPublicId) formData.append("avatarPublicId", user.avatarPublicId);
    updateUser(formData, {
      onSuccess: (response) => {
        // Update the token in localStorage with the new token from the response
        // {token: string, tokenExp: number}
        localStorage.setItem("token", JSON.stringify(response.data));
        queryClient.invalidateQueries({
          queryKey: ["fetchTasks"],
          refetchType: "all",
        });
      },
      onError: (error) => {
        console.error("Failed to update user:", error);
      },
    });
  }
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
        <UserProfile
          onAvatarChange={handleUpdateUser}
          user={user}
        ></UserProfile>
        <CreateTaskForm
          editTaskData={editTaskData}
          onCreated={onClose}
        ></CreateTaskForm>
        <div className="spacer-div"></div>
      </Card>
    </section>
  );
};
