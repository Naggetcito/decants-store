import { BestSellers } from "@/components/home/BestSellers";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { Catalog } from "@/components/home/Catalog";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Reviews } from "@/components/home/Reviews";
import { SizeComparison } from "@/components/home/SizeComparison";
import { TrustBar } from "@/components/home/TrustBar";

export default function Home() {
  return (
    <main id="contenido">
      <Hero />
      <TrustBar />
      <BrandMarquee />
      <HowItWorks />
      <Catalog />
      <BestSellers />
      <SizeComparison />
      <Reviews />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
