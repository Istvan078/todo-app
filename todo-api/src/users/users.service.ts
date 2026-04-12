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
import cloudinary from '../cloudinary';
import { UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';

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
              avatarUrl: user?.avatarUrl,
              avatarPublicId: user?.avatarPublicId,
              _id: user._id,
            },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '7d' },
          );
          return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatarUrl: user?.avatarUrl,
            avatarPublicId: user?.avatarPublicId,
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

  public async updateUser(
    userId: string,
    updateData: Partial<IUser>,
    avatarFile?: Express.Multer.File,
  ) {
    if (avatarFile) {
      if (!avatarFile.mimetype.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }
      const uploadedImage: UploadApiResponse =
        await new Promise((resolve, reject) => {
          // Create a Cloudinary upload stream and handle the response in the callback
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder: 'todo-app/avatars',
                resource_type: 'image',
                filename_override: avatarFile.originalname,
                use_filename: true,
                unique_filename: false,
              },
              (error, result) => {
                if (error || !result) return reject(error);
                resolve(result);
              },
            );
          // Convert the buffer to a stream and pipe it to Cloudinary
          streamifier
            .createReadStream(avatarFile.buffer)
            .pipe(uploadStream);
        });
      if (updateData?.avatarPublicId)
        await cloudinary.uploader.destroy(
          updateData.avatarPublicId,
        );
      updateData.avatarUrl = uploadedImage.secure_url;
      updateData.avatarPublicId = uploadedImage.public_id;
    }
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(
        updateData.password,
        10,
      );
      updateData.password = hashedPassword;
    }
    const updatedUser =
      await this.userModel.findByIdAndUpdate(
        userId,
        updateData,
        // return the updated document instead of the old one
        { new: true },
      );
    if (!updatedUser) {
      throw new Error('User not found');
    }
    const updatedToken = jsonwebtoken.sign(
      {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        avatarUrl: updatedUser?.avatarUrl,
        avatarPublicId: updatedUser?.avatarPublicId,
        _id: updatedUser._id,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '7d' },
    );
    return {
      token: updatedToken,
      tokenExp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
  }

  public async resetPassword(data: Partial<IUser>) {
    if (data?.password) {
      const user = await this.userModel.findOne({
        email: data.email,
      });
      if (!user) {
        throw new Error('User not found');
      }
      const hashedPassword = await bcrypt.hash(
        data.password,
        10,
      );
      user.password = hashedPassword;
      await user.save();
    }
  }
}
