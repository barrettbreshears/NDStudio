import Navbar from "@/components/Navbar";
import HeroFood from "@/components/HeroFood";
import Statistics from "@/components/Statistics";
import MissionText from "@/components/MissionText";
import PyramidSection from "@/components/PyramidSection";
import ClosingText from "@/components/ClosingText";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroFood />
        <Statistics />
        <MissionText />
        <PyramidSection />
        <ClosingText />
      </main>
    </>
  );
}
