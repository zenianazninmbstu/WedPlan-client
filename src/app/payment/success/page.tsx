
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#F8F5EE] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#D9E5DC] bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={44} />
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#A47C55]">
          WedPlan Premium
        </p>

        <h1 className="mt-3 font-playfair text-3xl font-semibold text-[#174C3C]">
          Payment Successful!
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#6B746E]">
          Thank you for upgrading to WedPlan Premium.
          Your subscription is being confirmed.
        </p>

        <Link
          href="/dashboard/vendor"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#174C3C] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#10392D]"
        >
          Go to Dashboard
          <ArrowRight size={17} />
        </Link>
      </div>
    </main>
  );
}
