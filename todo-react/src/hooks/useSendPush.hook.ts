import { setHeaders } from "@/headers/auth.header";
import type { IPushNotification } from "@/types/pushNotification.interface";
import { useMutation } from "@tanstack/react-query";

const sendPush = async (pushNotif: IPushNotification) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "push/send-push",
      {
        method: "POST",
        headers: setHeaders(),
        body: JSON.stringify(pushNotif),
      },
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to send push notification");
  }
};

export function useSendPush() {
  return useMutation({
    mutationFn: sendPush,
    onSuccess: (response) => {
      console.log("Push notification sent successfully:", response);
    },
    onError: (error) => {
      console.error("Failed to send push notification:", error);
    },
  });
}
