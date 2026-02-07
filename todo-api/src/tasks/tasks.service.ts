import { injectable } from 'inversify';
import { Task } from './task.schema';
import { Model, QueryFilter } from 'mongoose';
import { ITask } from './task.interface';
import { ITaskPagination } from './interfaces/taskPagination.interface';

@injectable()
export class TasksService {
  // Model stays private inside the service
  private taskModel: Model<ITask> = Task;

  // Create Task
  public async createTask(taskData: ITask) {
    return await new this.taskModel(taskData).save();
  }
  // Find by id
  public async findById(_id: string) {
    return await this.taskModel.findById(_id);
  }
  // Find all
  public async findAll(pagination: ITaskPagination) {
    return await this.taskModel
      .find()
      .limit(pagination.limit)
      // .skip() - How many pages to skip when paginating all documents
      .skip(pagination.page - 1)
      .sort({
        createdAt: pagination.order === 'asc' ? 1 : -1,
      });
  }

  // Find active tasks
  public async findActive(pagination: ITaskPagination) {
    return await this.taskModel
      .find({
        status: { $in: ['todo', 'inProgress'] },
      })
      .limit(pagination.limit)
      // .skip() - How many pages to skip when paginating all documents
      .skip(pagination.page - 1)
      .sort({
        createdAt: pagination.order === 'asc' ? 1 : -1,
      });
  }

  public async countDocuments(filter?: QueryFilter<ITask>) {
    return await this.taskModel.countDocuments(filter);
  }
}
