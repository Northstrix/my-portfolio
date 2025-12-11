import * as React from "react";

const MIN_WIDTH = 1280;
const MIN_HEIGHT = 800;
const MAX_HEIGHT = 1440;

export function useIsShow2ColumnHero() {
  const [show2ColumnHero, setShow2ColumnHero] = React.useState(false);

  React.useEffect(() => {
    function checkWindowSize() {
      if (typeof window === "undefined") return;

      const { innerWidth, innerHeight } = window;
      const isWidthOk = innerWidth >= MIN_WIDTH;
      const isHeightOk = innerHeight >= MIN_HEIGHT && innerHeight <= MAX_HEIGHT;

      setShow2ColumnHero(isWidthOk && isHeightOk);
    }

    // Initial check
    checkWindowSize();

    // Resize listener
    window.addEventListener("resize", checkWindowSize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", checkWindowSize);
    };
  }, []);

  return show2ColumnHero;
}
