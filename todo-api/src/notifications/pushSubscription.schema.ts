import mongoose, { model, Model } from 'mongoose';
import { IPushSubscribeBody } from './interfaces/push.interface';

const pushSubscriptionItemSchema =
  new mongoose.Schema<IPushSubscribeBody>(
    {
      endpoint: { type: String, required: true },
      expirationTime: { type: Number, default: null },
      keys: {
        type: {
          p256dh: { type: String, required: true },
          auth: { type: String, required: true },
        },
        required: true,
      },
    },
    { _id: false },
  );

const pushSubscriptionsSchema = new mongoose.Schema(
  {
    subscriptions: {
      type: [pushSubscriptionItemSchema],
      required: true,
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export const PushSubscriptions: Model<{
  subscriptions: IPushSubscribeBody[];
  userId: mongoose.Types.ObjectId;
}> = model('PushSubscriptions', pushSubscriptionsSchema);
