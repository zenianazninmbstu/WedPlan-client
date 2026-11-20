
import Link from "next/link";
import {
  Users,
  Store,
  UserRound,
  BriefcaseBusiness,
  Clock,
  Receipt,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    title: "Total Registered Users",
    value: "—",
    icon: Users,
  },
  {
    title: "Total Vendors",
    value: "—",
    icon: Store,
  },
  {
    title: "Total Customers",
    value: "—",
    icon: UserRound,
  },
  {
    title: "Total Services",
    value: "—",
    icon: BriefcaseBusiness,
  },
  {
    title: "Pending Services",
    value: "—",
    icon: Clock,
  },
  {
    title: "Total Transactions",
    value: "—",
    icon: Receipt,
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-7">
      {/* Statistics Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#E8E1D5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#718078]">
                  {stat.title}
                </p>

                <div className="rounded-xl bg-[#E5EFE8] p-3">
                  <Icon size={21} className="text-[#174C3C]" />
                </div>
              </div>

              <h2 className="mt-5 text-3xl font-bold text-[#174C3C]">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </section>

      {/* Revenue and Quick Moderation */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Revenue Card */}
        <div className="flex flex-col rounded-2xl border border-[#E8E1D5] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E5EFE8] p-3">
              <DollarSign size={22} className="text-[#174C3C]" />
            </div>

            <div>
              <h2 className="font-playfair text-lg font-bold text-[#174C3C]">
                Verified Subscription Revenue
              </h2>
              <p className="mt-1 text-xs text-[#718078]">
                Platform subscription earnings
              </p>
            </div>
          </div>

          <div className="my-6">
            <p className="text-4xl font-bold text-[#174C3C]">
              $—
            </p>

            <div className="mt-3 flex items-start gap-2">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#39845D]" />
              <p className="text-xs leading-5 text-[#718078]">
                Calculated strictly from Stripe web-verified completed
                transactions.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/transactions"
            className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-[#174C3C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#103A2E]"
          >
            View Transactions
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Quick Moderation Card */}
        <div className="flex flex-col rounded-2xl border border-[#E8E1D5] bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-playfair text-lg font-bold text-[#174C3C]">
              Quick Moderation
            </h2>

            <p className="mt-1 text-sm text-[#718078]">
              Quickly access important admin tasks.
            </p>
          </div>

          <div className="mt-6 flex flex-1 flex-col justify-center gap-4">
            <Link
              href="/dashboard/admin/services"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#174C3C] px-5 py-3 text-sm font-semibold text-[#174C3C] transition hover:bg-[#E5EFE8]"
            >
              <BriefcaseBusiness size={18} />
              Review Pending Services
            </Link>

            <Link
              href="/dashboard/admin/users"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#174C3C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#103A2E]"
            >
              <Users size={18} />
              Manage Users
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
