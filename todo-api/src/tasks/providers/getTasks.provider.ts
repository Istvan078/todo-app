import { inject, injectable } from 'inversify';
import { TasksService } from '../tasks.service';
import { ITaskPagination } from '../interfaces/taskPagination.interface';
import { ITask } from '../task.interface';

@injectable()
export class GetTasksProvider {
  constructor(
    @inject(TasksService)
    private tasksService: TasksService,
  ) {}

  public async findAllTasks(
    pagination: Partial<ITaskPagination>,
  ): Promise<{ data: ITask[]; meta: {} }> {
    const tasks: ITask[] =
      await this.tasksService.findActive({
        // ?? check if limit prop is set
        // if not set set a def. value of 10
        limit: pagination.limit ?? 10,
        page: pagination.page ?? 1,
        order: pagination.order ?? 'asc',
      });
    const totalTasks =
      await this.tasksService.countDocuments();
    const completedTasks =
      await this.tasksService.countDocuments({
        status: 'completed',
      });
    const todoTasks =
      await this.tasksService.countDocuments({
        status: 'todo',
      });
    const inProgressTasks =
      await this.tasksService.countDocuments({
        status: 'inProgress',
      });
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
