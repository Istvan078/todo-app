import { setHeaders } from "@/headers/auth.header";
import { useMutation } from "@tanstack/react-query";

const updateTask = async ({ formData }: { formData: FormData }) => {
  const headers = setHeaders();
  // because we're sending FormData, we need to let the browser set the Content-Type header with the correct boundary
  headers?.delete("Content-Type");
  const response = await fetch(`${import.meta.env.VITE_API_URL}tasks/update`, {
    method: "PATCH",
    headers: headers,
    body: formData,
  });
  if (!response.ok) {
    const errBody = await response.json();
    throw new Error(errBody?.error?.[0]?.msg || "Failed to update task");
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
