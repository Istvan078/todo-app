import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FC, JSX } from "react";
import { Button } from "@/components/ui/button";

export const TaskDialog: FC<{
  isDialogOpen: boolean;
  confirmText: string;
  dialogDescription: string;
  buttonVariant?: "destructive" | "default";
  onConfirm: (isTask: boolean, isImage: boolean) => void;
  onClose: () => void;
}> = ({
  isDialogOpen,
  confirmText,
  dialogDescription,
  onConfirm,
  onClose,
  buttonVariant = "destructive",
}): JSX.Element => (
  <Dialog open={isDialogOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>{dialogDescription}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          onClick={() =>
            onConfirm(
              confirmText.includes("Task") ? true : false,
              confirmText.includes("Image") ? true : false,
            )
          }
          variant={buttonVariant}
          className={`${
            buttonVariant === "destructive"
              ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
              : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
          }`}
        >
          {confirmText}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
