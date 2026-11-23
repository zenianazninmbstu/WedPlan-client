
"use client";

import {  useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const videos = [
  "/videos/wedding-hero-1.mp4",
  "/videos/wedding-hero-2.mp4",
  "/videos/wedding-hero-3.mp4",
  "/videos/wedding-hero-4.mp4",
   "/videos/wedding-hero-5.mp4",
  "/videos/wedding-hero-6.mp4",
];

export default function HeroBanner() {
  const [activeVideo, setActiveVideo] = useState(0);
  const router = useRouter();
  useEffect(() => {
  const interval = window.setInterval(() => {
    setActiveVideo((current) => (current + 1) % videos.length);
  }, 9000);

  return () => window.clearInterval(interval);
}, []);

 

  return (
    <section className="relative flex min-h-[11cm] items-center justify-center overflow-hidden bg-[#30251f]">
      {/* Background video */}
      <div className="absolute inset-0">
      <AnimatePresence mode="sync">

  <motion.video
    key={activeVideo}
    src={videos[activeVideo]}
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
    aria-hidden="true"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{
      duration: 1.2,
      ease: "easeInOut",
    }}
    className="absolute inset-0 h-full w-full object-cover"
  />
</AnimatePresence>
     {/* Very light overlay */}
       <div className="absolute inset-0 bg-black/10" />  
         
          </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 text-center text-white sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/90 sm:text-xs sm:tracking-[0.4em]"
        >
          Your Story · Our Passion · One Perfect Day
        </motion.p>

        <motion.h1
  initial={{ opacity: 0, y: 25 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 0.2 }}
  className="mx-auto max-w-6xl font-serif text-2xl font-bold leading-[1.2] tracking-tight text-white sm:text-3xl lg:whitespace-nowrap lg:text-4xl xl:text-5xl"
>
  Your Dream Wedding Starts Here
</motion.h1>

        {/* Three-level description */}

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 0.4 }}
  className="mx-auto mt-5 max-w-4xl text-center font-sans text-base font-normal leading-relaxed text-white sm:text-lg"
>
  <p className="hidden sm:block">
    Your wedding is more than a celebration it is the beginning
  </p>
  <p className="hidden sm:block">
    of a beautiful chapter filled with love joy and
  </p>
  <p className="hidden sm:block">
    memories to last a lifetime.
  </p>

  <p className="px-3 text-sm leading-7 sm:hidden">
    Your wedding is more than a celebration. It is the beginning of a
    beautiful chapter filled with love, joy, and memories to last a lifetime.
  </p>
</motion.div>


        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8"
        >
          <Button
            size="lg"
            onClick={() => router.push("/services")}
            className="h-11 rounded-full bg-[#f1d6bd] px-8 text-sm font-semibold text-[#302019] shadow-md transition-all duration-300 hover:scale-105 hover:bg-white sm:h-12 sm:px-9"
          >
            Explore Wedding Services
          </Button>
        </motion.div>

        {/* Video indicators */}
        <div className="mt-9 flex items-center justify-center gap-3">
          {videos.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show wedding video ${index + 1}`}
              aria-current={activeVideo === index}
              onClick={() => setActiveVideo(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                activeVideo === index
                  ? "w-9 bg-[#f1d6bd]"
                  : "w-4 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
