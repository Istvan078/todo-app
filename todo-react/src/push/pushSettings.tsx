import { useFetchPubKey } from "@/hooks/useFetchPubKey.hook";
// import { useQueryClient } from "@tanstack/react-query";
import type { ReactElement } from "react";

export function PushSettings(): ReactElement {
  const { data, isLoading, error } = useFetchPubKey();
  const subForPushNotif = () => {
    // itt majd a subscribe logika lesz (permission + pushManager.subscribe + POST /subscribe)
    console.log(data?.data?.publicKey.publicKey);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  async function getSubscriptionFromBrowser() {
    const reg = await navigator.serviceWorker.ready;
    const publicKey = data?.data?.publicKey.publicKe;
    console.log(publicKey);
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey,
    });
    const body = subscription.toJSON();
    console.log(body);
  }
  return (
    <div>
      <button onClick={subForPushNotif}>Subscribe</button>
      <button onClick={getSubscriptionFromBrowser}>GetSubFromBrowser</button>
    </div>
  );
}
