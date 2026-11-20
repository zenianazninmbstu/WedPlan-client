
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  PlusCircle,
  CalendarDays,
  CreditCard,
  Settings,
} from "lucide-react";

const vendorLinks = [
  {
    name: "Overview",
    href: "/dashboard/vendor",
    icon: LayoutDashboard,
  },
  {
    name: "My Services",
    href: "/dashboard/vendor/services",
    icon: BriefcaseBusiness,
  },
  {
    name: "Add Service",
    href: "/dashboard/vendor/add-service",
    icon: PlusCircle,
  },
  {
    name: "Booking Requests",
    href: "/dashboard/vendor/bookings",
    icon: CalendarDays,
  },
  {
    name: "Subscription",
    href: "/dashboard/vendor/subscription",
    icon: CreditCard,
  },
  {
    name: "Profile Settings",
    href: "/dashboard/vendor/profile",
    icon: Settings,
  },
];

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F8F5EE]">
      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar */}
        <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[#E8E1D5] bg-white p-5 md:block lg:p-6">
          <h2 className="mb-8 font-playfair text-xl font-bold text-[#174C3C]">
            Vendor Dashboard
          </h2>

          <nav className="space-y-2">
            {vendorLinks.map((link) => {
              const Icon = link.icon;
              const active =
                link.href === "/dashboard/vendor"
                  ? pathname === link.href
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#174C3C] text-white shadow-sm"
                      : "text-[#59665E] hover:bg-[#E5EFE8] hover:text-[#174C3C]"
                  }`}
                >
                  <Icon size={19} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <div className="min-w-0 flex-1">
          <div className="border-b border-[#E8E1D5] bg-white p-4 md:hidden">
            <h2 className="mb-4 font-playfair text-xl font-bold text-[#174C3C]">
              Vendor Dashboard
            </h2>

            <nav className="flex gap-2 overflow-x-auto pb-2">
              {vendorLinks.map((link) => {
                const Icon = link.icon;
                const active =
                  link.href === "/dashboard/vendor"
                    ? pathname === link.href
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                      active
                        ? "bg-[#174C3C] text-white"
                        : "bg-[#F3F4F0] text-[#59665E]"
                    }`}
                  >
                    <Icon size={16} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Page Content */}
          <main className="min-w-0 p-4 sm:p-6 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
