import { checkSchema } from 'express-validator';

export const deleteTaskValidator = checkSchema({
  _id: {
    in: ['body'],
    notEmpty: true,
    // Validates if the Id is a valid MongoID
    isMongoId: true,
    errorMessage: 'Valid document id is required',
  },
});
