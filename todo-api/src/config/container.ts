import { Container } from 'inversify';
import { TasksController } from '../tasks/tasks.controller';
import { TasksRouter } from '../tasks/task.router';
import { UserController } from '../user/user.controller';
import { TasksService } from '../tasks/tasks.service';
import { UpdateTaskProvider } from '../tasks/providers/updateTask.provider';
import { GetTasksProvider } from '../tasks/providers/getTasks.provider';

export const container: Container = new Container();

container.bind(TasksController).toSelf().inTransientScope();
container.bind(TasksRouter).toSelf().inTransientScope();
container.bind(TasksService).toSelf().inTransientScope();
container
  .bind(GetTasksProvider)
  .toSelf()
  .inTransientScope();
container
  .bind(UpdateTaskProvider)
  .toSelf()
  .inTransientScope();
container.bind(UserController).toSelf().inTransientScope();
