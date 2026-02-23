import { setHeaders } from "@/headers/auth.header";
import type { IPushUnsubscribeBody } from "@/types/pushNotification.interface";
import { useMutation } from "@tanstack/react-query";

const unsubscribe = async (subDetails: IPushUnsubscribeBody) => {
  const headers = setHeaders();
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}push/unsubscribe`,
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(subDetails),
    },
  );
  if (!response.ok) {
    throw new Error("Network response not OK");
  }
  return await response.json();
};

export function useUnsubscribe() {
  return useMutation({
    mutationFn: unsubscribe,
    onSuccess: (response: any) => {
      console.log("Unsubscribed successfully:" + response);
      return response;
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
