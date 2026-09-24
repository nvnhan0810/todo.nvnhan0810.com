import { Button } from "@/ts/components/ui/button";
import { LocaleToggle } from "@/ts/components/ui/locale-toggle";
import { ThemeToggle } from "@/ts/components/ui/theme-toggle";
import { TooltipProvider } from "@/ts/components/ui/tooltip";
import { useTranslation } from "@/ts/presentation/i18n/useTranslation";
import { useRoute } from "ziggy-js";

type Props = {
  flash?: {
    error?: string | null;
    success?: string | null;
  };
};

const LoginPage = ({ flash }: Props): React.ReactElement => {
  const { t } = useTranslation();
  const route = useRoute();

  return (
    <TooltipProvider delayDuration={250}>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(215_20%_70%_/_0.35),_transparent_55%),radial-gradient(ellipse_at_bottom,_hsl(210_15%_55%_/_0.2),_transparent_50%)]"
        />
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
        </div>
        <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Todo</h1>
            <p className="text-sm text-muted-foreground">{t("auth.tagline")}</p>
          </div>

          {flash?.error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {flash.error}
            </p>
          ) : null}
          {flash?.success ? (
            <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              {flash.success}
            </p>
          ) : null}

          <div className="flex flex-col gap-3">
            <Button asChild variant="outline" className="w-full" size="lg">
              <a href={route("auth.google")}>{t("auth.continue_google")}</a>
            </Button>
            <Button asChild className="w-full" size="lg">
              <a href={route("auth.sso")}>{t("auth.continue_sso")}</a>
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LoginPage;
