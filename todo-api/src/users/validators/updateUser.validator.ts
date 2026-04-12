import { checkSchema } from 'express-validator';

export const updateUserValidator = checkSchema({
  firstName: {
    optional: true,
    isString: true,
    isLength: {
      options: { max: 20, min: 2 },
      errorMessage:
        'firstName has to be minimum 2, maximum 20 characters',
    },
    trim: true,
  },
  lastName: {
    optional: true,
    isString: true,
    isLength: {
      options: { max: 20, min: 2 },
      errorMessage:
        'Last name has to be minimum 2, maximum 20 characters',
    },
    trim: true,
  },
  email: {
    optional: true,
    isEmail: {
      errorMessage: 'Invalid email format',
    },
    // Normalize the email to ensure consistency
    normalizeEmail: true,
  },
  password: {
    optional: true,
    isString: true,
    isLength: {
      options: { min: 6 },
      errorMessage:
        'Password must be at least 6 characters long',
    },
  },
  confirmedPassword: {
    optional: true,
    isString: true,
    isLength: {
      options: { min: 6 },
      errorMessage:
        'Confirm password must be at least 6 characters long',
    },
    custom: {
      options: (value, { req }) => {
        if (
          req.body.password &&
          value !== req.body.password
        ) {
          throw new Error('Passwords do not match');
        }
        return true;
      },
    },
  },
  avatarUrl: {
    optional: true,
    isURL: {
      errorMessage: 'Invalid URL format',
    },
  },
  avatarPublicId: {
    optional: true,
    isString: true,
  },
});
