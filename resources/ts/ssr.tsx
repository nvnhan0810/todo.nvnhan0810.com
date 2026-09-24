import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
import { ThemeProvider } from "@/ts/providers/theme-provider";
import { Ziggy } from "@/ts/utils/ziggy";

(
  globalThis as typeof globalThis & {
    Ziggy?: typeof Ziggy;
  }
).Ziggy = Ziggy;

type PageModule = { default: React.ComponentType };

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob<PageModule>("./presentation/pages/**/*.tsx", {
        eager: true,
      });
      const key = `./${name}.tsx`;
      const pageModule = pages[key];
      if (!pageModule) {
        throw new Error(`Page not found: ${name} (looked for ${key})`);
      }
      return pageModule;
    },
    setup({ App, props }) {
      return (
        <ThemeProvider defaultTheme="system">
          <App {...props} />
        </ThemeProvider>
      );
    },
  }),
);
