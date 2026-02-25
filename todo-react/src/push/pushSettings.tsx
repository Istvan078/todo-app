import { Switch } from "@/components/ui/switch";
import { useCreateSub } from "@/hooks/useCreateSub.hook";
import { useFetchPubKey } from "@/hooks/useFetchPubKey.hook";
import { useFetchSub } from "@/hooks/useGetSub.hook";
import { useUnsubscribe } from "@/hooks/useUnsubscribe.hook";
import type {
  IPushSubscribeBody,
  IPushUnsubscribeBody,
} from "@/types/pushNotification.interface";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactElement } from "react";

type PushSettingsProps = {
  isLoggedOut: boolean;
  onUnsubscribed: (isUnsubscribed: boolean) => void;
};

export function PushSettings({
  isLoggedOut,
  onUnsubscribed,
}: PushSettingsProps): ReactElement {
  const { data, isLoading, error } = useFetchPubKey();
  const { mutate } = useCreateSub();
  const { mutate: unsubscribe } = useUnsubscribe();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const queryClient = useQueryClient();

  const checkIsSubscribed = async () => {
    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.getSubscription();
    // await queryClient.invalidateQueries({
    //   queryKey: ["fetchSub", subscription?.endpoint],
    //   refetchType: "all",
    // });
    await queryClient.invalidateQueries({
      queryKey: ["fetchSub", subscription?.endpoint],
    });
    const data: any =
      queryClient.getQueryData(["fetchSub", subscription?.endpoint]) || {};
    console.log(data);

    if (!subscription?.endpoint) setIsSubscribed(false);
    else setIsSubscribed(true);
  };

  useEffect(() => {
    (async () => {
      checkIsSubscribed();
      if (isLoggedOut) {
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.getSubscription();
        unsubscribe(
          { endpoint: subscription?.endpoint || "" },
          {
            onSuccess: async (data) => {
              setIsSubscribed(false);
              onUnsubscribed(true);
              console.log(data);
            },
          },
        );
      }
    })();
  }, [isLoggedOut]);

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
        {isSubscribed ? "Disable Notifications" : "Enable Notifications"}
      </label>
    </div>
  );
}
