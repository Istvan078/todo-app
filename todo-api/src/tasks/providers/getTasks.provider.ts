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

  // NEW VERSION WITH USER ID - PAGINATION TO BE IMPLEMENTED IN THE FUTURE, FOR NOW WE RETURN ALL TASKS OF THE USER IN ASCENDING ORDER BASED ON DUE DATE
  public async findAllTasksByUserId(
    pagination: Partial<ITaskPagination> = { order: 'asc' },
    userId: Schema.Types.ObjectId,
  ): Promise<{
    data: ITask[] |{ todo: ITask[]; completed: ITask[] };
    meta: {};
  }> {
    const tasks: any =
      await this.tasksService.findAllTasksByUserId(userId, {
        limit: pagination.limit ?? 10,
        page: pagination.page ?? 1,
        order: pagination.order ?? 'dsc',
      });
    tasks.tasks.sort((a: any, b: any) =>
      pagination.order === 'asc'
        ? b.dueDate.getTime() - a.dueDate.getTime()
        : a.dueDate.getTime() - b.dueDate.getTime(),
    );

    const totalTasks = tasks.tasks?.length;
    const completedTasks = tasks.completedTasks?.length;
    const todoTasks = tasks.tasks.filter(
      (t: any) => t.status === 'todo',
    )?.length;
    const inProgressTasks = tasks.tasks.filter(
      (t: any) => t.status === 'inProgress',
    )?.length;
    return {
      data: {
        todo: tasks.tasks,
        completed: tasks.completedTasks,
      },
      meta: {
        totalTasks,
        completedTasks,
        todoTasks,
        inProgressTasks,
      },
    };
  }
}
