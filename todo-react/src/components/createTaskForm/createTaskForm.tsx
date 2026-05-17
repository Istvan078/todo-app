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
import {
  CalendarIcon,
  ChevronDownIcon,
  GripVertical,
  Paperclip,
  Plus,
  Trash2,
} from "lucide-react";
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
import { Switch } from "../ui/switch";
import { Spinner } from "../ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";

const defaultFormValues: Partial<z.infer<typeof CreateTaskSchema>> = {
  title: "",
  description: "",
  status: "todo",
  priority: "normal",
  dueDate: undefined,
  isDaily: false,
  image: undefined,
  subtasks: [],
};
export const CreateTaskForm = ({
  onCreated,
  editTaskData,
  onFormSubmit,
}: {
  onCreated: () => void;
  editTaskData?: ITask;
  onFormSubmit: () => void;
}) => {
  const form = useForm<z.infer<typeof CreateTaskSchema>>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: defaultFormValues,
  });

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: createTask } = useCreateTask();
  const { mutate: sendPush } = useSendPush();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const imageInputId = useId();

  function onSubmit(values: z.infer<typeof CreateTaskSchema>) {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("status", values.status);
    formData.append("priority", values.priority);
    formData.append("dueDate", values.dueDate.toISOString());
    formData.append("isDaily", String(values.isDaily));
    formData.append(
      "subtasks",
      values.subtasks ? JSON.stringify(values.subtasks) : "[]",
    );
    if (values.isDaily) {
      formData.append("isDoneToday", "false");
    }
    if (values.image) {
      formData.append("image", values.image);
    }

    const commonOptions = {
      onSuccess: () => {
        const taskName = editTaskData ? editTaskData.title : values.title;
        queryClient.invalidateQueries({
          queryKey: ["fetchTasks"],
          refetchType: "all",
        });
        onCreated();
        setIsSubmitting(false);
        sendPush({
          title: editTaskData?._id ? "Task Updated" : "New Task Created",
          body: `Task "${taskName}" has been ${
            editTaskData?._id ? "updated" : "created"
          }`,
          url: window.location.origin,
        });
        form.reset(defaultFormValues);
        onFormSubmit();
        toast(
          `Task "${taskName}" ${editTaskData?._id ? "Updated" : "Created"} Successfully`,
        );
      },
      onError: (error: any) => {
        console.error("Failed to submit task:", error);
        setIsSubmitting(false);
      },
    };

    if (editTaskData?._id) {
      setIsSubmitting(true);
      formData.append("_id", editTaskData._id);
      updateTask(formData, commonOptions);
    } else {
      setIsSubmitting(true);
      createTask(formData, commonOptions);
    }
  }

  useEffect(() => {
    if (editTaskData) {
      console.log("Populating form with edit data:", editTaskData);
      form.reset({
        title: editTaskData.title,
        description: editTaskData.description,
        dueDate: new Date(editTaskData.dueDate),
        priority: editTaskData.priority,
        status: editTaskData.status,
        isDaily: editTaskData.isDaily,
        subtasks: editTaskData.subtasks ?? [],
      });
    }
  }, [editTaskData, form]);

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
                        classNames={{
                          day_button: "cursor-pointer",
                          disabled: "cursor-not-allowed opacity-50",
                          button_next: "cursor-pointer",
                          button_previous: "cursor-pointer",
                        }}
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
          <div className="py-2">
            <FormField
              control={form.control}
              name="subtasks"
              render={({ field }) => {
                const subtasks = field.value || [];
                const addSubtask = () => {
                  field.onChange([
                    ...subtasks,
                    {
                      title: "",
                      completed: false,
                    },
                  ]);
                };
                const updateSubtaskTitle = (index: number, title: string) => {
                  field.onChange(
                    subtasks.map((subtask, subtaskIndex) =>
                      subtaskIndex === index
                        ? {
                            ...subtask,
                            title,
                          }
                        : subtask,
                    ),
                  );
                };
                const updateSubtaskCompleted = (
                  index: number,
                  completed: boolean,
                ) => {
                  field.onChange(
                    subtasks.map((subtask, subtaskIndex) =>
                      subtaskIndex === index
                        ? {
                            ...subtask,
                            completed,
                          }
                        : subtask,
                    ),
                  );
                };
                const removeSubtask = (index: number) => {
                  field.onChange(
                    subtasks.filter(
                      (_, subtaskIndex) => subtaskIndex !== index,
                    ),
                  );
                };
                return (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                        Subtasks
                      </h3>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSubtask}
                        className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                      >
                        <Plus size={16} className="mr-2" />
                        Add subtask
                      </Button>
                    </div>
                    {field.value?.length === 0 && (
                      <p className="text-sm text-slate-500">No subtasks yet.</p>
                    )}

                    <div className="space-y-2">
                      {field.value?.map((subtask, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                        >
                          <GripVertical
                            size={26}
                            className="text-slate-500 cursor-grab"
                          />
                          <FormControl>
                            <Checkbox
                              checked={subtask?.completed ?? false}
                              onCheckedChange={(checked) => {
                                updateSubtaskCompleted(index, Boolean(checked));
                              }}
                            />
                          </FormControl>
                          <Input
                            value={subtask?.title ?? ""}
                            placeholder="Subtask title..."
                            className="border-slate-700 bg-slate-950 text-white"
                            onChange={(e) =>
                              updateSubtaskTitle(index, e.target.value)
                            }
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSubtask(index)}
                            className="text-red-400 hover:bg-red-950 hover:text-red-300"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                );
              }}
            ></FormField>
          </div>
          <div className="py-2 flex justify-between">
            <FormField
              control={form.control}
              name="isDaily"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    ></Switch>
                  </FormControl>
                  <span className="ml-1 text-sm">Is this a daily task?</span>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
            <Button disabled={isSubmitting} type="submit">
              {!isSubmitting
                ? editTaskData
                  ? "Update Task"
                  : "Create Task"
                : "Submitting..."}
              {isSubmitting && <Spinner className="w-6 h-6"></Spinner>}
            </Button>
          </div>
        </form>
      </Form>
      <Toaster></Toaster>
    </div>
  );
};
