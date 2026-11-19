"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Search, Heart, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover Wedding Services",
    description:
      "Explore a wide range of wedding services, from beautiful venues to photography, catering and decoration.",
    image: "/images/step-1-discover.jpg",
    imageAlt: "Elegant wedding reception and services",
  },
  {
    icon: Heart,
    title: "Choose Your Perfect Vendor",
    description:
      "Compare available services, explore the details and find the right vendors for your dream wedding.",
    image: "/images/step-2-choose.jpg",
    imageAlt: "Romantic wedding consultation inspiration",
  },
  {
    icon: CalendarCheck,
    title: "Send Your Booking Request",
    description:
      "Found your favorite service? Send a booking request and manage your wedding plans with ease.",
    image: "/images/step-3-booking.jpg",
    imageAlt: "Beautiful wedding celebration",
  },
];

export default function HowWedPlanWorks() {
  return (
    <section className="bg-[#F8F5EE] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
        >
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#A47C55]">
            Your Journey Starts Here
          </span>

          <h2 className="font-playfair text-3xl font-semibold text-[#174C3C] sm:text-4xl lg:text-5xl">
            How WedPlan Works
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#6B746E] sm:text-base">
            Planning your dream wedding doesn't have to be complicated.
            Follow three simple steps and let WedPlan make your journey easier.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="group overflow-hidden rounded-2xl border border-[#E8E1D5] bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-[#F8F5EE] sm:h-60">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${step.image})` }}
                    role="img"
                    aria-label={step.imageAlt}
                  />

                  <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF1EC] text-[#174C3C]">
                    <Icon size={24} strokeWidth={1.8} />
                  </div>

                  <h3 className="font-playfair text-xl font-semibold text-[#174C3C] sm:text-2xl">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#747C76]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 text-center sm:mt-14"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-[#174C3C] px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#A47C55]"
          >
            Browse Services
            <ArrowRight size={17} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
