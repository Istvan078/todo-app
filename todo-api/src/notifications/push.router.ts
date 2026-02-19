import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { PushController } from './push.controller';
import { StatusCodes } from 'http-status-codes';
import { validationResult } from 'express-validator';

@injectable()
export class PushRouter {
  public router: Router;

  constructor(
    @inject(PushController)
    private pushController: PushController,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /public-key - Get the public key for push notifications
    this.router.get(
      '/public-key',
      async (req: Request, res: Response) => {
        const publicKey =
          await this.pushController.getPublicKey(req, res);
        res.status(StatusCodes.OK).json({ publicKey });
      },
    );

    // POST /subscribe - Subscribe to push notifications
    this.router.post(
      '/subscribe',
      async (req: Request, res: Response) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
          const savedSubscription =
            await this.pushController.subscribe(req, res);
          return res
            .status(StatusCodes.CREATED)
            .json(savedSubscription);
        } else {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json(result.array());
        }
      },
    );

    // Unsubscribe notifications
    this.router.post(
      '/unsubscribe',
      async (req: Request, res: Response) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
          const deletedSubscription =
            await this.pushController.unsubscribe(req, res);
          return res
            .status(StatusCodes.OK)
            .json(deletedSubscription);
        } else {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json(result.array());
        }
      },
    );
  }
}
