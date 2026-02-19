import { checkSchema } from 'express-validator';

export const unsubscribeValidator = checkSchema({
  endpoint: {
    in: ['body'],
    notEmpty: true,
    isString: true,
    errorMessage:
      'Endpoint is required and must be a string',
  },
});
