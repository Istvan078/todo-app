import { z } from "zod";

// VALIDATION
export const CreateTaskSchema = z.object({
  title: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return "Title is required";
      },
    })
    .min(2, { error: "Title has to be at least 2 characters" })
    .max(80, { error: "Title must be less than 80 characters" }),
  dueDate: z.date({
    error: "Due date is mandatory",
  }),
  description: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return "Description is required";
      },
    })
    .min(2, { error: "Description has to be at least 2 characters" })
    .max(5000, {
      error: "The description cannot be more then 5000 characters",
    }),
  status: z.enum(["todo", "inProgress", "completed"], {
    error: "Status is required",
  }),
  priority: z.enum(["low", "normal", "high"], {
    error: "Priority is required",
  }),
  image: z.instanceof(File).optional(),
});
