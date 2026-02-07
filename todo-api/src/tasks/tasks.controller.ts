import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  IPartialTaskWithId,
  ITask,
} from './task.interface';
import { Document } from 'mongoose';
// import { UserController } from '../user/user.controller';
import { TasksService } from './tasks.service';
import { UpdateTaskProvider } from './providers/updateTask.provider';
import { matchedData } from 'express-validator';
import { ITaskPagination } from './interfaces/taskPagination.interface';
import { GetTasksProvider } from './providers/getTasks.provider';

@injectable()
export class TasksController {
  constructor(
    // @inject(UserController)
    // private userController: UserController,
    @inject(TasksService)
    private tasksService: TasksService,
    @inject(UpdateTaskProvider)
    private updateTaskProvider: UpdateTaskProvider,
    @inject(GetTasksProvider)
    private getTasksProvider: GetTasksProvider,
  ) {}

  public async handleGetTasks(req: Request, res: Response) {
    const validatedData: Partial<ITaskPagination> =
      matchedData(req);
    try {
      const tasks: { data: ITask[]; meta: {} } =
        await this.getTasksProvider.findAllTasks(
          validatedData,
        );
      return tasks;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  public async handlePostTasks(
    req: Request<{}, {}, ITask>,
    res: Response,
  ) {
    const validatedData: ITask = matchedData(req);
    try {
      return await this.tasksService.createTask(
        validatedData,
      );
    } catch (err: any) {
      throw new Error(err);
    }
  }

  public async handlePatchTasks(
    req: Request<{}, {}, IPartialTaskWithId>,
    res: Response,
  ): Promise<Document> {
    const validatedData: IPartialTaskWithId =
      matchedData(req);
    try {
      return await this.updateTaskProvider.updateTask(
        validatedData,
      );
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
