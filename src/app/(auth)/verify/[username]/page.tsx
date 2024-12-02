"use client";

import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import "./VerifyUsername.scss";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const UsernamePage = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsCheckingUsername(true);
    try {
      const response = await axios.post(`/api/verify-otp`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data.message ?? "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsCheckingUsername(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-content">
        <div className="head-part">
          <h1>Verify Your Account</h1>
          <p>Enter the verification code sent to your email</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="form">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter six-digit OTP code"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isCheckingUsername}
              className="submit-button"
            >
              {isCheckingUsername ? (
                <>
                  <Loader2 className="loader" />
                  Please Wait
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UsernamePage;
