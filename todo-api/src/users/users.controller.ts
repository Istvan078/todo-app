import { inject, injectable } from 'inversify';
import {
  IUser,
  IUserWithIdAndCreds,
} from './user.interface';
import { matchedData } from 'express-validator/lib/matched-data';
import { UsersService } from './users.service';
import { Request, Response } from 'express';

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService)
    private usersService: UsersService,
  ) {}

  public async handlePostUsers(
    req: Request<{}, {}, IUser>,
    res: Response,
  ) {
    const validatedData: IUser = matchedData(req);
    try {
      return await this.usersService.createUser(
        validatedData,
      );
    } catch (err: any) {
      throw new Error(err);
    }
  }

  public async handleLoginUser(
    req: Request<{}, {}, IUserWithIdAndCreds>,
    res: Response,
  ) {
    const validatedData: IUserWithIdAndCreds =
      matchedData(req);
    try {
      return await this.usersService.loginUser(
        validatedData,
      );
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
