
import WeddingCategories from "@/components/home/WeddingCategories";
import WhyChooseWedPlan from "@/components/home/WhyChooseWedPlan";
import HowWedPlanWorks from "@/components/home/HowWedPlanWorks";
import FeaturedWeddingServices from "@/components/home/FeaturedWeddingServices";

export default function Home() {
  return (
    <main className="flex-1">
      <FeaturedWeddingServices />
      <WeddingCategories />
      <WhyChooseWedPlan />
      <HowWedPlanWorks />
    </main>
  );
}
