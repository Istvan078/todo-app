import { checkSchema } from 'express-validator';

export const getTasksValidator = checkSchema({
  limit: {
    in: ['query'],
    optional: true,
    isInt: {
      options: {
        min: 1,
      },
    },
    // validator converts it to number
    toInt: true,
  },
  page: {
    in: ['query'],
    optional: true,
    isInt: {
      options: {
        min: 1,
      },
    },
    toInt: true,
  },
  order: {
    in: ['query'],
    optional: true,
    isIn: {
      options: [['asc', 'desc']],
    },
  },
});
