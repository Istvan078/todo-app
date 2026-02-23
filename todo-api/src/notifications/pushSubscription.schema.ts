import mongoose, { model, Model } from 'mongoose';
import { IPushSubscribeBody } from './interfaces/push.interface';

const pushSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
      unique: true,
    },
    expirationTime: {
      type: Number,
      default: null,
    },
    keys: {
      type: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true },
      },
      required: true,
    },
  },
  { timestamps: true },
);

export const PushSubscription: Model<IPushSubscribeBody> =
  model('PushSubscription', pushSubscriptionSchema);
