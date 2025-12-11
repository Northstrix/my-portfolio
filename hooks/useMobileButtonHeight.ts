import { useEffect, useState } from "react";

export default function useMobileButtonHeight() {
  const [isMobileHeight, setIsMobileHeight] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    function handleResize() {
      setIsMobileHeight(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobileHeight;
}
