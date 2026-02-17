import { Request, Response } from 'express';
import { PushService } from './push.service';
import { inject } from 'inversify';
import { StatusCodes } from 'http-status-codes';

export class PushController {
  constructor(
    @inject(PushService) private pushService: PushService,
  ) {}

  getPublicKey(req: Request, res: Response) {
    return res.json({
      publicKey: this.pushService.getPublicKey(),
    });
  }

  async subscribe(req: Request, res: Response) {
    // verifyToken middleware sets req.user
    const userId = (req as any).user?._id;
    if (!userId)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });

    await this.pushService.saveSubscription(
      userId,
      req.body,
    );
    return res.status(StatusCodes.OK).json({ ok: true });
  }

  async unsubscribe(req: Request, res: Response) {
    const userId = (req as any).user?._id;
    if (!userId)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });

    const { endpoint } = req.body || {};
    if (!endpoint)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Missing endpoint' });

    await this.pushService.deleteByEndpoint(endpoint);
    return res.status(StatusCodes.OK).json({ ok: true });
  }
}
