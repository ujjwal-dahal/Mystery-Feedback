"use client";

import { Mail } from "lucide-react";
import messages from "@/messages.json";
import "./Home.scss";


import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // Correct import for Autoplay
import "swiper/css";

export default function Home() {
  return (
    <>
      <main className="home-main">
        <section className="home-header">
          <h1>Explore the Power of Anonymous Feedback</h1>
          <p>Your insights, without revealing your identity.</p>
        </section>

        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          modules={[Autoplay]} 
          className="message-swiper"
        >
          {messages.map((message, index) => (
            <SwiperSlide key={index} className="carousel-item">
              <div className="message-card">
                <div className="card-header">
                  <h2>{message.title}</h2>
                </div>
                <div className="card-content">
                  <Mail className="mail-icon" />
                  <div className="card-text">
                    <p>{message.content}</p>
                    <p className="card-received">{message.received}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </main>
    </>
  );
}
