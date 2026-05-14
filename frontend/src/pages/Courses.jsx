import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CoursesSection from "../components/CoursesSection";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import useIsMobileView from "../hooks/useIsMobileView";


function Courses() {
  const isMobile = useIsMobileView();

  return (
    <>
      <Navbar />

      <main
        className="min-h-screen pb-20 md:pb-0"
        style={{
          background: isMobile ? "var(--mc-bg-main)" : "#ffffff",
          color: isMobile ? "var(--mc-text-main)" : "#0f172a",
        }}
      >
        <CoursesSection />
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>

      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </>
  );
}

export default Courses;