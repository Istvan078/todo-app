import { model, Schema } from 'mongoose';
import { IUser } from './user.interface';

const userSchema: Schema<IUser> = new Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    maxLength: [
      20,
      'First name cannot be more than 20 characters',
    ],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    maxLength: [
      20,
      'Last name cannot be more than 20 characters',
    ],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [
      6,
      'Password must be at least 6 characters',
    ],
  },
});

export const User = model('User', userSchema);
