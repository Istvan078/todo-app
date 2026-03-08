import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { FC, ReactElement } from "react";

export const UserProfile: FC<{
  user: { firstName: string; lastName: string; email: string };
}> = (props): ReactElement => {
  const { user } = props;

  return (
    <div className="flex flex-col w-full items-center pt-4">
      <Avatar className={`mb-4 ${cn("h-20", "w-20")}`}>
        <AvatarFallback
          className={`text-2xl font-semibold ${cn("bg-violet-600", "dark: bg-violet-600")}`}
        >
          {user?.firstName.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <h4>Hello, {user?.firstName + " " + user?.lastName}</h4>
    </div>
  );
};
