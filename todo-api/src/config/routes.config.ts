import { Application } from 'express';
import { container } from './container';
import { TasksRouter } from '../tasks/task.router';

export function addRoutes(app: Application): Application {
  const tasksRouter =
    container.get<TasksRouter>(TasksRouter);

  app.use('/tasks', tasksRouter.router);

  return app;
}
