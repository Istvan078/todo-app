import { checkSchema } from 'express-validator';

export const loginUserValidator = checkSchema({
  email: {
    in: ['body'],
    notEmpty: true,
    errorMessage: 'The email is required',
    isEmail: true,
    normalizeEmail: true,
    trim: true,
  },
  password: {
    in: ['body'],
    notEmpty: true,
    errorMessage: 'The password is required',
    isString: true,
    isLength: {
      options: {
        max: 20,
        min: 6,
      },
      errorMessage:
        'Password has to be minimum 6, maximum 20 characters',
    },
    trim: true,
  },
});
