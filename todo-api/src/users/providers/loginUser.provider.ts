import { inject, injectable } from 'inversify';
import { UsersService } from '../users.service';
import { IUserWithIdAndCreds } from '../user.interface';

@injectable()
export class GetUserProvider {
  constructor(
    @inject(UsersService)
    private usersService: UsersService,
  ) {}

  public async loginUser(userData: IUserWithIdAndCreds) {
    return await this.usersService.loginUser(userData);
  }
}
