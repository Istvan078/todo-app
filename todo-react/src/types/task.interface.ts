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
}
