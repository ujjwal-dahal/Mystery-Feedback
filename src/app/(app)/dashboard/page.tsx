"use client";

import MessageCard from "@/components/MessageCard/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/models/Message.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import "./Dashboard.scss";
import { User } from "next-auth";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { data: session } = useSession();

  const form: UseFormReturn = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages); // Update state from API
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        `${axiosError.response?.data.message}` || "Failed to fetch settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success(`${response.data.message}`);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          `${axiosError.response?.data.message}` || "Failed to fetch messages"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
      fetchAcceptMessage();
    }
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true); 
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: checked,
      });
      setValue("acceptMessages", checked); 
      toast.success(`${response.data.message}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        `${axiosError.response?.data.message}` || "Failed to update settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const { username } = (session?.user || {}) as User;
  const baseURL = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseURL}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Your profile URL has been copied to the clipboard.");
  };

  if (!session || !session.user) {
    return (
      <h1 style={{ fontFamily: "Montserrat", textAlign: "center" }}>
        Please Login
      </h1>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Dashboard</h1>

      <div className="link-section">
        <h2 className="link-title">Copy Your Unique Link</h2>
        <div className="link-container">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="link-input"
          />
          <Button onClick={copyToClipboard} className="copy-button">
            Copy
          </Button>
        </div>
      </div>

      <div className="switch-section">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={(checked) => handleSwitchChange(checked)}
          disabled={isSwitchLoading}
          className="message-switch"
        />
        <span className="switch-label">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>

      <Separator className="separator" />

      <Button
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
        className="refresh-button"
      >
        {isLoading ? (
          <Loader2 className="loading-icon" />
        ) : (
          <RefreshCcw className="refresh-icon" />
        )}
      </Button>

      <div className="messages-grid">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="no-messages">No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
