"use client";

import { HeroSection } from "@/components/features/landing/hero-section";
import { FeaturesSection } from "@/components/features/landing/features-section";
import { FormatsSection } from "@/components/features/landing/formats-section";
import { HowItWorksSection } from "@/components/features/landing/how-it-works";
import { PricingSection } from "@/components/features/landing/pricing-section";
import { TestimonialsSection } from "@/components/features/landing/testimonials-section";
import { FaqSection } from "@/components/features/landing/faq-section";
import { CtaSection } from "@/components/features/landing/cta-section";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <FormatsSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
