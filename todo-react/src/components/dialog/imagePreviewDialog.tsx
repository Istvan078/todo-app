import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FC, JSX } from "react";

type ImagePreviewDialogProps = {
  imageUrl: string | undefined;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
};

export const ImagePreviewDialog: FC<ImagePreviewDialogProps> = ({
  imageUrl,
  title = "Task image",
  isOpen,
  onClose,
}): JSX.Element | null => {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[95vh] max-w-5xl border-slate-700 bg-slate-950 p-4 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription className="sr-only">
            Large preview of the attached task image.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[80vh] items-center justify-center overflow-auto rounded-xl bg-black/40">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
