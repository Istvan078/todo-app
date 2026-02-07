import { checkSchema } from 'express-validator';

export const updateTaskValidator = checkSchema({
  _id: {
    in: ['body'],
    notEmpty: true,
    // Validates if the Id is a valid MongoID
    isMongoId: true,
    errorMessage: 'Valid document id is required',
  },
  title: {
    in: ['body'],
    optional: true,
    errorMessage: 'The title is required',
    isString: true,
    isLength: {
      options: {
        max: 50,
        min: 8,
      },
      errorMessage:
        'Title has to be minimum 8, maximum 50 characters',
    },
    trim: true,
  },
  description: {
    in: ['body'],
    optional: true,
    isString: true,
    trim: true,
  },
  status: {
    in: ['body'],
    optional: true,
    isIn: {
      options: [['todo', 'inProgress', 'completed']],
    },
  },
  priority: {
    in: ['body'],
    optional: true,
    isIn: {
      options: [['high', 'normal', 'low']],
    },
  },
  dueDate: {
    in: ['body'],
    // Is ISO Date string?
    isISO8601: true,
    optional: true,
  },
});
