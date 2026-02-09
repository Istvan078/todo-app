import { inject, injectable } from 'inversify';
import { UsersController } from './users.controller';
import { Request, Response, Router } from 'express';
import { validationResult } from 'express-validator/lib/validation-result';
import { StatusCodes } from 'http-status-codes';
import {
  IUser,
  IUserWithIdAndCreds,
} from './user.interface';
import { createUserValidator } from './validators/createUser.validator';
import { loginUserValidator } from './validators/loginUser.validator';
@injectable()
export class UsersRouter {
  public router: Router;

  constructor(
    @inject(UsersController)
    private usersController: UsersController,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/create',
      createUserValidator,
      async (
        req: Request<{}, {}, IUser>,
        res: Response,
      ) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
          const newUser =
            await this.usersController.handlePostUsers(
              req,
              res,
            );
          res.status(StatusCodes.CREATED).json(newUser);
        } else {
          // gives back the validation errors as array
          res
            .status(StatusCodes.BAD_REQUEST)
            .json(result.array());
        }
      },
    );

    this.router.post(
      '/login',
      loginUserValidator,
      async (
        req: Request<{}, {}, IUserWithIdAndCreds>,
        res: Response,
      ) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
          const user =
            await this.usersController.handleLoginUser(
              req,
              res,
            );
          res.status(StatusCodes.CREATED).json(user);
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json(result.array());
        }
      },
    );
  }
}
