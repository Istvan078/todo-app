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
import { CheckIcon, Pencil, X, XIcon } from "lucide-react";
import { useDeleteTask } from "@/hooks/useDeleteTask.hook";
import { useSendPush } from "@/hooks/useSendPush.hook";
import { useDeleteTaskImage } from "@/hooks/useDeleteTaskImage.hook";
import { Spinner } from "@/components/ui/spinner";
import { TaskDialog } from "../dialog/dialog";

export const Task: FC<ITask & { onEdit: () => void }> = (
  props: ITask & { onEdit: () => void },
): ReactElement => {
  const formData = new FormData();
  if (props._id) formData.append("_id", props._id);
  const { title, description, dueDate, priority, status, _id, imageUrl } =
    props;
  const { onEdit } = props;
  const [progress, setProgress] = useState(false);
  const { mutate } = useUpdateTask();
  const { mutate: mutateDelete } = useDeleteTask();
  const { mutate: deleteTaskImage } = useDeleteTaskImage();
  const { mutate: sendPush } = useSendPush();
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogConfirmText, setDialogConfirmText] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");

  const formattedDate = new Date(dueDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    if (status === "inProgress") {
      setProgress(true);
    }
  }, [status]);

  function handleProgressChange(value: boolean) {
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
      },
    });
  }

  function handleTaskCompleted() {
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

  function openTaskDeleteDialog() {
    setIsDialogOpen(true);
    setDialogConfirmText("Delete Task");
    setDialogDescription(
      `Are you sure you want to delete task "${title}"? This action cannot be undone.`,
    );
  }

  function openImageDeleteDialog() {
    setIsDialogOpen(true);
    setDialogConfirmText("Delete Image");
    setDialogDescription(
      `Are you sure you want to delete the image for task "${title}"? This action cannot be undone.`,
    );
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
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDialogOpen(false)}
        dialogDescription={dialogDescription}
      ></TaskDialog>
      <Card
        className={`${status === "completed" ? "bg-slate-800 gap-3" : ""} w-full mb-8 py-2 sm:py-6`}
      >
        <CardHeader className="grid grid-cols-4 grid-rows-2 gap-y-5 sm:flex sm:flex-row sm:justify-between px-3">
          <X
            onClick={openTaskDeleteDialog}
            className={`${status === "completed" ? "col-start-5 col-end-6" : "col-start-1 col-end-2"} self-center h-4 w-4`}
          />
          <CardTitle
            className={`${status === "completed" ? "row-start-1 row-end-3" : "row-start-2 row-end-3"} col-start-1 col-end-4 sm:basis-2/3 sm:leading-8 self-center`}
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
              <Badge className="mr-2" variant="outline">
                {formattedDate}
              </Badge>
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
            </div>
          )}
        </CardHeader>
        <CardContent className="px-3">
          <p>{description}</p>
          {imageUrl && (
            <div className="grid grid-cols-4 grid-rows-1">
              <img
                className="col-start-1 col-end-5 row-start-1 row-end-2 rounded-md"
                width="100%"
                height="auto"
                src={imageUrl}
                alt={title}
              />
              {isLoading && (
                <Spinner className="col-start-4 col-end-5 row-start-1 row-end-2 justify-self-end mr-2 mt-2"></Spinner>
              )}
              {!isLoading && (
                <XIcon
                  onClick={openImageDeleteDialog}
                  className="col-start-4 col-end-5 row-start-1 row-end-2 justify-self-end mr-1 mt-1 cursor-pointer text-gray-300 font-black"
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
                <Switch
                  id="in-progress"
                  checked={progress}
                  onCheckedChange={handleProgressChange}
                ></Switch>
                <Label className="ml-4" htmlFor="in-progress">
                  In Progress
                </Label>
              </div>
              <Button onClick={handleTaskCompleted}>Completed</Button>
            </>
          )}
          {status === "completed" && (
            <>
              <Badge className="justify-self-start self-end bg-green-800 text-gray-300 tracking-widest font-bold">
                Completed
              </Badge>
              <CheckIcon className="h-4 w-4 ml-auto text-green-500" />
            </>
          )}
        </CardFooter>
      </Card>
    </>
  );
};
