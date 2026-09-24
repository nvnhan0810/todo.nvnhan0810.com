import { router } from "@inertiajs/react";
import ReactGA from "react-ga4";

let installed = false;

/**
 * Initialize GA4 once (production only — caller passes null otherwise)
 * and track every Inertia navigation as a pageview.
 */
export const setupGoogleAnalytics = (
  measurementId: string | null | undefined,
): void => {
  if (
    installed ||
    typeof window === "undefined" ||
    typeof measurementId !== "string" ||
    measurementId === ""
  ) {
    return;
  }

  installed = true;
  ReactGA.initialize(measurementId);

  const trackPageView = (url: string): void => {
    ReactGA.send({
      hitType: "pageview",
      page: url,
      title: document.title,
    });
  };

  let currentUrl = `${window.location.pathname}${window.location.search}`;
  trackPageView(currentUrl);

  router.on("success", (event) => {
    const nextUrl = event.detail.page.url;
    if (nextUrl === currentUrl) {
      return;
    }
    currentUrl = nextUrl;
    trackPageView(nextUrl);
  });
};
