import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const HashScroll = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const scroll = () => {
      const element = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!element) return false;
      element.scrollIntoView({ block: "start", behavior: "instant" });
      return true;
    };
    // On direct links React mounts after the browser's initial anchor lookup.
    const timer = window.setInterval(() => {
      if (scroll()) window.clearInterval(timer);
    }, 100);
    const timeout = window.setTimeout(() => window.clearInterval(timer), 5000);
    return () => { window.clearInterval(timer); window.clearTimeout(timeout); };
  }, [pathname, hash]);
  return null;
};