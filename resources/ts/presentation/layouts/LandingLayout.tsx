import { Button } from "@/ts/components/ui/button";
import { LocaleToggle } from "@/ts/components/ui/locale-toggle";
import { ThemeToggle } from "@/ts/components/ui/theme-toggle";
import { TooltipProvider } from "@/ts/components/ui/tooltip";
import type { RootProps } from "@/ts/presentation/layouts/AppShell";
import { useTranslation } from "@/ts/presentation/i18n/useTranslation";
import { cn } from "@/ts/utils";
import { Link } from "@inertiajs/react";
import { useEffect, useState, type ReactNode } from "react";
import { useRoute } from "ziggy-js";

type Props = RootProps & {
  children: ReactNode;
};

const PORTFOLIO_URL = "https://nvnhan0810.com";

const LandingLayout = ({ auth, children }: Props): React.ReactElement => {
  const { t } = useTranslation();
  const route = useRoute();
  const [scrolled, setScrolled] = useState(false);
  const isAuthenticated = auth !== null;

  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: t("landing.nav.problem"), href: "#problem" },
    { label: t("landing.nav.solution"), href: "#solution" },
    { label: t("landing.nav.why"), href: "#why" },
    { label: t("landing.nav.pwa"), href: "#pwa" },
    { label: t("landing.nav.contact"), href: "#cta" },
  ];

  return (
    <TooltipProvider delayDuration={250}>
      <div className="min-h-dvh bg-background text-foreground">
        <header
          className={cn(
            "sticky top-0 z-40 border-b transition-colors duration-200",
            scrolled
              ? "border-border bg-background/90 shadow-sm backdrop-blur-md"
              : "border-transparent bg-transparent",
          )}
        >
          <div className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
            <Link href={route("home")} className="flex min-w-0 items-center gap-3">
              <img
                src="/images/android-chrome-192x192.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-lg"
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-tight">Todo</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {t("landing.brand_subtitle")}
                </span>
              </span>
            </Link>

            <nav className="ml-auto hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:ml-4">
              <LocaleToggle />
              <ThemeToggle />
              {isAuthenticated ? (
                <Button asChild size="sm" className="cursor-pointer">
                  <Link href={route("matrix.index")}>{t("landing.go_to_app")}</Link>
                </Button>
              ) : (
                <Button asChild size="sm" variant="outline" className="cursor-pointer">
                  <Link href={route("login")}>{t("landing.login")}</Link>
                </Button>
              )}
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-border bg-muted/40">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <img
                src="/images/android-chrome-192x192.png"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-lg"
              />
              <div>
                <div className="text-sm font-semibold">Todo</div>
                <div className="text-xs text-muted-foreground">todo.nvnhan0810.com</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground sm:text-right">
              <p>{t("landing.footer_tagline")}</p>
              <p className="mt-1 text-xs">
                © {new Date().getFullYear()}{" "}
                <a
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline-offset-4 transition-colors hover:text-teal-700 hover:underline dark:hover:text-teal-300"
                >
                  {t("landing.footer_portfolio")}
                </a>
                . {t("landing.footer_rights")}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default LandingLayout;
