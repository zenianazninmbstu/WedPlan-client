import {
  Camera,
  Building2,
  Flower2,
  Utensils,
  Sparkles,
  Shirt,
} from "lucide-react";

import Link from "next/link";


const categories = [
  {
    name: "Photography & Videography",
    description: "Capture every beautiful moment.",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85",
  },
  {
    name: "Wedding Venues",
    description: "Find the perfect place to celebrate.",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=85",
  },
  {
    name: "Decoration & Florist",
    description: "Create a magical wedding atmosphere.",
    icon: Flower2,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=85",
  },
  {
    name: "Catering Services",
    description: "Delight your guests with great food.",
    icon: Utensils,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=85",
  },
  {
    name: "Makeup & Styling",
    description: "Look and feel your absolute best.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=85",
  },
  {
    name: "Wedding Fashion",
    description: "Discover your perfect wedding look.",
    icon: Shirt,
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=85",
  },
];



export default function WeddingCategories() {
  return (
    <section className="bg-[#F8F5EE] px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#174C3C]">
            Explore Our Categories
          </p>

          <h2 className="text-3xl font-bold text-[#174C3C] sm:text-4xl">
            Everything You Need for Your Special Day
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            Discover the perfect wedding services and trusted professionals
            to bring your dream celebration to life.
          </p>


<div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
  {categories.map((category) => {
    const Icon = category.icon;

    return (
      <Link
        key={category.name}
        href={`/services?category=${encodeURIComponent(category.name)}`}
        className="group rounded-2xl border border-[#174C3C]/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#174C3C]/30 hover:shadow-lg"
      >
       
<div className="relative mb-6 h-48 overflow-hidden rounded-xl">
  <img
    src={category.image}
    alt={category.name}
    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
  />

  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1C15]/50 to-transparent" />

  <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#174C3C] shadow-md">
    <Icon size={22} strokeWidth={1.7} />
  </div>
</div>

        <h3 className="mt-6 text-lg font-semibold text-[#174C3C]">
          {category.name}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {category.description}
        </p>

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#174C3C]">
          Explore Services
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    );
  })}
</div>

        </div>
      </div>
    </section>
  );
}
