import { Switch } from "@/components/ui/switch";
import { useCreateSub } from "@/hooks/useCreateSub.hook";
import { useFetchPubKey } from "@/hooks/useFetchPubKey.hook";
import { useUnsubscribe } from "@/hooks/useUnsubscribe.hook";
import type {
  IPushSubscribeBody,
  IPushUnsubscribeBody,
} from "@/types/pushNotification.interface";
import { useEffect, useState, type ReactElement } from "react";

export function PushSettings(): ReactElement {
  const { data, isLoading, error } = useFetchPubKey();
  const { mutate } = useCreateSub();
  const { mutate: unsubscribe } = useUnsubscribe();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const checkIsSubscribed = async () => {
    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.getSubscription();
    if (!subscription?.endpoint) setIsSubscribed(false);
    else setIsSubscribed(true);
  };

  useEffect(() => {
    (() => {
      checkIsSubscribed();
    })();
  }, []);

  const subForPushNotif = async () => {
    if (!isSubscribed) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Permission not granted");
      const reg = await navigator.serviceWorker.ready;
      const publicKey = data?.data?.publicKey.publicKey;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      });
      const subBody = subscription.toJSON() as unknown as IPushSubscribeBody;
      mutate(subBody, {
        onSuccess: (data) => {
          console.log(data);
          setIsSubscribed(true);
        },
      });
    } else {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();
      if (subscription) {
        const subEndpoint: IPushUnsubscribeBody = {
          endpoint: subscription.endpoint,
        };
        unsubscribe(subEndpoint, {
          onSuccess: async (data) => {
            console.log(data);
            await subscription.unsubscribe();
            setIsSubscribed(false);
          },
        });
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <Switch
        id="subscribeSwitch"
        checked={isSubscribed}
        onCheckedChange={subForPushNotif}
        className="data-[state=checked]:!bg-purple-700 data-[state=unchecked]:!bg-gray-700"
      ></Switch>
      <label htmlFor="subscribeSwitch" className="ml-2">
        Enable Notifications
      </label>
    </div>
  );
}
