import { Schema } from 'mongoose';

export interface ITask {
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'completed';
  priority: 'low' | 'normal' | 'high';
  dueDate: Date;
  createdBy: Schema.Types.ObjectId; // user id as string
}

// MAKING OPTIONAL ALL THE ITask properties with Partial plus adding the _id
export interface IPartialTaskWithId extends Partial<ITask> {
  _id: string;
}
