
import FeaturedStartups from "@/components/homepage/FeaturedStartups";
import HeroBanner from "../components/homepage/HeroBanner";
import FeaturedOpportunities from "@/components/homepage/FeaturedOpportunities";
export default function Home() {
  return (
   <div>
    <HeroBanner/>
    <FeaturedStartups/>
    <FeaturedOpportunities/>
   </div>
  );
}
