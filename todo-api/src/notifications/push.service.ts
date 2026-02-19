import webpush from 'web-push';
import { PushSubscription } from './pushSubscription.schema';
import { injectable } from 'inversify';
import mongoose from 'mongoose';

// PUSH PAYLOAD TYPE
type PushPayload = {
  title: string;
  body?: string;
  url?: string;
  icon?: string;
  badge?: string;
};

const subject = process.env.VAPID_SUBJECT;
const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (!subject || !publicKey || !privateKey) {
  throw new Error(
    'Missing VAPID env vars: VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY',
  );
}

webpush.setVapidDetails(subject, publicKey, privateKey);

@injectable()
export class PushService {
  async saveSubscription(
    userId: mongoose.Schema.Types.ObjectId,
    subscription: webpush.PushSubscription,
  ) {
    await PushSubscription.updateOne(
      {
        endpoint: subscription.endpoint,
      },
      {
        $set: {
          userId,
          endpoint: subscription.endpoint,
          expirationTime:
            subscription.expirationTime ?? null,
          keys: subscription.keys,
        },
      },
      {
        // if no document matches, create a new one
        upsert: true,
      },
    );
  }

  // Delete subscription by endpoint
  async deleteByEndpoint(endpoint: string) {
    await PushSubscription.deleteOne({ endpoint });
  }

  async sendPushToSubscription(
    sub: webpush.PushSubscription,
    payload: PushPayload,
  ) {
    const body = JSON.stringify(payload);
    try {
      await webpush.sendNotification(sub, body);
      return true;
    } catch (error: any) {
      const status = error?.statusCode;
      if (status === 410 || status === 404) {
        await this.deleteByEndpoint(sub.endpoint);
      }
      throw error;
    }
  }

  async sendPushToUser(
    userId: string,
    payload: PushPayload,
  ) {
    const subscriptions = await PushSubscription.find({
      userId,
    }).lean();
    for (const s of subscriptions) {
      const sub: webpush.PushSubscription = {
        endpoint: s.endpoint,
        expirationTime: s.expirationTime ?? null,
        keys: s.keys!,
      };

      try {
        await this.sendPushToSubscription(sub, payload);
      } catch (error) {
        console.error(
          'Failed to send push notification:',
          error,
        );
      }
    }
  }

  getPublicKey() {
    return publicKey;
  }
}
