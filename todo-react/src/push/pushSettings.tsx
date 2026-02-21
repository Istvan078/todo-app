import { useCreateSub } from "@/hooks/useCreateSub.hook";
import { useFetchPubKey } from "@/hooks/useFetchPubKey.hook";
import type { IPushSubscribeBody } from "@/types/pushNotification.interface";
// import { useQueryClient } from "@tanstack/react-query";
import type { ReactElement } from "react";

export function PushSettings(): ReactElement {
  const { data, isLoading, error } = useFetchPubKey();
  const { mutate } = useCreateSub();

  const subForPushNotif = () => {
    // itt majd a subscribe logika lesz (permission + pushManager.subscribe + POST /subscribe)
    console.log(data?.data?.publicKey.publicKey);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  async function getSubscriptionFromBrowser() {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") throw new Error("Permission not granted");
    const reg = await navigator.serviceWorker.ready;
    const publicKey = data?.data?.publicKey.publicKey;
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey,
    });
    const subBody = subscription.toJSON() as unknown as IPushSubscribeBody;
    console.log(subBody);
    mutate(subBody, {
      onSuccess: (data) => console.log(data),
    });
  }

  return (
    <div>
      <button onClick={subForPushNotif}>Subscribe</button>
      <button onClick={getSubscriptionFromBrowser}>GetSubFromBrowser</button>
    </div>
  );
}
