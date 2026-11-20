
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Settings,
} from "lucide-react";

const customerLinks = [
  {
    name: "Overview",
    href: "/dashboard/customer",
    icon: LayoutDashboard,
  },
  {
    name: "My Bookings",
    href: "/dashboard/customer/bookings",
    icon: CalendarCheck,
  },
  {
    name: "Profile Settings",
    href: "/dashboard/customer/profile",
    icon: Settings,
  },
];

export default function CustomerLayout({
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
            Customer Dashboard
          </h2>

          <nav className="space-y-2">
            {customerLinks.map((link) => {
              const Icon = link.icon;
              const active =
                link.href === "/dashboard/customer"
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

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Mobile Navigation */}
          <div className="border-b border-[#E8E1D5] bg-white p-4 md:hidden">
            <h2 className="mb-4 font-playfair text-xl font-bold text-[#174C3C]">
              Customer Dashboard
            </h2>

            <nav className="flex gap-2 overflow-x-auto pb-2">
              {customerLinks.map((link) => {
                const Icon = link.icon;
                const active =
                  link.href === "/dashboard/customer"
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

          <main className="min-w-0 p-4 sm:p-6 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
