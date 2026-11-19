import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const RouteRobots = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = pathname.replace(/\/$/, "") === "/tech-dashboard" ? "noindex, nofollow" : "index, follow";
  }, [pathname]);

  return null;
};