import type { IResponse } from "@/types/response.interface";
import type { ITask } from "@/types/task.interface";
import { useMutation } from "@tanstack/react-query";

const createTask = async (task: ITask) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}tasks/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error("Network response not OK");
  }
  return await response.json();
};

export function useCreateTask() {
  return useMutation({
    mutationFn: createTask,
    onSuccess: (response: IResponse<ITask>) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
