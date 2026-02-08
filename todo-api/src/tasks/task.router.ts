import { Router, Request, Response } from 'express';
import { TasksController } from './tasks.controller';
import { inject, injectable } from 'inversify';
import {
  IPartialTaskWithId,
  ITask,
} from './task.interface';
import { createTaskValidator } from './validators/createTask.validator';
import { validationResult } from 'express-validator';
import { getTasksValidator } from './validators/getTasks.validator';
import { StatusCodes } from 'http-status-codes';
import { updateTaskValidator } from './validators/updateTask.validator';
import { deleteTaskValidator } from './validators/deleteTask.validator';

@injectable()
export class TasksRouter {
  public router: Router;

  constructor(
    @inject(TasksController)
    private tasksController: TasksController,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      '/',
      getTasksValidator,
      async (req: Request, res: Response) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
          const allTasks =
            await this.tasksController.handleGetTasks(
              req,
              res,
            );
          res.status(StatusCodes.OK).json(allTasks);
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json(result.array());
        }
      },
    );

    this.router.post(
      '/create',
      createTaskValidator,
      async (
        req: Request<{}, {}, ITask>,
        res: Response,
      ) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
          const newTask =
            await this.tasksController.handlePostTasks(
              req,
              res,
            );
          res.status(StatusCodes.CREATED).json(newTask);
        } else {
          // gives back the validation errors as array
          res
            .status(StatusCodes.BAD_REQUEST)
            .json(result.array());
        }
      },
    );

    this.router.patch(
      '/update',
      updateTaskValidator,
      async (
        req: Request<{}, {}, IPartialTaskWithId>,
        res: Response,
      ) => {
        const result = validationResult(req);
        // if no error(if valres is empty)
        if (result.isEmpty()) {
          const updatedTask =
            await this.tasksController.handlePatchTasks(
              req,
              res,
            );
          res.status(StatusCodes.OK).json(updatedTask);
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json(result.array());
        }
      },
    );

    this.router.delete(
      '/delete',
      deleteTaskValidator,
      async (
        req: Request<{}, {}, { _id: string }>,
        res: Response,
      ) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
          const deletedTask =
            await this.tasksController.handleDeleteTasks(
              req,
              res,
            );
          res.status(StatusCodes.OK).json(deletedTask);
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json(result.array());
        }
      },
    );
  }
}
