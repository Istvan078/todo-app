export interface IPushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface IPushSubscribeBody {
  endpoint: string;
  expirationTime?: number | null;
  keys: IPushSubscriptionKeys;
}

export interface IPushUnsubscribeBody {
  endpoint: string;
}

// PUSH PAYLOAD TYPE
export type PushPayload = {
  title: string;
  body?: string;
  url?: string;
  icon?: string;
  badge?: string;
};
