import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import { matchedData } from 'express-validator';

import { PushService } from './push.service';
import {
  IPushSubscribeBody,
  IPushUnsubscribeBody,
  PushPayload,
} from './interfaces/push.interface';

@injectable()
export class PushController {
  constructor(
    @inject(PushService)
    private pushService: PushService,
  ) {}

  public async getPublicKey(req: Request, res: Response) {
    try {
      return {
        publicKey: this.pushService.getPublicKey(),
      };
    } catch (err: any) {
      throw new Error(err);
    }
  }

  public async subscribe(
    req: Request<{}, {}, IPushSubscribeBody>,
    res: Response,
  ) {
    const validatedData: IPushSubscribeBody =
      matchedData(req);
    const userId = (req as any).user
      ?._id as Schema.Types.ObjectId;
    try {
      const savedSubMsg =
        await this.pushService.saveSubscription(
          userId,
          validatedData,
        );
      return savedSubMsg;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  public async unsubscribe(
    req: Request<{}, {}, IPushUnsubscribeBody>,
    res: Response,
  ) {
    const validatedData: IPushUnsubscribeBody =
      matchedData(req);
    const userId = (req as any).user
      ?._id as Schema.Types.ObjectId;
    try {
      if (!userId) {
        return { ok: false };
      }

      await this.pushService.deleteByEndpoint(
        validatedData.endpoint,
        userId,
      );
      return { message: 'Unsubscribed successfully.' };
    } catch (err: any) {
      throw new Error(err);
    }
  }

  public async sendPushToUser(req: Request, res: Response) {
    const payload: PushPayload = matchedData(req);
    const userId = (req as any).user._id;
    try {
      await this.pushService.sendPushToUser(
        userId,
        payload,
      );
      return {
        message: 'Payload sent successfully to user.',
      };
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
