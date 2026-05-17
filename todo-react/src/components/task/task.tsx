import { useEffect, type FC, type ReactElement, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ITask } from "@/types/task.interface";
import { useUpdateTask } from "@/hooks/useUpdateTask.hook";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircleIcon, CheckIcon, Pencil, X, XIcon } from "lucide-react";
import { useDeleteTask } from "@/hooks/useDeleteTask.hook";
import { useSendPush } from "@/hooks/useSendPush.hook";
import { useDeleteTaskImage } from "@/hooks/useDeleteTaskImage.hook";
import { Spinner } from "@/components/ui/spinner";
import { TaskDialog } from "../dialog/dialog";
import { TaskDetailsDialog } from "../dialog/taskDetailsDialog";

export const Task: FC<ITask & { onEdit: () => void }> = (
  props: ITask & { onEdit: () => void },
): ReactElement => {
  const formData = new FormData();
  if (props._id) formData.append("_id", props._id);
  const {
    title,
    description,
    dueDate,
    priority,
    status,
    _id,
    imageUrl,
    isDaily,
    isDoneToday,
    isOverdue,
  } = props;
  const { onEdit } = props;
  const [progress, setProgress] = useState(false);
  const { mutate } = useUpdateTask();
  const { mutate: mutateDelete } = useDeleteTask();
  const { mutate: deleteTaskImage } = useDeleteTaskImage();
  const { mutate: sendPush } = useSendPush();
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);
  const [dialogConfirmText, setDialogConfirmText] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [buttonVariant, setButtonVariant] = useState<"destructive" | "default">(
    "destructive",
  );
  const [isCompleted, setIsCompleted] = useState(false);

  const formattedDate = new Date(dueDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    if (status === "inProgress") {
      setProgress(true);
    }
  }, [status, isDoneToday]);

  function handleProgressChange(value: boolean) {
    setLoading(true);
    setProgress(value);
    if (_id) {
      formData.set("status", value ? "inProgress" : "todo");
    }
    mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["fetchTasks"],
          refetchType: "all",
        });
        sendPush({
          title: `Task ${value ? "In Progress" : "Set to To-Do"}`,
          body: `The task "${title}" is now ${value ? "in progress" : "set to to-do"} at ${new Date().toLocaleTimeString()}`,
          url: window.location.origin,
        });
        setLoading(false);
      },
    });
  }

  function handleConfirmCompleted() {
    setIsDialogOpen(true);
    setDialogConfirmText("Complete Task");
    setDialogDescription(`Mark "${title}" as completed?`);
    setButtonVariant("default");
  }

  function handleTaskCompleted() {
    setLoading(true);
    if (_id) {
      formData.set("status", "completed");
    }
    mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["fetchTasks"],
          refetchType: "all",
        });
        sendPush({
          title: "Task Completed",
          body: `The task "${title}" has been completed! at ${new Date().toLocaleTimeString()}`,
          url: window.location.origin,
        });
        setLoading(false);
        setIsCompleted(false);
        setIsDialogOpen(false);
      },
    });
  }

  function handleSetIsDoneToday(value: boolean) {
    setLoading(true);
    if (_id) {
      formData.set("isDoneToday", String(value));
      formData.set("doneTodayAt", new Date().toISOString());
    }
    mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["fetchTasks"],
          refetchType: "all",
        });
        sendPush({
          title: `Task Done for Today`,
          body: `The task "${title}" has been marked as done for today at ${new Date().toLocaleTimeString()}`,
          url: window.location.origin,
        });
        setLoading(false);
      },
    });
  }

  function handleConfirmDelete(isTask = true, isImage = false) {
    if (isTask && _id)
      mutateDelete(
        { _id: _id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["fetchTasks"],
              refetchType: "all",
            });
            sendPush({
              title: `Task Deleted`,
              body: `The task "${title}" has been deleted at ${new Date().toLocaleTimeString()}`,
              url: window.location.origin,
            });
          },
        },
      );
    if (isImage && _id) handleDeleteTaskImage();
    setIsDialogOpen(false);
  }

  function onOpenDetails(task: ITask) {
    console.log("Opening details for task:", task);
    setIsTaskDetailsDialogOpen(true);
  }

  function openTaskDeleteDialog() {
    setIsDialogOpen(true);
    setDialogConfirmText("Delete Task");
    setDialogDescription(
      `Are you sure you want to delete task "${title}"? This action cannot be undone.`,
    );
    setButtonVariant("destructive");
  }

  function openImageDeleteDialog() {
    setIsDialogOpen(true);
    setDialogConfirmText("Delete Image");
    setDialogDescription(
      `Are you sure you want to delete the image for task "${title}"? This action cannot be undone.`,
    );
    setButtonVariant("destructive");
  }

  function handleDeleteTaskImage() {
    if (_id) {
      setLoading(true);
      deleteTaskImage(
        { _id: _id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["fetchTasks"],
              refetchType: "all",
            });
            setLoading(false);
            sendPush({
              title: `Task Image Deleted`,
              body: `The image for the task "${title}" has been deleted at ${new Date().toLocaleTimeString()}`,
              url: window.location.origin,
            });
          },
        },
      );
    }
  }

  return (
    <>
      <TaskDialog
        isDialogOpen={isDialogOpen}
        confirmText={dialogConfirmText}
        buttonVariant={buttonVariant}
        onConfirm={isCompleted ? handleTaskCompleted : handleConfirmDelete}
        onClose={() => setIsDialogOpen(false)}
        dialogDescription={dialogDescription}
      ></TaskDialog>
      <TaskDetailsDialog
        task={props}
        isOpen={isTaskDetailsDialogOpen}
        onClose={() => setIsTaskDetailsDialogOpen(false)}
        onEdit={setIsTaskDetailsDialogOpen.bind(null, false) && onEdit}
      ></TaskDetailsDialog>
      <Card
        className={`${status === "completed" ? "bg-slate-800 gap-3" : ""} w-full mb-8 py-2 sm:pb-4`}
      >
        <CardHeader className="grid grid-cols-4 grid-rows-2 sm:flex sm:flex-row sm:justify-between px-3">
          <X
            onClick={openTaskDeleteDialog}
            className={`${status === "completed" ? "col-start-5 col-end-6 sm:order-2" : "col-start-1 col-end-2 self-start mt-1 sm:self-center sm:mt-0"} self-center h-4 w-4`}
          />
          <CardTitle
            className={`${status === "completed" ? "row-start-1 row-end-3 sm:order-1" : "row-start-2 row-end-3 self-center"} col-start-1 col-end-4 sm:basis-2/3 sm:leading-8 `}
          >
            {title}
          </CardTitle>
          {status !== "completed" && (
            <Button
              onClick={onEdit}
              size="sm"
              className="row-start-2 row-end-3 col-start-4 col-end-5 self-center justify-self-end bg-orange-300 hover:bg-orange-400"
            >
              Edit
              <Pencil className="h-4 w-4"></Pencil>
            </Button>
          )}
          {status !== "completed" && (
            <div className="flex col-start-4 col-end-5 justify-self-end">
              <Badge
                className={`mr-2 ${isOverdue ? "bg-red-800/40 uppercase tracking-wide font-bold border-red-800" : ""}`}
                variant="outline"
              >
                {!isDaily ? formattedDate : "Daily"}
              </Badge>
              {isOverdue === true && (
                <Badge
                  className="bg-red-800 uppercase tracking-wide font-bold"
                  variant="outline"
                >
                  Overdue
                </Badge>
              )}
              {!isOverdue && (
                <>
                  {priority === "normal" && (
                    <Badge className="bg-sky-800" variant="outline">
                      {priority}
                    </Badge>
                  )}
                  {priority === "high" && (
                    <Badge className="bg-red-800" variant="outline">
                      {priority}
                    </Badge>
                  )}
                  {priority === "low" && (
                    <Badge className="bg-green-800" variant="outline">
                      {priority}
                    </Badge>
                  )}
                </>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="px-3">
          <div>
            <p>{description}</p>
            <Button
              variant="ghost"
              size="sm"
              className="px-0 text-sky-300 hover:text-sky-200"
              onClick={() => onOpenDetails(props)}
            >
              View details →
            </Button>
          </div>
          {imageUrl && (
            <div className="grid grid-cols-4 grid-rows-1">
              <div className="col-start-1 col-end-5 row-start-1 row-end-2 w-full overflow-hidden rounded-md border border-slate-700 bg-slate-900 overflow-y-auto max-h-170">
                <img
                  className="h-auto w-full rounded-md"
                  src={imageUrl}
                  alt={title}
                />
              </div>
              {isLoading && (
                <Spinner className="col-start-4 col-end-5 row-start-1 row-end-2 justify-self-end mr-2 mt-2"></Spinner>
              )}
              {!isLoading && (
                <XIcon
                  onClick={openImageDeleteDialog}
                  className="col-start-4 col-end-5 row-start-1 row-end-2 justify-self-end mr-1 mt-1 cursor-pointer text-red-400/70 font-black hover:text-gray-300 hover:bg-gray-500 size-10 bg-gray-700/70 rounded-full p-1"
                ></XIcon>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter
          className={`flex flex-row ${status === "completed" ? "justify-start" : "justify-between"} px-3`}
        >
          {(status === "todo" || status === "inProgress") && (
            <>
              <div className="flex flex-row items-center">
                {!isLoading && (
                  <Switch
                    id="in-progress"
                    checked={progress}
                    onCheckedChange={handleProgressChange}
                  ></Switch>
                )}

                {isLoading && <Spinner className="w-6 h-6"></Spinner>}

                <Label className="ml-4" htmlFor="in-progress">
                  In Progress
                </Label>
              </div>
              {!isDaily && (
                <>
                  <Button
                    onClick={() => {
                      setIsCompleted(true);
                      handleConfirmCompleted();
                    }}
                  >
                    {!isLoading && "Completed"}
                    {isLoading && <Spinner className="w-6 h-6"></Spinner>}
                  </Button>
                </>
              )}
            </>
          )}
          {isDaily && (
            <Button
              size={"sm"}
              className={
                isDoneToday
                  ? "bg-green-700 tracking-wide"
                  : "bg-orange-600 tracking-wide"
              }
              onClick={() => handleSetIsDoneToday(true)}
            >
              {!isLoading
                ? !isDoneToday
                  ? "Done Today?"
                  : "Done for Today"
                : ""}
              {isLoading && <Spinner className="w-6 h-6"></Spinner>}
              {!isLoading && isDoneToday && (
                <CheckCircleIcon className="text-white"></CheckCircleIcon>
              )}
            </Button>
          )}
          {status === "completed" && (
            <>
              <Badge className="justify-self-start self-end bg-green-800 text-gray-300 tracking-widest font-bold">
                Completed on{" "}
                {new Date(props.updatedAt || "").toLocaleDateString()}
              </Badge>
              <CheckIcon className="h-4 w-4 ml-auto text-green-500" />
            </>
          )}
        </CardFooter>
      </Card>
    </>
  );
};
