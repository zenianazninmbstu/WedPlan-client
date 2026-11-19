
"use client";

import { motion } from "motion/react";
import {
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Clock,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted Vendors",
    description:
      "Discover verified wedding vendors and choose with confidence for your special day.",
  },
  {
    icon: HeartHandshake,
    title: "Easy Booking",
    description:
      "Connect with your preferred vendors and send booking requests with just a few clicks.",
  },
  {
    icon: Sparkles,
    title: "Everything in One Place",
    description:
      "Explore venues, photography, catering, decoration and more from one platform.",
  },
  {
    icon: Clock,
    title: "Save Time & Effort",
    description:
      "Make wedding planning easier with organized services and simple booking management.",
  },
];

export default function WhyChooseWedPlan() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">


<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.9, ease: "easeOut" }}
  className="mx-auto mb-12 max-w-2xl text-center"
>
  <motion.span
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay: 0.2 }}
    className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#A47C55]"
  >
    The WedPlan Difference
  </motion.span>

  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 0.3 }}
    className="font-playfair text-3xl font-semibold text-[#174C3C] sm:text-4xl lg:text-5xl"
  >
    Why Choose WedPlan?
  </motion.h2>

  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 0.5 }}
    className="mt-4 text-sm leading-7 text-[#6B746E] sm:text-base"
  >
    Your dream wedding deserves thoughtful planning.
    We make finding and booking wedding services easier,
    simpler and more enjoyable.
  </motion.p>
</motion.div>


        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -6 }}
                className="h-full"
              >
                <Card className="h-full rounded-2xl border border-[#E8E1D5] bg-[#F8F5EE] shadow-sm transition-shadow duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#174C3C] text-white">
                      <Icon size={27} strokeWidth={1.7} />
                    </div>

                    <h3 className="font-playfair text-xl font-semibold text-[#174C3C]">
                      {benefit.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#747C76]">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
