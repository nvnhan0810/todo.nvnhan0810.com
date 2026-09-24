import { Button } from "@/ts/components/ui/button";
import type { RootProps } from "@/ts/presentation/layouts/AppShell";
import LandingLayout from "@/ts/presentation/layouts/LandingLayout";
import { useTranslation } from "@/ts/presentation/i18n/useTranslation";
import { Link } from "@inertiajs/react";
import {
  ArrowRight,
  Focus,
  LayoutGrid,
  Link2Off,
  MonitorSmartphone,
  PanelsTopLeft,
  Play,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { useRoute } from "ziggy-js";

type Props = RootProps;

const LandingPage = ({ auth }: Props): React.ReactElement => {
  const { t } = useTranslation();
  const route = useRoute();
  const isAuthenticated = auth !== null;

  const problems = [
    {
      icon: PanelsTopLeft,
      title: t("landing.problem.item1_title"),
      description: t("landing.problem.item1_desc"),
    },
    {
      icon: Focus,
      title: t("landing.problem.item2_title"),
      description: t("landing.problem.item2_desc"),
    },
    {
      icon: Link2Off,
      title: t("landing.problem.item3_title"),
      description: t("landing.problem.item3_desc"),
    },
  ];

  const solutions = [
    {
      icon: LayoutGrid,
      title: t("landing.solution.matrix_title"),
      description: t("landing.solution.matrix_desc"),
      accent: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    },
    {
      icon: Play,
      title: t("landing.solution.pomodoro_title"),
      description: t("landing.solution.pomodoro_desc"),
      accent: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
    },
    {
      icon: Sparkles,
      title: t("landing.solution.deepwork_title"),
      description: t("landing.solution.deepwork_desc"),
      accent: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: t("landing.why.item1_title"),
      description: t("landing.why.item1_desc"),
    },
    {
      icon: Timer,
      title: t("landing.why.item2_title"),
      description: t("landing.why.item2_desc"),
    },
    {
      icon: MonitorSmartphone,
      title: t("landing.why.item3_title"),
      description: t("landing.why.item3_desc"),
    },
  ];

  const primaryCta = isAuthenticated ? (
    <Button asChild size="lg" className="cursor-pointer gap-2 px-6">
      <Link href={route("matrix.index")}>
        {t("landing.go_to_app")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  ) : (
    <Button asChild size="lg" className="cursor-pointer gap-2 px-6">
      <Link href={route("login")}>
        {t("landing.cta_primary")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );

  const finalCta = isAuthenticated ? (
    <Button asChild size="lg" variant="secondary" className="cursor-pointer gap-2 px-8">
      <Link href={route("matrix.index")}>
        {t("landing.go_to_app")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  ) : (
    <Button asChild size="lg" variant="secondary" className="cursor-pointer gap-2 px-8">
      <Link href={route("login")}>
        {t("landing.cta_final")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );

  return (
    <LandingLayout auth={auth}>
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(173_40%_50%_/_0.16),_transparent_42%),radial-gradient(circle_at_bottom_left,_hsl(12_50%_55%_/_0.12),_transparent_45%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--muted)/0.55)_100%)]"
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-12 md:items-center md:py-24">
          <div className="md:col-span-7">
            <p className="mb-4 inline-flex rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t("landing.chip")}
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl md:text-[3.15rem] md:leading-[1.15]">
              {t("landing.hero_title")}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("landing.hero_subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">{primaryCta}</div>
            <p className="mt-4 text-sm text-muted-foreground">{t("landing.hero_promise")}</p>
          </div>

          <div className="hidden md:col-span-5 md:flex md:justify-center">
            <div className="relative flex h-64 w-64 items-center justify-center lg:h-72 lg:w-72">
              <div className="absolute inset-0 animate-[pulse_4s_ease-in-out_infinite] rounded-full border-2 border-teal-500/20" />
              <div className="absolute inset-[14%] rounded-full border-2 border-rose-500/25" />
              <div className="relative grid w-full max-w-[15rem] gap-2 rounded-2xl border border-border bg-card/90 p-3 shadow-sm backdrop-blur">
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 rounded-lg border border-dashed border-rose-300 bg-rose-100 dark:border-rose-800 dark:bg-rose-950" />
                  <div className="h-16 rounded-lg border border-dashed border-teal-300 bg-teal-100 dark:border-teal-800 dark:bg-teal-950" />
                  <div className="h-16 rounded-lg border border-dashed border-amber-300 bg-amber-100 dark:border-amber-800 dark:bg-amber-950" />
                  <div className="h-16 rounded-lg border border-dashed border-slate-300 bg-slate-200 dark:border-slate-700 dark:bg-slate-900" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-teal-300/50 bg-teal-100/80 px-3 py-2 dark:border-teal-800 dark:bg-teal-950/80">
                  <span className="text-xs font-medium text-teal-800 dark:text-teal-200">
                    {t("landing.hero_timer_label")}
                  </span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-teal-900 dark:text-teal-100">
                    24:59
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="problem" className="scroll-mt-24 border-b border-border bg-muted/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">
              {t("landing.nav.problem")}
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              {t("landing.problem_title")}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {problems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border bg-background p-6"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="solution" className="scroll-mt-24 bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">
              {t("landing.nav.solution")}
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              {t("landing.solution_title")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("landing.solution_desc")}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {solutions.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.accent}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="why" className="scroll-mt-24 border-y border-border bg-muted/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">
              {t("landing.nav.why")}
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              {t("landing.why_title")}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border bg-background p-6"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="cta" className="scroll-mt-24 bg-background">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 md:py-20">
          <div className="rounded-2xl bg-foreground px-8 py-10 text-center text-background shadow-lg sm:px-12 sm:py-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              {t("landing.final_title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-background/75 sm:text-base">
              {t("landing.final_desc")}
            </p>
            <div className="mt-8 flex justify-center">{finalCta}</div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default LandingPage;
