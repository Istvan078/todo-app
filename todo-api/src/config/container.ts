import { Container } from 'inversify';
import { TasksController } from '../tasks/tasks.controller';
import { TasksRouter } from '../tasks/task.router';
import { UsersController } from '../users/users.controller';
import { TasksService } from '../tasks/tasks.service';
import { UpdateTaskProvider } from '../tasks/providers/updateTask.provider';
import { GetTasksProvider } from '../tasks/providers/getTasks.provider';
import { DeleteTaskProvider } from '../tasks/providers/deleteTask.provider';
import { UsersRouter } from '../users/users.router';
import { UsersService } from '../users/users.service';
import { PushService } from '../notifications/push.service';

export const container: Container = new Container();

// TASKS RELATED
container.bind(TasksController).toSelf().inTransientScope();
container.bind(TasksRouter).toSelf().inTransientScope();
container.bind(TasksService).toSelf().inTransientScope();
// TASK PROVIDERS
container
  .bind(GetTasksProvider)
  .toSelf()
  .inTransientScope();
container
  .bind(UpdateTaskProvider)
  .toSelf()
  .inTransientScope();
container
  .bind(DeleteTaskProvider)
  .toSelf()
  .inTransientScope();

// USERS RELATED
container.bind(UsersController).toSelf().inTransientScope();
container.bind(UsersRouter).toSelf().inTransientScope();
container.bind(UsersService).toSelf().inTransientScope();

// NOTIFICATIONS RELATED
container.bind(PushService).toSelf().inTransientScope();
