import { Schema, Model, model } from 'mongoose';
import { ITask } from './task.interface';

const taskSchema: Schema<ITask> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter a title'],
      maxLength: [
        50,
        'Title cannot be more than 100 characters',
      ],
      // SANITATIONS
      // removes white spaces
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 500,
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
  },
  // SCHEMA OPTIONS OBJECT
  {
    // if true all docs get a timestamp
    timestamps: true,
  },
);

export const Task: Model<ITask> = model('Task', taskSchema);
