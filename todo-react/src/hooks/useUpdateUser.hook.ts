import { setHeaders } from "@/headers/auth.header";
import { useMutation } from "@tanstack/react-query";

const updateUser = async (formData: FormData) => {
  const headers = setHeaders();
  // because we're sending FormData, we need to let the browser set the Content-Type header with the correct boundary
  headers?.delete("Content-Type");
  const response = await fetch(`${import.meta.env.VITE_API_URL}users/update`, {
    method: "PATCH",
    headers: headers,
    body: formData,
  });
  if (!response.ok) {
    const errBody = await response.json();
    throw new Error(errBody?.error?.[0]?.msg || "Failed to update user");
  }
  return await response.json();
};

export function useUpdateUser() {
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  });
}
