import { inject, injectable } from 'inversify';
import { TasksService } from '../tasks.service';

@injectable()
export class DeleteTaskProvider {
  constructor(
    @inject(TasksService)
    private tasksService: TasksService,
  ) {}

  public async deleteTask(_id: string) {
    try {
      this.tasksService.deleteTask(_id);
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
