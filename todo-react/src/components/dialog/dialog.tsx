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
  onConfirm: () => void;
  onClose: () => void;
}> = ({
  isDialogOpen,
  confirmText,
  dialogDescription,
  onConfirm,
  onClose,
}): JSX.Element => (
  <Dialog open={isDialogOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>{dialogDescription}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={onConfirm} variant="destructive">
          {confirmText}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
