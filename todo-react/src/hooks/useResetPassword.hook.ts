import { useMutation } from "@tanstack/react-query";

type ResetPasswordCreds = {
  email: string;
  password: string;
  confirmedPassword: string;
};

const resetPassword = async (userCreds: ResetPasswordCreds) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "users/reset-password",
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
    throw new Error("Failed to reset password");
  }
};

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      console.log("Password reset successful");
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
