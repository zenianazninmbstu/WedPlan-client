"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Heart,
  ShieldCheck,
  Lightbulb,
  Globe,
} from "lucide-react";




type SocialName = "Facebook" | "Instagram" | "Pinterest" | "YouTube";

function SocialIcon({ name }: { name: SocialName }) {
  const common = "h-5 w-5";

  if (name === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="currentColor">
        <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4z" />
      </svg>
    );
  }

  if (name === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "Pinterest") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="currentColor">
        <path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.8.2-2.6l1.3-5.5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.8 0 1.2.6 1.2 1.4 0 .9-.6 2.2-.9 3.4-.3 1 .5 1.8 1.5 1.8 1.8 0 3.1-2.3 3.1-5 0-2.1-1.4-3.7-3.9-3.7-2.8 0-4.6 2.1-4.6 4.5 0 .8.2 1.4.6 1.9.2.2.2.3.1.6l-.2.8c-.1.3-.3.4-.6.3-1.3-.5-1.9-1.8-1.9-3.3 0-2.5 2.1-5.5 6.3-5.5 3.4 0 5.7 2.5 5.7 5.2 0 3.6-2 6.3-5 6.3-1 0-2-.6-2.3-1.2l-.7 2.7c-.2.8-.7 1.7-1.1 2.4A10 10 0 1 0 12 2z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" />
    </svg>
  );
}



const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
];

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const socialLinks: { name: SocialName; href: string }[] = [
  { name: "Facebook", href: "https://www.facebook.com/" },
  { name: "Instagram", href: "https://www.instagram.com/" },
  { name: "Pinterest", href: "https://www.pinterest.com/" },
  { name: "YouTube", href: "https://www.youtube.com/" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[#174C3C] text-[#F8F5EE]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/wedplan-logo.png"
                alt="WedPlan"
                width={180}
                height={70}
                className="h-auto w-[145px] object-contain"
              />
            </Link>

            <p className="max-w-xs text-sm leading-7 text-white/75">
              Making your dream wedding effortless. Discover trusted
              professionals and bring every beautiful detail of your
              special day together with WedPlan.
            </p>

            <div className="flex items-center gap-2 text-sm text-white/80">
              <Heart size={16} className="text-[#E8C9A8]" />
              <span>Made for your forever moments.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition-colors duration-200 hover:translate-x-1 hover:text-white hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-white">
              Wedding Services
            </h3>

            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href="/services"
                    className="text-sm text-white/75 transition-colors duration-200 hover:text-white hover:underline"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-white">
              Get in Touch
            </h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-[#E8C9A8]" />
                <a
                  href="mailto:hello@example.com"
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  hello@example.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-[#E8C9A8]" />
                <span className="text-sm text-white/75">
                  Contact number coming soon
                </span>
              </li>

              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#E8C9A8]" />
                <span className="text-sm text-white/75">
                  Bangladesh
                </span>
              </li>
            </ul>

            <div className="mt-7">
              <h4 className="mb-4 text-sm font-semibold text-white">
                Follow WedPlan
              </h4>

              <div className="flex items-center gap-3">
  {socialLinks.map(({ name, href }) => (
    <a
      key={name}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      title={name}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-all duration-200 hover:-translate-y-1 hover:border-[#E8C9A8] hover:bg-[#E8C9A8] hover:text-[#174C3C]"
    >
      <SocialIcon name={name} />
    </a>
  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust and Inspiration */}
        <div className="mt-12 grid grid-cols-1 gap-4 border-t border-white/15 pt-8 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="shrink-0 text-[#E8C9A8]" size={21} />
            <div>
              <p className="text-sm font-semibold text-white">
                Trusted Vendors
              </p>
              <p className="text-xs text-white/60">
                Find approved wedding professionals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Heart className="shrink-0 text-[#E8C9A8]" size={21} />
            <div>
              <p className="text-sm font-semibold text-white">
                Easy Planning
              </p>
              <p className="text-xs text-white/60">
                Organize your wedding in one place.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Lightbulb className="shrink-0 text-[#E8C9A8]" size={21} />
            <div>
              <p className="text-sm font-semibold text-white">
                Wedding Inspiration
              </p>
              <p className="text-xs text-white/60">
                Discover ideas for your special day.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/65">
            © {currentYear} WedPlan. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-xs text-white/65">
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-[#E8C9A8]"
          >
            Back to top
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
