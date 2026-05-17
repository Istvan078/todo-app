import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FC, JSX } from "react";
import {
  Calendar,
  Clock,
  Flag,
  ImageIcon,
  Pencil,
  CircleDot,
  GripVertical,
} from "lucide-react";
import type { ITask } from "@/types/task.interface";
import { Checkbox } from "../ui/checkbox";

type TaskDetailsDialogProps = {
  task: ITask | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: ITask) => void;
  setIsImagePreviewOpen: (isOpen: boolean) => void;
};

export const TaskDetailsDialog: FC<TaskDetailsDialogProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  setIsImagePreviewOpen,
}): JSX.Element | null => {
  if (!task) return null;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  let taskStatus;
  switch (task.status) {
    case "todo": {
      taskStatus = "Todo";
      break;
    }
    case "completed": {
      taskStatus = "Completed";
      break;
    }
    case "inProgress": {
      taskStatus = "In Progress";
      break;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-700 bg-slate-950 text-white sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl font-bold">
              Task details
            </DialogTitle>
            <DialogDescription className="sr-only">
              Full information about this task, including title, description,
              attachment, priority, status, due date, created date and updated
              date.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {isOverdue && (
              <Badge className="bg-red-800 text-white">OVERDUE</Badge>
            )}

            {task.dueDate && (
              <Badge variant="outline" className="border-red-700 text-white">
                {new Date(task.dueDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Badge>
            )}
          </div>

          <section className="space-y-2 border-b border-slate-800 pb-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Title
            </p>
            <h2 className="text-xl font-semibold leading-snug">{task.title}</h2>
          </section>

          <section className="space-y-2 border-b border-slate-800 pb-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Description
            </p>
            <p className="whitespace-pre-line leading-7 text-slate-200">
              {task.description}
            </p>
          </section>

          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Subtasks
            </p>

            {task.subtasks && task.subtasks.length > 0 ? (
              <div className="space-y-2">
                {task.subtasks.map((subtask, index) => (
                  <div
                    key={`${subtask.title}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                  >
                    <GripVertical
                      size={18}
                      className="text-slate-500 cursor-grab"
                    />
                    <Checkbox
                      className="hover:border-orange-300 border-slate-500 data-[state=checked]:border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-green-600"
                      checked={subtask.completed}
                      disabled
                    />

                    <span
                      className={
                        subtask.completed
                          ? "text-green-500 line-through"
                          : "text-slate-200"
                      }
                    >
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No subtasks added.</p>
            )}
          </section>

          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Attachment
            </p>

            {task.imageUrl ? (
              <div className="h-100 overflow-y-auto rounded-xl border border-slate-800">
                <img
                  onClick={() => setIsImagePreviewOpen(true)}
                  src={task.imageUrl}
                  alt={task.title}
                  className="w-full object-cover cursor-pointer"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 p-4 text-slate-400">
                <ImageIcon size={22} />
                <span>No image attached</span>
              </div>
            )}
          </section>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard
              icon={<Flag size={22} className="text-orange-400" />}
              label="Priority"
              value={task.priority}
            />

            <InfoCard
              icon={<CircleDot size={22} className="text-sky-400" />}
              label="Status"
              value={taskStatus}
            />

            <InfoCard
              icon={<Calendar size={22} className="text-red-400" />}
              label="Due date"
              value={
                task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("en-GB")
                  : "No due date"
              }
            />

            <InfoCard
              icon={<Clock size={22} className="text-blue-400" />}
              label="Created at"
              value={
                task.createdAt
                  ? new Date(task.createdAt).toLocaleTimeString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Unknown"
              }
            />

            <InfoCard
              icon={<Clock size={22} className="text-green-400" />}
              label="Updated at"
              value={
                task.updatedAt
                  ? new Date(task.updatedAt).toLocaleTimeString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Unknown"
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-3 border-t border-slate-800 pt-5 sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-700 bg-transparent text-white hover:bg-slate-900"
          >
            Close
          </Button>

          <Button
            onClick={() => {
              onEdit(task);
              onClose();
            }}
            className="bg-orange-400 text-slate-950 hover:bg-orange-500"
          >
            Edit task
            <Pencil size={16} className="ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const InfoCard: FC<{
  icon: JSX.Element;
  label: string;
  value: string;
}> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p className="font-semibold text-white">{value}</p>
      </div>
    </div>
  );
};
