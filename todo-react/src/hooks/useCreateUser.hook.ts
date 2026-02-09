import { useMutation } from "@tanstack/react-query";

type SignupCreds = { email: string; password: string };

const createUser = async (userCreds: SignupCreds) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "users/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCreds),
      },
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error("Failed to create user");
  }
};

export function useCreateUser() {
  return useMutation({
    mutationFn: createUser,
    onSuccess: (response) => {
      console.log("User created successfully:", response);
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
