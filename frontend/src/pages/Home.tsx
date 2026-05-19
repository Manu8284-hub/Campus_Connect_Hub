import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import FeaturedClubs from '@/components/sections/FeaturedClubs';
import TrendingEvents from '@/components/sections/TrendingEvents';
import Features from '@/components/sections/Features';
import DashboardPreview from '@/components/sections/DashboardPreview';
import Testimonials from '@/components/sections/Testimonials';
import FAQ from '@/components/sections/FAQ';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <Hero />
        <Stats />
        <FeaturedClubs />
        <TrendingEvents />
        <Features />
        <DashboardPreview />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
