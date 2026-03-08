import { useEffect, useId, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronDownIcon, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreateTaskSchema } from "@/schemas/createTask.schema";
import type z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useCreateTask } from "@/hooks/createTask.hook";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { ITask } from "@/types/task.interface";
import { useUpdateTask } from "@/hooks/useUpdateTask.hook";
import { useSendPush } from "@/hooks/useSendPush.hook";

export const CreateTaskForm = ({
  onCreated,
  editTaskData,
}: {
  onCreated: () => void;
  editTaskData?: ITask;
}) => {
  const form = useForm<z.infer<typeof CreateTaskSchema>>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      status: "todo",
      priority: "normal",
    },
  });

  const { mutate: updateTask, isSuccess: isUpdateSuccess } = useUpdateTask();
  const { mutate: createTask, isSuccess: isCreateSuccess } = useCreateTask();
  const { mutate: sendPush } = useSendPush();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const imageInputId = useId();

  function onSubmit(values: z.infer<typeof CreateTaskSchema>) {
    // const dueDate = values.dueDate.toISOString();

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("status", values.status);
    formData.append("priority", values.priority);
    formData.append("dueDate", values.dueDate.toISOString());
    if (values.image) {
      formData.append("image", values.image);
    }

    const commonOptions = {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["fetchTasks"],
          refetchType: "all",
        });
        onCreated();
        setIsSubmitting(false);
        sendPush({
          title: editTaskData ? "Task Updated" : "New Task Created",
          body: `Task "${values.title}" has been ${
            editTaskData ? "updated" : "created"
          }`,
          url: window.location.origin,
        });
      },
      onError: (error: any) => {
        console.log("Error creating/updating task:", error);
        setIsSubmitting(false);
      },
    };

    if (editTaskData?._id) {
      setIsSubmitting(true);
      formData.append("_id", editTaskData._id);
      updateTask(formData, commonOptions);
    } else {
      setIsSubmitting(true);
      console.log("Creating task with values:", formData);
      createTask(formData, commonOptions);
    }
  }

  useEffect(() => {
    if (editTaskData) {
      form.reset({
        title: editTaskData.title,
        description: editTaskData.description,
        dueDate: new Date(editTaskData.dueDate),
        priority: editTaskData.priority,
        status: editTaskData.status,
      });

      console.log(form.getValues());
    }
    if (!isUpdateSuccess && !isCreateSuccess) return;
    if (isCreateSuccess) {
      toast("New Task Created");
    } else if (isUpdateSuccess) {
      toast("Task Updated");
    }
    form.reset();
  }, [isUpdateSuccess, isCreateSuccess, editTaskData, form]);

  return (
    <div className="overflow-auto">
      <h2 className="text-xl mb-4">
        {editTaskData ? "Edit Task" : "Create a new task"}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="py-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Task Title"
                      {...field}
                      value={field.value ?? ""}
                    ></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
          </div>
          <div className="flex flex-row justify-between py-2">
            <div className="w-full mr-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      key={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Status"></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="todo">Todo</SelectItem>
                          <SelectItem value="inProgress">
                            In-Progress
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="w-full mr-2">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="hidden"
                        id={imageInputId}
                        type="file"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      ></Input>
                    </FormControl>
                    <label
                      htmlFor={imageInputId}
                      className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      <Paperclip className="h-4 w-4" />
                    </label>

                    <span className="text-sm text-muted-foreground truncate">
                      {(field.value?.name && field.value.name) ||
                        editTaskData?.imageUrl?.split("/").pop()}
                    </span>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="w-full ml-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      key={field.value} // Force re-render when value changes
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Priority"></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
            </div>
          </div>
          <div className="py-2">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <Popover
                    open={isDatePopoverOpen}
                    onOpenChange={setIsDatePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          data-empty={!field.value}
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4"></CalendarIcon>
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <ChevronDownIcon />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        animate={true}
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          if (date) {
                            setIsDatePopoverOpen(false);
                          }
                        }}
                        initialFocus
                        // Disable past dates
                        disabled={(date) =>
                          date <
                          new Date(
                            new Date().getTime() - 1 * 24 * 60 * 60 * 1000,
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
          </div>
          <div className="py-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Task Description"
                      {...field}
                    ></Textarea>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
          </div>
          <div className="py-2 flex justify-end">
            <Button disabled={isSubmitting} type="submit">
              {editTaskData ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </Form>
      <Toaster></Toaster>
    </div>
  );
};
