import * as React from "react";

const DESKTOP_WIDTH = 1280;
const DESKTOP_HEIGHT = 800;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    function checkIsMobile() {
      if (typeof window === "undefined") return;
      const { innerWidth, innerHeight } = window;
      const isDesktop = innerWidth >= DESKTOP_WIDTH && innerHeight >= DESKTOP_HEIGHT;
      setIsMobile(!isDesktop);
    }

    // Initial check
    checkIsMobile();

    // Resize listener
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return isMobile;
}
