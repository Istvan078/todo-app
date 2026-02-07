export interface ITask {
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'completed';
  priority: 'low' | 'normal' | 'high';
  dueDate: Date;
}

// MAKING OPTIONAL ALL THE ITask properties with Partial plus adding the _id
export interface IPartialTaskWithId extends Partial<ITask> {
  _id: string;
}
