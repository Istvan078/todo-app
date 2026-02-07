import type { IUpdateTask } from "@/types/updateTask.interface";
import { useMutation } from "@tanstack/react-query";

const updateTask = async (task: IUpdateTask) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}tasks/update`, {
    method: "PATCH",
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

export function useUpdateTask() {
  return useMutation({
    mutationFn: updateTask,
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
