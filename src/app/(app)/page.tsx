"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import "./Home.scss";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardHeader } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <main className="home-main">
        <section className="home-header">
          <h1>Explore the Power of Anonymous Feedback</h1>
          <p>Your insights, without revealing your identity.</p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="message-carousel"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="carousel-item">
                <Card className="message-card">
                  <CardHeader className="card-header">
                  <h2>{message.title}</h2>
                  </CardHeader>
                  <div className="card-content">
                    <Mail className="mail-icon" />
                    <div className="card-text">
                      <p>{message.content}</p>
                      <p className="card-received">{message.received}</p>
                  </div>
                </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>
    </>
  );
}
