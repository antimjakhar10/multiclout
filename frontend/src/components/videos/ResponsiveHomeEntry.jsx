import { useEffect, useState } from "react";
import HomePage from "../../pages/HomePage";
import WatchVideos from "../../pages/WatchVideos";
import { applyMobileTheme, getMobileTheme } from "../../utils/mobileTheme";

const MOBILE_BREAKPOINT = 768;

function ResponsiveHomeEntry() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
  applyMobileTheme(getMobileTheme());
}, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handleChange = (e) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return isMobile ? <WatchVideos /> : <HomePage />;
}

export default ResponsiveHomeEntry;