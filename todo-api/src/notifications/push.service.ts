import webpush from 'web-push';
import { PushSubscriptions } from './pushSubscription.schema';
import { injectable } from 'inversify';
import mongoose, { Model } from 'mongoose';
import {
  IPushSubscribeBody,
  PushPayload,
} from './interfaces/push.interface';

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
  private pushModel: Model<{
    subscriptions: IPushSubscribeBody[];
    userId: mongoose.Types.ObjectId;
  }> = PushSubscriptions;
  async saveSubscription(
    userId: mongoose.Schema.Types.ObjectId,
    subscription: webpush.PushSubscription,
  ) {
    // Ensure user document exists
    await this.pushModel.updateOne(
      { userId },
      {
        $setOnInsert: {
          userId,
          subscriptions: [],
        },
      },
      { upsert: true },
    );

    // Delete existing subscription with the same endpoint
    await this.pushModel.updateOne(
      { userId },
      {
        $pull: {
          subscriptions: {
            endpoint: subscription.endpoint,
          },
        },
      },
    );

    // Add new subscription
    await this.pushModel.updateOne(
      { userId },
      {
        $push: {
          subscriptions: subscription,
        },
      },
    );
    return { message: 'Subscription saved successfully' };
  }

  // Delete subscription by endpoint
  async deleteByEndpoint(
    endpoint: string,
    userId: mongoose.Schema.Types.ObjectId,
  ) {
    await this.pushModel.updateOne(
      { userId: userId },
      {
        $pull: {
          subscriptions: {
            endpoint: endpoint,
          },
        },
      },
    );
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
      throw new Error(error.message);
    }
  }

  async sendPushToUser(
    userId: string,
    payload: PushPayload,
  ) {
    const userSubscription = await this.pushModel
      .findOne({
        userId,
      })
      .lean();
    for (const s of userSubscription?.subscriptions ?? []) {
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
