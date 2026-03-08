import { setHeaders } from "@/headers/auth.header";
import { useMutation } from "@tanstack/react-query";

const deleteTaskImage = async (_id: { _id: string }) => {
  const headers = setHeaders();
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}tasks/delete-image`,
    {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify(_id),
    },
  );
  if (!response.ok) {
    throw new Error("Network response not OK");
  }
  return await response.json();
};

export function useDeleteTaskImage() {
  return useMutation({
    mutationFn: deleteTaskImage,
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
