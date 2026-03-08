import { injectable } from 'inversify';
import { Task } from './task.schema';
import { Model, QueryFilter, Schema } from 'mongoose';
import { ITask } from './task.interface';
import { ITaskPagination } from './interfaces/taskPagination.interface';
import cloudinary from '../cloudinary';
import streamifier from 'streamifier';
import { UploadApiResponse } from 'cloudinary';

@injectable()
export class TasksService {
  // Model stays private inside the service
  private taskModel: Model<ITask> = Task;

  // Create Task
  public async createTask(
    taskData: ITask,
    userId: Schema.Types.ObjectId,
    file?: Express.Multer.File,
  ) {
    taskData.createdBy = userId;
    if (file) {
      if (!file.mimetype.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }
      const uploadedImage: UploadApiResponse =
        await new Promise((resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder: 'todo-app',
                resource_type: 'image',
                filename_override: file.originalname,
                use_filename: true,
                unique_filename: false,
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
      taskData.imageUrl = uploadedImage.secure_url;
      taskData.imagePublicId = uploadedImage.public_id;
    }
    return await new this.taskModel(taskData).save();
  }
  // Find by id
  public async findById(_id: string) {
    return await this.taskModel.findById(_id);
  }
  // Find user's tasks by user id
  public async findAllTasksByUserId(
    userId: Schema.Types.ObjectId,
    pagination: ITaskPagination,
  ): Promise<{ tasks: ITask[]; completedTasks: any }> {
    const completedTasks = await this.taskModel
      .find({
        createdBy: userId,
        status: 'completed',
      })
      .sort({
        dueDate: pagination.order === 'asc' ? 1 : -1,
      });
    return {
      tasks: await this.taskModel
        .find({
          createdBy: userId,
          status: { $in: ['todo', 'inProgress'] },
        })
        .limit(pagination.limit)
        .skip(pagination.page - 1),
      completedTasks: completedTasks,
    };
  }
  // Find all
  public async findAll(pagination: ITaskPagination) {
    return await this.taskModel
      .find()
      .limit(pagination.limit)
      // .skip() - How many pages to skip when paginating all documents
      .skip(pagination.page - 1)
      .sort({
        createdAt: pagination.order === 'asc' ? 1 : -1,
      });
  }

  // Find active tasks
  public async findActive(pagination: ITaskPagination) {
    return await this.taskModel
      .find({
        status: { $in: ['todo', 'inProgress'] },
      })
      .limit(pagination.limit)
      // .skip() - How many pages to skip when paginating all documents
      .skip(pagination.page - 1);
    // .sort({
    //   createdAt: pagination.order === 'asc' ? 1 : -1,
    // });
  }

  public async countDocuments(filter?: QueryFilter<ITask>) {
    return await this.taskModel.countDocuments(filter);
  }

  public async deleteTask(_id: string) {
    const task = await this.taskModel.findOne({ _id: _id });
    // If the task has an associated image, delete it from Cloudinary
    if (task?.imagePublicId) {
      await cloudinary.uploader.destroy(task.imagePublicId);
    }
    return task?.deleteOne();
  }
}
