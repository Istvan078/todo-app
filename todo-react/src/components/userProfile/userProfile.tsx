import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { FC, ReactElement, ChangeEvent } from "react";
import { useRef } from "react";

export const UserProfile: FC<{
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  onAvatarChange?: (file: File) => void;
}> = (props): ReactElement => {
  const { user, onAvatarChange } = props;
  // Create a ref for the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    // Trigger the file input click when the icon is clicked
    fileInputRef.current?.click();
  };

  // Handle file selection and pass the selected file to the parent component
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  return (
    <div className="flex flex-col w-full items-center pt-4">
      <div className="relative mb-4">
        <Avatar className={cn("h-20", "w-20")}>
          <AvatarImage
            src={user?.avatarUrl}
            alt={`${user?.firstName} ${user?.lastName}`}
          />
          <AvatarFallback
            className={`text-2xl font-semibold ${cn("bg-violet-600", "dark:bg-violet-600")}`}
          >
            {user?.firstName.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <button
          onClick={handleIconClick}
          className="absolute bottom-0 right-0 bg-gray-600 hover:bg-gray-700 rounded-full p-1.5 cursor-pointer transition-colors"
          aria-label="Upload profile picture"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <h4>Hello, {user?.firstName + " " + user?.lastName}</h4>
    </div>
  );
};
