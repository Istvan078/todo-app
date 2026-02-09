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
import { type ReactElement } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "@/hooks/useCreateUser.hook";
import { CreateUserSchema } from "@/schemas/createUser.schema";

export function SignupForm(): ReactElement {
  const navigate = useNavigate();
  const { mutate } = useCreateUser();

  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CreateUserSchema>) => {
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
      },
    );
  };
  return (
    <div className="flex flex-col gap-6 h-screen items-center justify-center">
      <Card className="w-full sm:w-md">
        <CardHeader>
          <CardTitle>Sign up for an account</CardTitle>
          <CardDescription>
            Sign up for an account to start managing your tasks and boost your
            productivity!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <FormControl>
                      <Input
                        id="firstName"
                        type="text"
                        {...field}
                        placeholder="First name"
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <FormControl>
                      <Input
                        id="lastName"
                        type="text"
                        {...field}
                        placeholder="Last name"
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
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
                <Button type="submit">Sign up</Button>
                {/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login">Login</Link>
                </FieldDescription>
              </Field>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
