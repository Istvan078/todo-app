import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useCreateSub } from "@/hooks/useCreateSub.hook";
import { useFetchPubKey } from "@/hooks/useFetchPubKey.hook";
import { useFetchSub } from "@/hooks/useGetSub.hook";
import { useUnsubscribe } from "@/hooks/useUnsubscribe.hook";
import type {
  IPushSubscribeBody,
  IPushUnsubscribeBody,
} from "@/types/pushNotification.interface";
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
  const [endpoint, setEndpoint] = useState("");
  const [isItLoading, setLoading] = useState(false);
  const { data: subExists } = useFetchSub(endpoint);

  const checkIsSubscribed = async () => {
    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.getSubscription();
    setEndpoint(subscription?.endpoint ?? "");
    const isSubExists = subExists?.data?.exists;
    if (!isSubExists) setIsSubscribed(false);
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
            onSuccess: async () => {
              setIsSubscribed(false);
              onUnsubscribed(true);
            },
          },
        );
      }
    })();
  }, [isLoggedOut, endpoint, subExists]);

  const subForPushNotif = async () => {
    setLoading(true);
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
        onSuccess: () => {
          setIsSubscribed(true);
          setLoading(false);
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
          onSuccess: async () => {
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
    <div className="flex items-center">
      {isItLoading && <Spinner className="w-6 h-6"></Spinner>}
      {!isItLoading && (
        <Switch
          id="subscribeSwitch"
          checked={isSubscribed}
          onCheckedChange={subForPushNotif}
          className="data-[state=checked]:!bg-purple-800 data-[state=unchecked]:!bg-gray-700"
        ></Switch>
      )}
      <label htmlFor="subscribeSwitch" className="ml-2">
        {!isItLoading
          ? isSubscribed
            ? "Disable Notifications"
            : "Enable Notifications"
          : ""}
        {isItLoading && !isSubscribed
          ? "Enabling..."
          : isItLoading && isSubscribed
            ? "Disabling..."
            : ""}
      </label>
    </div>
  );
}
