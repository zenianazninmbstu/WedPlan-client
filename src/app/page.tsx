
import WeddingCategories from "@/components/home/WeddingCategories";
import WhyChooseWedPlan from "@/components/home/WhyChooseWedPlan";
import HowWedPlanWorks from "@/components/home/HowWedPlanWorks";
import FeaturedWeddingServices from "@/components/home/FeaturedWeddingServices";
import HeroBanner from "@/components/home/HeroBanner";

export default function Home() {
  return (
    <main className="flex-1">
       <HeroBanner />
      <FeaturedWeddingServices />
      <WeddingCategories />
      <WhyChooseWedPlan />
      <HowWedPlanWorks />
    </main>
  );
}
