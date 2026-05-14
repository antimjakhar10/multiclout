import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomePage from "../../pages/HomePage";

const MOBILE_BREAKPOINT = 768;

function MobileHomeRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobileNow = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobileNow);

      if (mobileNow && location.pathname === "/") {
        navigate("/watch-videos", { replace: true });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [navigate, location.pathname]);

  if (isMobile) {
    return null;
  }

  return <HomePage />;
}

export default MobileHomeRedirect;