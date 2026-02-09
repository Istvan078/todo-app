import { checkSchema } from 'express-validator';

export const createUserValidator = checkSchema({
  firstName: {
    in: ['body'],
    notEmpty: true,
    errorMessage: 'The firstName is required',
    isString: true,
    isLength: {
      options: {
        max: 20,
        min: 2,
      },
      errorMessage:
        'firstName has to be minimum 2, maximum 20 characters',
    },
    trim: true,
  },
  lastName: {
    in: ['body'],
    notEmpty: true,
    errorMessage: 'The Last name is required',
    isString: true,
    isLength: {
      options: {
        max: 20,
        min: 2,
      },
      errorMessage:
        'Last name has to be minimum 2, maximum 20 characters',
    },
    trim: true,
  },
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
