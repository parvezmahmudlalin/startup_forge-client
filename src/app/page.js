
import FeaturedStartups from "@/components/homepage/FeaturedStartups";
import HeroBanner from "../components/homepage/HeroBanner";
import FeaturedOpportunities from "@/components/homepage/FeaturedOpportunities";
import WhyJoinUs from "@/components/homepage/WhyJoinUs";
import StartupStats from "@/components/homepage/StartUpStats";
export default function Home() {
  return (
   <div>
    <HeroBanner/>
    <FeaturedStartups/>
    <FeaturedOpportunities/>
    <WhyJoinUs/>
    <StartupStats/>
   </div>
  );
}
