export interface ITask {
  _id?: string;
  title: string;
  description: string;
  status: "todo" | "inProgress" | "completed";
  priority: "low" | "normal" | "high";
  dueDate: string;
  file?: File;
  imageUrl?: string;
  imagePublicId?: string;
  isDaily: boolean;
  updatedAt?: string;
  isDoneToday?: boolean; // for daily tasks to track if they are done today
  doneTodayAt?: string; // to track when the daily task was marked as done
}
