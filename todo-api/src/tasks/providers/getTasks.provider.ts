import { inject, injectable } from 'inversify';
import { TasksService } from '../tasks.service';
import { ITaskPagination } from '../interfaces/taskPagination.interface';
import { ITask } from '../task.interface';
import { Schema } from 'mongoose';

@injectable()
export class GetTasksProvider {
  constructor(
    @inject(TasksService)
    private tasksService: TasksService,
  ) {}

  //// OLDER VERSION WITHOUT USER ID //////

  // public async findAllTasks(
  //   pagination: Partial<ITaskPagination>,
  // ): Promise<{ data: ITask[]; meta: {} }> {
  //   const tasks: ITask[] =
  //     await this.tasksService.findActive({
  //       // ?? check if limit prop is set
  //       // if not set set a def. value of 10
  //       limit: pagination.limit ?? 10,
  //       page: pagination.page ?? 1,
  //       order: pagination.order ?? 'asc',
  //     });
  //   const totalTasks =
  //     await this.tasksService.countDocuments();
  //   const completedTasks =
  //     await this.tasksService.countDocuments({
  //       status: 'completed',
  //     });
  //   const todoTasks =
  //     await this.tasksService.countDocuments({
  //       status: 'todo',
  //     });
  //   const inProgressTasks =
  //     await this.tasksService.countDocuments({
  //       status: 'inProgress',
  //     });
  //   return {
  //     data: tasks,
  //     meta: {
  //       totalTasks,
  //       completedTasks,
  //       todoTasks,
  //       inProgressTasks,
  //     },
  //   };
  // }

  // NEW VERSION WITH USER ID - PAGINATION TO BE IMPLEMENTED IN THE FUTURE, FOR NOW WE RETURN ALL TASKS OF THE USER
  public async findAllTasksByUserId(
    pagination: Partial<ITaskPagination>,
    userId: Schema.Types.ObjectId,
  ): Promise<{ data: ITask[]; meta: {} }> {
    const tasks: ITask[] =
      await this.tasksService.findAllTasksByUserId(userId);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (t) => t.status === 'completed',
    ).length;
    const todoTasks = tasks.filter(
      (t) => t.status === 'todo',
    ).length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === 'inProgress',
    ).length;
    return {
      data: tasks,
      meta: {
        totalTasks,
        completedTasks,
        todoTasks,
        inProgressTasks,
      },
    };
  }
}
