import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import HeroButtonsSection from "../components/HeroButtonsSection";
import CoursesSection from "../components/CoursesSection";
import ReelsSection from "../components/ReelsSection";
import GurusSection from "../components/GurusSection";
import ReasonsSection from "../components/ReasonsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import DownloadAppSection from "../components/DownloadAppSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTarget = params.get("scroll");

    if (scrollTarget === "faq") {
      setTimeout(() => {
        const faqSection = document.getElementById("faq");
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <HeroSection />
      <HeroButtonsSection />
      <CoursesSection />
      <ReelsSection />
      <ReasonsSection />
      <GurusSection />
      <TestimonialsSection />
      <DownloadAppSection />

      <section id="faq">
        <FAQSection />
      </section>
      <Footer/>
    </>
  );
}

export default HomePage;