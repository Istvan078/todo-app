import { setHeaders } from "@/headers/auth.header";
import type { IUpdateTask } from "@/types/updateTask.interface";
import { useMutation } from "@tanstack/react-query";

const updateTask = async (task: IUpdateTask) => {
  const headers = setHeaders();
  const response = await fetch(`${import.meta.env.VITE_API_URL}tasks/update`, {
    method: "PATCH",
    headers: headers,
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
