import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const useAnalytics = () => {
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  // Fire custom events
  const logEvent = (
    eventName: string,
    eventParams?: Record<string, any>
  ): void => {
    if (window.gtag) {
      window.gtag("event", eventName, eventParams || {});
    }
  };

  return { logEvent };
};
