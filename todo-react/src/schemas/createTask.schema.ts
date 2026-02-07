import { z } from "zod";

// VALIDATION
export const CreateTaskSchema = z.object({
  title: z.string().max(50, { message: "Title must be less than 100 chars" }),
  dueDate: z.date({
    error: "Due date is mandatory",
  }),
  description: z.string().max(100, {
    message: "The description cannot be more then 500 characters",
  }),
  status: z.enum(["todo", "inProgress", "completed"], {
    message: "Status is required",
  }),
  priority: z.enum(["low", "normal", "high"], {
    message: "Priority is required",
  }),
});
