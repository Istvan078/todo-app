import { Schema } from 'mongoose';

export interface ITask {
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'completed';
  priority: 'low' | 'normal' | 'high';
  isDaily: boolean;
  dueDate: Date;
  createdBy: Schema.Types.ObjectId; // user id as string
  imageUrl?: string;
  imagePublicId?: string;
  isDoneToday?: boolean; // for daily tasks to track if they are done today
  doneTodayAt?: Date; // to track when the daily task was marked as done
}

// MAKING OPTIONAL ALL THE ITask properties with Partial plus adding the _id
export interface IPartialTaskWithId extends Partial<ITask> {
  _id: string;
}
