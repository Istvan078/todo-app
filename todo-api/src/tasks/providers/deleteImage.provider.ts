import { inject, injectable } from 'inversify';
import cloudinary from '../../cloudinary';
import { TasksService } from '../tasks.service';

@injectable()
export class DeleteImageProvider {
  constructor(
    @inject(TasksService)
    private tasksService: TasksService,
  ) {}

  public async deleteImage(taskId: string) {
    try {
      const task = await this.tasksService.findById(taskId);
      if (!task) throw new Error('Task does not exist');
      // Call Cloudinary's API to delete the image
      await cloudinary.uploader.destroy(
        task.imagePublicId as string,
      );
      task.imagePublicId = '';
      task.imageUrl = '';
      return await task.save();
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
