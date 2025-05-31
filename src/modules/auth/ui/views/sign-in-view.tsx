"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlert } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formschema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password must be at least 1 characters long"),
});

export const SignInView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const onSubmit = async (data: z.infer<typeof formschema>) => {
    setError(null);
    setPending(true);
    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push("/");
          setPending(false);
        },
        onError: ({ error }) => {
          setError(error.message);
        },
      }
    );
  };

  const form = useForm<z.infer<typeof formschema>>({
    resolver: zodResolver(formschema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-9">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Login to your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@gmail.com"
                            {...field}
                          ></Input>
                        </FormControl>
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          ></Input>
                        </FormControl>
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlert className="h-4 w-4 !text-destructive" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button className="w-full" type="submit" disabled={pending}>
                  Sign In
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    or continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    disabled={pending}
                  >
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    disabled={pending}
                  >
                    Github
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?&nbsp;
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-radial from-green-500 to-green-800 relative hidden md:flex flex-col gap-y-4 items-center justify-center ">
            <p className="text-2xl font-semibold text-white">
              <img src="/logo.svg" alt="logo" className="h-[92px] w-[92px]" />
              Meet.AI
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
