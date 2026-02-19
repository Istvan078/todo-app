import { checkSchema } from 'express-validator';

export const subscribeValidator = checkSchema({
  endpoint: {
    in: ['body'],
    notEmpty: true,
    isString: true,
    errorMessage:
      'Endpoint is required and must be a string',
  },
  expirationTime: {
    in: ['body'],
    optional: true,
    isInt: true,
    errorMessage: 'Expiration time must be an integer',
  },
  keys: {
    in: ['body'],
    notEmpty: true,
    isObject: true,
    errorMessage: 'Keys are required and must be an object',
  },
  'keys.p256dh': {
    in: ['body'],
    notEmpty: true,
    isString: true,
    errorMessage:
      'p256dh key is required and must be a string',
  },
  'keys.auth': {
    in: ['body'],
    notEmpty: true,
    isString: true,
    errorMessage:
      'Auth key is required and must be a string',
  },
});
