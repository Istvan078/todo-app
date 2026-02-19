import { setHeaders } from "@/headers/auth.header";
import type { IPushSubscribeBody } from "@/types/pushNotification.interface";
import { useMutation } from "@tanstack/react-query";

const createSub = async (subDetails: IPushSubscribeBody) => {
  const headers = setHeaders();
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}push/subscribe`,
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

export function useCreateSub() {
  return useMutation({
    mutationFn: createSub,
    onSuccess: (response: any) => {
      console.log("Subscription created successfully:" + response);
      return response;
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
