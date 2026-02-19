import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import { matchedData } from 'express-validator';

import { PushService } from './push.service';
import {
  IPushSubscribeBody,
  IPushUnsubscribeBody,
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
      await this.pushService.saveSubscription(
        userId,
        validatedData,
      );
      return { ok: true };
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
      );
      return { ok: true };
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
