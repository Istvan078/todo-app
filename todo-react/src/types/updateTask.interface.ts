import type { ITask } from "./task.interface";

export type IUpdateTask = Partial<ITask> & { _id: string };
