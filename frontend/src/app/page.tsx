import { Header } from "@/features/landing/Header";
import { HeroSection } from "@/features/landing/HeroSection";
import { Footer } from "@/features/landing/Footer";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
}
