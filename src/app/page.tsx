
import WeddingCategories from "@/components/home/WeddingCategories";
import WhyChooseWedPlan from "@/components/home/WhyChooseWedPlan";
import HowWedPlanWorks from "@/components/home/HowWedPlanWorks";

export default function Home() {
  return (
    <main className="flex-1">
      <WeddingCategories />
      <WhyChooseWedPlan />
      <HowWedPlanWorks />
    </main>
  );
}
