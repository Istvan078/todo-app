import { setHeaders } from "@/headers/auth.header";
import { useMutation } from "@tanstack/react-query";

const deleteTask = async (_id: { _id: string }) => {
  const headers = setHeaders();
  const response = await fetch(`${import.meta.env.VITE_API_URL}tasks/delete`, {
    method: "DELETE",
    headers: headers,
    body: JSON.stringify(_id),
  });
  if (!response.ok) {
    throw new Error("Network response not OK");
  }
  return await response.json();
};

export function useDeleteTask() {
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
