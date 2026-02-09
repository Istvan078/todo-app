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
import { Pencil, X } from "lucide-react";
import { useDeleteTask } from "@/hooks/useDeleteTask.hook";

export const Task: FC<ITask & { onEdit: () => void }> = (
  props: ITask & { onEdit: () => void },
): ReactElement => {
  const { title, description, dueDate, priority, status, _id } = props;
  const { onEdit } = props;
  const [progress, setProgress] = useState(false);
  const { mutate } = useUpdateTask();
  const { mutate: mutateDelete } = useDeleteTask();
  const queryClient = useQueryClient();

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
    if (_id)
      mutate(
        { _id: _id, status: value ? "inProgress" : "todo" },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["fetchTasks"],
              refetchType: "all",
            });
          },
        },
      );
  }

  function handleTaskCompleted() {
    if (_id)
      mutate(
        { _id: _id, status: "completed" },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["fetchTasks"],
              refetchType: "all",
            });
          },
        },
      );
  }

  function handleTaskDeleted() {
    if (_id)
      mutateDelete(
        { _id: _id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["fetchTasks"],
              refetchType: "all",
            });
          },
        },
      );
  }

  return (
    <Card className="w-full mb-8 py-2 sm:py-6">
      <CardHeader className="grid grid-cols-4 grid-rows-2 gap-y-5 sm:flex sm:flex-row sm:justify-between px-3">
        <X
          onClick={handleTaskDeleted}
          className="col-start-1 col-end-2 self-center h-4 w-4"
        />
        <CardTitle className="row-start-2 row-end-3 col-start-1 col-end-4 sm:basis-2/3 sm:leading-8 self-center">
          {title}
        </CardTitle>
        <Button
          onClick={onEdit}
          size="sm"
          className="row-start-2 row-end-3 col-start-4 col-end-5 self-center justify-self-end bg-orange-300 hover:bg-orange-400"
        >
          Edit
          <Pencil className="h-4 w-4"></Pencil>
        </Button>
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
      </CardHeader>
      <CardContent className="px-3">
        <p>{description}</p>
      </CardContent>
      <CardFooter className="flex flex-row justify-between px-3">
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
      </CardFooter>
    </Card>
  );
};
