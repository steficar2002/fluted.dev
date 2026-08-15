import { CaseStudies } from "@/components/case-studies";
import { Contact } from "@/components/contact";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Method } from "@/components/method";
import { Nav } from "@/components/nav";
import { SocialProofBanner } from "@/components/social-proof-banner";
import { StickyCta } from "@/components/sticky-cta";
import { Testimonials } from "@/components/testimonials";
import { WhatWeDo } from "@/components/what-we-do";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1 pb-24">
        <Hero />
        <WhatWeDo />
        <CaseStudies />
        <Testimonials />
        <Method />
        <div className="flex flex-col md:min-h-[100svh] md:snap-start">
          <Contact />
        </div>
        <SocialProofBanner />
        <div className="flex flex-col md:min-h-[100svh] md:snap-start">
          <Faq />
          <Footer />
        </div>
      </main>
      <StickyCta />
    </>
  );
}
