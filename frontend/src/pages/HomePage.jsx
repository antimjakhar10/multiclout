import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CoursesSection from "../components/CoursesSection";
import ReelsSection from "../components/ReelsSection";
import GurusSection from "../components/GurusSection";
import ReasonsSection from "../components/ReasonsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import StatsSection from "../components/StatsSection";
import DownloadAppSection from "../components/DownloadAppSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#07111a]">
      <Navbar />
      <HeroSection />
      <CoursesSection />
      <ReelsSection />

      
        <GurusSection />
        <ReasonsSection />
        <TestimonialsSection />
        <StatsSection />
        <DownloadAppSection />
        <FAQSection />
        <Footer />

    </div>
  );
}

export default HomePage;