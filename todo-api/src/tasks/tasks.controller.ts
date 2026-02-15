import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  IPartialTaskWithId,
  ITask,
} from './task.interface';
import { Document, Schema } from 'mongoose';
// import { UserController } from '../user/user.controller';
import { TasksService } from './tasks.service';
import { UpdateTaskProvider } from './providers/updateTask.provider';
import { matchedData } from 'express-validator';
import { ITaskPagination } from './interfaces/taskPagination.interface';
import { GetTasksProvider } from './providers/getTasks.provider';
import { DeleteTaskProvider } from './providers/deleteTask.provider';

@injectable()
export class TasksController {
  constructor(
    // @inject(UserController)
    // private userController: UserController,
    @inject(TasksService)
    private tasksService: TasksService,
    @inject(GetTasksProvider)
    private getTasksProvider: GetTasksProvider,
    @inject(UpdateTaskProvider)
    private updateTaskProvider: UpdateTaskProvider,
    @inject(DeleteTaskProvider)
    private deleteTaskProvider: DeleteTaskProvider,
  ) {}

  public async handleGetTasks(req: Request, res: Response) {
    const validatedData: Partial<ITaskPagination> =
      matchedData(req);
    const userId = (req as any).user
      ?._id as Schema.Types.ObjectId;
    try {
      const tasks: {
        data:
          | ITask[]
          | { todo: ITask[]; completed: ITask[] };
        meta: {};
      } = await this.getTasksProvider.findAllTasksByUserId(
        validatedData,
        userId,
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
    const userId = (req as any).user
      ?._id as Schema.Types.ObjectId;
    try {
      return await this.tasksService.createTask(
        validatedData,
        userId,
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

  public async handleDeleteTasks(
    req: Request<{}, {}, { _id: string }>,
    res: Response,
  ): Promise<any> {
    const validatedData: { _id: string } = matchedData(req);
    try {
      return await this.deleteTaskProvider.deleteTask(
        validatedData._id,
      );
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
