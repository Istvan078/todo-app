export interface IPushUnsubscribeBody {
  endpoint: string;
}

interface IPushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface IPushSubscribeBody {
  endpoint: string;
  expirationTime?: number | null;
  keys: IPushSubscriptionKeys;
}
