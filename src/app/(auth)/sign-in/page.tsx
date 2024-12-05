"use client";

import { useForm } from "react-hook-form";
import "./SignIn.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import {toast} from "react-toastify";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

export default function SignIn() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      console.log(`Email : ${data.email} Password : ${data.password}`)
      toast.error("Incorrect Email or Password")
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signIn("google", { redirect: true, callbackUrl: "/dashboard" });

    if (result?.error) {
      toast.error("Could not sign in with Google")
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-content">
        <div className="head-part">
          <h1>Join Mystery Feedback</h1>
          <p>Sign in today and embark on your anonymous journey!</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="form">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Sign in</Button>
          </form>
        </Form>

        <div className="google-signin">
          <p>Or sign in with:</p>
          <Button onClick={handleGoogleSignIn}>Sign in with Google</Button>
        </div>

        <div className="member">
          <p>New User?</p>
          <Link href="/sign-up">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
