import { checkSchema } from 'express-validator';

export const pushValidator = checkSchema({
  title: {
    in: 'body',
    isString: true,
    notEmpty: true,
  },
  body: {
    in: 'body',
    isString: true,
    optional: true,
  },
  url: {
    optional: true,
    in: 'body',
    isURL: true,
  },
  icon: {
    optional: true,
    in: 'body',
    isURL: true,
  },
  badge: {
    optional: true,
    in: 'body',
    isURL: true,
  },
});
