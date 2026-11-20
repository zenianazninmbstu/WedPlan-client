
import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#F8F5EE] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#E8E1D5] bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <XCircle size={44} />
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#A47C55]">
          WedPlan Subscription
        </p>

        <h1 className="mt-3 font-playfair text-3xl font-semibold text-[#174C3C]">
          Payment Cancelled
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#6B746E]">
          Your payment was not completed. No subscription
          upgrade has been made. You can try again whenever
          you are ready.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard/vendor/subscription"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#174C3C] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#10392D]"
          >
            <ArrowLeft size={17} />
            Back to Subscription
          </Link>
        </div>
      </div>
    </main>
  );
}
