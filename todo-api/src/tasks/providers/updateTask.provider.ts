import { inject, injectable } from 'inversify';
import {
  IPartialTaskWithId,
  ITask,
} from '../task.interface';
import { TasksService } from '../tasks.service';
import { Document } from 'mongoose';
import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../../cloudinary';
import streamifier from 'streamifier';

@injectable()
export class UpdateTaskProvider {
  constructor(
    @inject(TasksService)
    private tasksService: TasksService,
  ) {}

  // returns a document type promise or promise will never return
  public async updateTask(
    update: IPartialTaskWithId,
    file?: Express.Multer.File,
  ): Promise<Document | never> {
    // if it's not in db then it's null
    // Document type from mongoDB and intersection ITask
    const task: (Document & ITask) | null =
      await this.tasksService.findById(update._id);
    if (!task) throw new Error('Task does not exist');
    if (file) {
      if (!file.mimetype.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }
      const oldImagePublicId = task.imagePublicId;
      const uploadedImage: UploadApiResponse =
        await new Promise((resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder: 'todo-app',
                resource_type: 'image',
              },
              (error, result) => {
                if (error || !result) return reject(error);
                resolve(result);
              },
            );
          streamifier
            .createReadStream(file.buffer)
            .pipe(uploadStream);
        });
      task.imageUrl = uploadedImage.secure_url;
      task.imagePublicId = uploadedImage.public_id;

      // If there was an old image and it's different from the new one, delete the old image from Cloudinary
      if (oldImagePublicId)
        await cloudinary.uploader.destroy(oldImagePublicId);
    }
    task.title = update.title ? update.title : task.title;
    task.description = update.description
      ? update.description
      : task.description;
    task.dueDate = update.dueDate
      ? update.dueDate
      : task.dueDate;
    task.status = update.status
      ? update.status
      : task.status;
    task.priority = update.priority
      ? update.priority
      : task.priority;
    return await task.save();
  }
}
