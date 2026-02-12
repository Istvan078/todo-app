import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoginUserSchema } from "@/schemas/loginUser.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Link, useNavigate } from "react-router";

type Props = {
  onSubmit: (values: any) => void;
  isLoading: boolean;
};

export function LoginForm({ onSubmit }: Props): ReactElement {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginUserSchema>>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const autoLoginToken = localStorage.getItem("token");
    if (!autoLoginToken) return;
    if (autoLoginToken) {
      const token = JSON.parse(autoLoginToken);
      if (token.tokenExp > new Date().getTime()) {
        navigate("/", { replace: true });
      } else {
        localStorage.removeItem("token");
        console.log("Token expired, please login again");
      }
    }
  }, [navigate]);

  return (
    <div className="flex flex-col gap-6 h-screen items-center justify-center">
      <Card className="w-full sm:w-md">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        {...field}
                        placeholder="your password"
                        required
                      />
                    </FormControl>
                    {/* <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a> */}
                  </FormItem>
                )}
              ></FormField>
              <Field className="my-4">
                <Button type="submit">Login</Button>
                {/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
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
