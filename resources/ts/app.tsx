import { createInertiaApp } from "@inertiajs/react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { setupGoogleAnalytics } from "@/ts/infrastructure/googleAnalytics";
import { ThemeProvider } from "@/ts/providers/theme-provider";

type PageModule = { default: React.ComponentType };

type InitialSharedProps = {
  googleAnalyticsId?: string | null;
};

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob<PageModule>("./presentation/pages/**/*.tsx", {
      eager: true,
    });
    const key = `./${name}.tsx`;
    const page = pages[key];
    if (!page) {
      throw new Error(`Page not found: ${name} (looked for ${key})`);
    }
    return page;
  },
  setup({ el, App, props }) {
    const shared = props.initialPage.props as InitialSharedProps;
    setupGoogleAnalytics(shared.googleAnalyticsId);

    const appNode = (
      <ThemeProvider defaultTheme="system">
        <App {...props} />
      </ThemeProvider>
    );

    if (el.hasChildNodes()) {
      hydrateRoot(el, appNode);
      return;
    }

    createRoot(el).render(appNode);
  },
});
