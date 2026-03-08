import { Schema, Model, model } from 'mongoose';
import { ITask } from './task.interface';

const taskSchema: Schema<ITask> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter a title'],
      minLength: [
        1,
        'Title cannot be less than 1 character',
      ],
      maxLength: [
        80,
        'Title cannot be more than 80 characters',
      ],
      // SANITATIONS
      // removes white spaces
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minLength: [1, 'Description cannot be empty'],
      maxLength: [
        5000,
        'Description cannot be more than 5000 characters',
      ],
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['todo', 'inProgress', 'completed'],
      // DEFAULT VALUE IF NONE GIVEN
      default: 'todo',
    },
    priority: {
      type: String,
      required: true,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      default: '',
      optional: true,
    },
    imagePublicId: {
      type: String,
      default: '',
      optional: true,
    },
    isDaily: {
      type: Boolean,
      default: false,
    },
  },
  // SCHEMA OPTIONS OBJECT
  {
    // if true all docs get a timestamp
    timestamps: true,
  },
);

export const Task: Model<ITask> = model('Task', taskSchema);
