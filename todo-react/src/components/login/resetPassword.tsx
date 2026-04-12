import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoginUserSchema } from "@/schemas/loginUser.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Link, useNavigate } from "react-router";
import { useResetPassword } from "@/hooks/useResetPassword.hook";

export function ResetPasswordForm(): ReactElement {
  const navigate = useNavigate();
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const resetPasswordMutation = useResetPassword();

  const form = useForm<z.infer<typeof LoginUserSchema>>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmedPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginUserSchema>) {
    resetPasswordMutation.mutate(values, {
      onSuccess: () => {
        setIsPasswordReset(true);
      },
      onError: (error) => {
        console.error("Failed to reset password:", error);
      },
    });
  }

  useEffect(() => {
    if (isPasswordReset) {
      navigate("/login");
    }
  }, [isPasswordReset, navigate]);

  return (
    <div className="flex flex-col gap-6 h-screen items-center justify-center">
      <Card className="w-full sm:w-md">
        <CardHeader>
          <CardDescription>
            Enter your email and new password below to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        {...field}
                        placeholder="your@email.com"
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FieldLabel htmlFor="password">New password</FieldLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        {...field}
                        placeholder="your new password"
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="confirmedPassword"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FieldLabel htmlFor="confirm-password">
                      Confirm new password
                    </FieldLabel>
                    <FormControl>
                      <Input
                        id="confirm-password"
                        type="password"
                        {...field}
                        placeholder="confirm your new password"
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <Field className="my-4">
                <Button type="submit">Reset Password</Button>
                <FieldDescription className="text-center">
                  Remembered your password? <Link to="/login">Login here</Link>
                </FieldDescription>
                <FieldDescription className="text-center">
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
