import { injectable } from 'inversify';
import {
  IUser,
  IUserCredentials,
  IUserWithIdAndCreds,
} from './user.interface';
import { Model } from 'mongoose';
import { User } from './user.schema';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

@injectable()
export class UsersService {
  private userModel: Model<IUser> = User;

  public async loginUser(
    userData: IUserWithIdAndCreds,
  ): Promise<
    (IUserCredentials & { tokenExp: number }) | undefined
  > {
    try {
      const user: (IUser & { _id: string }) | null =
        await this.userModel.findOne({
          email: userData.email,
        });
      if (!user) throw new Error('User not found');
      if (user) {
        const isRightPassword = await bcrypt.compare(
          userData.password,
          user.password,
        );
        if (isRightPassword) {
          const token = jsonwebtoken.sign(
            {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              _id: user._id,
            },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '7d' },
          );
          return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            _id: user._id,
            token: token,
            tokenExp: Date.now() + 7 * 24 * 60 * 60 * 1000, // token expires in 7 days
          };
        }
        throw new Error('Wrong password');
      }
    } catch (error) {
      throw new Error('Error while logging in user');
    }
    return;
  }

  public async createUser(userData: IUser) {
    const hashedPassword = await bcrypt.hash(
      userData.password,
      10,
    );
    userData.password = hashedPassword;
    const user = await new this.userModel(userData).save();
    const token = jsonwebtoken.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '10m' },
    );
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      _id: user._id,
      token: token,
      tokenExp: new Date().getTime() + 10 * 60 * 1000,
    };
  }
}
