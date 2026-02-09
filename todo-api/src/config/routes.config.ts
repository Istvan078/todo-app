import { Application } from 'express';
import { container } from './container';
import { TasksRouter } from '../tasks/task.router';
import { UsersRouter } from '../users/users.router';
import { verifyToken } from '../middleware/verifyToken.middleware';

export function addRoutes(app: Application): Application {
  const tasksRouter =
    container.get<TasksRouter>(TasksRouter);
  const usersRouter =
    container.get<UsersRouter>(UsersRouter);

  app.use('/tasks', verifyToken, tasksRouter.router);
  app.use('/users', usersRouter.router);

  return app;
}
