
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Camera,
  Building2,
  Flower2,
  Utensils,
  Sparkles,
  Shirt,
  ArrowUpRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    number: "01",
    name: "Photography & Videography",
    description: "Capture every beautiful moment of your special day.",
    icon: Camera,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85",
  },
  {
    number: "02",
    name: "Wedding Venues",
    description: "Discover beautiful places for your dream celebration.",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=85",
  },
  {
    number: "03",
    name: "Decoration & Florist",
    description: "Create an unforgettable atmosphere with stunning decor.",
    icon: Flower2,
    image:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=900&q=85",
  },
  {
    number: "04",
    name: "Catering Services",
    description: "Make your celebration memorable with delicious food.",
    icon: Utensils,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=85",
  },
  {
    number: "05",
    name: "Makeup & Styling",
    description: "Find the perfect look for your once-in-a-lifetime day.",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=85",
  },
  {
    number: "06",
    name: "Wedding Fashion",
    description: "Explore elegant outfits for your special celebration.",
    icon: Shirt,
    image:
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=900&q=85",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

export default function WeddingCategories() {
  return (
    <section
      className="bg-[#F8F5EE] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      id="categories"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center sm:mb-14"
        >
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#A47C55]">
            Find Your Perfect Match
          </span>

          <h2 className="font-playfair text-3xl font-semibold text-[#174C3C] sm:text-4xl lg:text-5xl">
            Explore Wedding Categories
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6B746E] sm:text-base">
            From breathtaking venues to beautiful details, discover
            everything you need to make your dream wedding come true.
          </p>
        </motion.div>

        {/* Category Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
        >
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.name}
                variants={cardVariants}
                whileHover={{ y: -7 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Link
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174C3C]"
                >
                  <Card className="h-full overflow-hidden rounded-2xl border border-[#E8E1D5] bg-white p-0 shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
                    {/* Image */}
                    <div
                      className="relative h-52 overflow-hidden bg-cover bg-center sm:h-56"
                      style={{
                        backgroundImage: `url("${category.image}")`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#102A21]/65 via-transparent to-black/10 transition-colors duration-300 group-hover:from-[#102A21]/45" />

                      

                      <div className="absolute bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white backdrop-blur-md">
                        <Icon size={22} strokeWidth={1.7} />
                      </div>

                      <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#174C3C] transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-5 sm:p-6">
                      <h3 className="font-playfair text-xl font-semibold leading-snug text-[#174C3C] transition-colors duration-300 group-hover:text-[#A47C55] sm:text-2xl">
                        {category.name}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-[#747C76]">
                        {category.description}
                      </p>

                      <div className="mt-5 h-px w-full bg-[#EEE9DF]" />

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A47C55]">
                          Explore Category
                        </span>

                        <ArrowUpRight
                          size={17}
                          className="text-[#174C3C] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
