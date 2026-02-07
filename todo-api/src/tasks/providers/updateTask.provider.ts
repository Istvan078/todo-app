import { inject, injectable } from 'inversify';
import {
  IPartialTaskWithId,
  ITask,
} from '../task.interface';
import { TasksService } from '../tasks.service';
import { Document } from 'mongoose';

@injectable()
export class UpdateTaskProvider {
  constructor(
    @inject(TasksService)
    private tasksService: TasksService,
  ) {}

  // returns a document type promise or promise will never return
  public async updateTask(
    update: IPartialTaskWithId,
  ): Promise<Document | never> {
    // if it's not in db then it's null
    // Document type from mongoDB and intersection ITask
    const task: (Document & ITask) | null =
      await this.tasksService.findById(update._id);
    if (!task) throw new Error('Task does not exist');
    task.title = update.title ? update.title : task.title;
    task.description = update.description
      ? update.description
      : task.description;
    task.dueDate = update.dueDate
      ? update.dueDate
      : task.dueDate;
    task.status = update.status
      ? update.status
      : task.status;
    task.priority = update.priority
      ? update.priority
      : task.priority;
    return await task.save();
  }
}
