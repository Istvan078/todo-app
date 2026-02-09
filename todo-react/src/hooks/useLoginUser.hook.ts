import { useMutation } from "@tanstack/react-query";

type LoginCreds = { email: string; password: string };

const loginUser = async (userCreds: LoginCreds) => {
  try {
    const response = await fetch(import.meta.env.VITE_API_URL + "users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCreds),
    });
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error("Wrong email or password");
  }
};

export function useLoginUser() {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      console.log("Login successful:", response);
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
