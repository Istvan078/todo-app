import { checkSchema } from 'express-validator';

export const createTaskValidator = checkSchema({
  title: {
    // the title should exists in the body
    in: ['body'],
    // can't be empty
    notEmpty: true,
    errorMessage: 'The title is required',
    isString: true,
    isLength: {
      options: {
        max: 80,
        min: 3,
      },
      errorMessage:
        'Title has to be minimum 3, maximum 80 characters',
    },
    trim: true,
  },
  description: {
    // where to validate, query or body
    in: ['body'],
    notEmpty: true,
    isString: true,
    trim: true,
  },
  status: {
    in: ['body'],
    notEmpty: true,
    isIn: {
      options: [['todo', 'inProgress', 'completed']],
    },
  },
  priority: {
    in: ['body'],
    notEmpty: true,
    isIn: {
      options: [['high', 'normal', 'low']],
    },
  },
  dueDate: {
    in: ['body'],
    // Is ISO Date string?
    isISO8601: true,
    notEmpty: true,
  },
});
