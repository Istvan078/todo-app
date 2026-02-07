import type { ITask } from "./task.interface";

// Pick status prop from ITask interface
export type ITaskCounter = Pick<ITask, "status"> & { count: number };
