import { FeaturesSection } from "@/features/landing/FeaturesSection";
import { Footer } from "@/features/landing/Footer";
import { Header } from "@/features/landing/Header";
import { HeroSection } from "@/features/landing/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
