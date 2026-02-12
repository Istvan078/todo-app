import { SignupForm } from "@/components/signup/signupForm";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCreateUser } from "@/hooks/useCreateUser.hook";
import type { CreateUserSchema } from "@/schemas/createUser.schema";
import { useState, type FC, type ReactElement } from "react";
import { useNavigate } from "react-router";
import type z from "zod";

export const Signup: FC = (): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useCreateUser();
  const navigate = useNavigate();

  const onSubmit = (values: z.infer<typeof CreateUserSchema>) => {
    setIsLoading(true);
    mutate(
      { ...values },
      {
        onSuccess: (data) => {
          console.log("Signup successful:", data.data.token);
          const token = {
            token: data.data.token,
            tokenExp: data.data.tokenExp,
          };
          localStorage.setItem("token", JSON.stringify(token));
          navigate("/");
        },
        onSettled: () => {
          setIsLoading(false);
        },
      },
    );
  };
  return isLoading ? (
    <div className="flex h-screen gap-4 items-center justify-center">
      <Button disabled size="sm" variant="outline">
        <Spinner data-icon="inline-start" className="h-8 w-8" />
        Loading...
      </Button>
    </div>
  ) : (
    <SignupForm onSubmit={onSubmit} />
  );
};
