
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  CreditCard,
  Settings,
} from "lucide-react";

const adminLinks = [
  {
    name: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    description: "Monitor your platform activity, users, services, and revenue.",
  },
  {
    name: "Manage Users",
    href: "/dashboard/admin/users",
    icon: Users,
    description: "View and manage all registered vendors and customers.",
  },
  {
    name: "Manage Services",
    href: "/dashboard/admin/manage-services",
    icon: BriefcaseBusiness,
    description: "Review, approve, and manage platform services.",
  },
  {
    name: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: CreditCard,
    description: "Track verified payments and subscription transactions.",
  },
  {
    name: "Profile Settings",
    href: "/dashboard/admin/profile",
    icon: Settings,
    description: "Manage your administrator profile information.",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const currentPage =
    adminLinks.find((link) =>
      link.href === "/dashboard/admin"
        ? pathname === link.href
        : pathname.startsWith(link.href)
    ) || adminLinks[0];

  return (
    <div className="min-h-screen bg-[#F8F5EE]">
      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar */}
        <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[#E8E1D5] bg-white p-5 md:block lg:p-6">
          <h2 className="mb-8 font-playfair text-xl font-bold text-[#174C3C]">
            Admin Dashboard
          </h2>

          <nav className="space-y-2">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const active =
                link.href === "/dashboard/admin"
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
              Admin Dashboard
            </h2>

            <nav className="flex gap-2 overflow-x-auto pb-2">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const active =
                  link.href === "/dashboard/admin"
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
            {/* Dynamic Page Heading */}
            <div className="mb-8">
              <h1 className="font-playfair text-2xl font-bold text-[#174C3C] sm:text-3xl">
                Admin Dashboard / {currentPage.name}
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#718078]">
                {currentPage.description}
              </p>
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
