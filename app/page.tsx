import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import BenefitsSection from "@/components/landing/BenifitsSection";




export default function Home() {
  return (
    <>
      <main>
        <Navbar />
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorks />
        <BenefitsSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
