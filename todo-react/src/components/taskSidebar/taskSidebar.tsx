import { useState, type FC, type ReactElement } from "react";
import { Card } from "@/components/ui/card";
import { UserProfile } from "../userProfile/userProfile";
import { CreateTaskForm } from "../createTaskForm/createTaskForm";
import type { ITask } from "@/types/task.interface";
import { XIcon } from "lucide-react";
import { useUpdateUser } from "@/hooks/useUpdateUser.hook";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

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
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  function handleUpdateUser(file: File) {
    const formData = new FormData();
    if (file) formData.append("avatar", file);
    if (user.avatarPublicId)
      formData.append("avatarPublicId", user.avatarPublicId);
    setIsUpdatingAvatar(true);
    updateUser(formData, {
      onSuccess: (response) => {
        // Update the token in localStorage with the new token from the response
        // {token: string, tokenExp: number}
        localStorage.setItem("token", JSON.stringify(response.data));
        queryClient.invalidateQueries({
          queryKey: ["fetchTasks"],
          refetchType: "all",
        });
        setIsUpdatingAvatar(false);
      },
      onError: (error) => {
        console.error("Failed to update user:", error);
        setIsUpdatingAvatar(false);
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
        {isUpdatingAvatar && (
          <div>
            <Spinner className="h-8 w-8 absolute top-15 left-1/2 transform -translate-x-1/2"></Spinner>
          </div>
        )}
        {!isUpdatingAvatar && (
          <UserProfile
            onAvatarChange={handleUpdateUser}
            user={user}
          ></UserProfile>
        )}

        <CreateTaskForm
          editTaskData={editTaskData}
          onCreated={onClose}
        ></CreateTaskForm>
        <div className="spacer-div"></div>
      </Card>
    </section>
  );
};
