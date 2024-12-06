"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import "./MessageCard.scss";
import { Message } from "@/models/Message.model";
import { toast } from "react-toastify";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {

  const handleDelete = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );

      toast(response.data.message);
      onMessageDelete(message._id as string);
    } catch (error) {
      toast("Failed to delete the message. Please try again.");
    }
  };

  return (
    <Card className="message-card">
      <CardHeader className="card-header">
        <CardTitle>{message.content || "Untitled Message"}</CardTitle>
        <Button variant="destructive" className="delete-button" onClick={handleDelete}>
          <X />
        </Button>
      </CardHeader>
    </Card>
  );
}
