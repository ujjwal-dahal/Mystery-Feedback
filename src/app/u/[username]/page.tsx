"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import messages from "./suggest-messages.json";

import "./UserPage.scss";
import { messageSchema } from "@/schemas/messageSchema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export default function UserPage() {
  const params = useParams();
  const username = params?.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const arrayMessageFromJSON = messages.map((item) => item.message);

  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(arrayMessageFromJSON);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        ...data,
        username,
      });
      toast.success(response.data.message);
      form.reset({ content: "" });
    } catch (error) {
      const axiosError : any = error as AxiosError;
      toast.error(axiosError.response?.data.message || "Failed to send the message");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post("/api/suggest-messages");
      const newMessages = response.data.message?.split("||") || [];
      setSuggestedMessages(newMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch suggestions. Please try again later.");
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const messageContent = form.watch("content");

  return (
    <div className="public-profile">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="title">Public Profile Link</div>
        <div className="input-field">
          <p>Send Anonymous Message to @{username}</p>
          <input
            type="text"
            placeholder="Write Your Anonymous Message Here"
            className="input-box"
            {...form.register("content")}
          />
          {isLoading ? (
            <Button disabled>
              <Loader2 className="spin-message" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" disabled={!messageContent || isLoading}>
              Send It
            </Button>
          )}
        </div>
      </form>
      <div className="suggest-btn">
        <Button
          onClick={fetchSuggestedMessages}
          className="button"
          disabled={isSuggestLoading}
        >
          {isSuggestLoading ? <Loader2 className="spin-message" /> : "Suggest Messages"}
        </Button>
      </div>
      <p className="text">Click on any message below to select it.</p>
      <div className="second-container">
        <Card>
          <CardHeader>
            <h3 className="card-header">Suggested Messages</h3>
          </CardHeader>
          <CardContent className="card-content">
            {suggestedMessages.length > 0 ? (
              suggestedMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            ) : (
              <p className="text-gray-500">No suggestions available. Try again later.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="account-container">
        <div className="text">Get Your Message Board</div>
        <Link href="/sign-up">
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
