import { Link, router } from "@inertiajs/react";
import { LogOut, CheckSquare2, FolderKanban, LayoutGrid } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/ts/components/ui/theme-toggle";
import { Button } from "@/ts/components/ui/button";
import { TooltipProvider } from "@/ts/components/ui/tooltip";
import { cn } from "@/ts/utils";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
};

export type RootProps = {
  auth: AuthUser | null;
};

type AppShellProps = RootProps & {
  children: ReactNode;
  title?: string;
  /** Lock shell to the viewport so children can fill remaining height without page scroll. */
  fillViewport?: boolean;
};

const navLinkClass = (active: boolean): string =>
  cn(
    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
    active
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
  );

const AppShell = ({
  children,
  auth,
  title,
  fillViewport = false,
}: AppShellProps): React.ReactElement => {
  const path = typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <TooltipProvider delayDuration={250}>
      <div
        className={cn(
          "flex flex-col bg-background text-foreground",
          fillViewport ? "h-dvh overflow-hidden" : "min-h-dvh",
        )}
      >
        <header className="shrink-0 border-b border-border bg-card">
          <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-4">
              <Link href={route("matrix.index")} className="shrink-0 font-semibold tracking-tight">
                Todo
              </Link>
              <nav className="hidden items-center gap-1 sm:flex">
                <Link href={route("matrix.index")} className={navLinkClass(path.startsWith("/matrix"))}>
                  <LayoutGrid className="h-4 w-4" />
                  Matrix
                </Link>
                <Link href={route("todos.index")} className={navLinkClass(path.startsWith("/todos") && !path.includes("/projects"))}>
                  <CheckSquare2 className="h-4 w-4" />
                  Todos
                </Link>
                <Link href={route("todos.projects.index")} className={navLinkClass(path.includes("/projects"))}>
                  <FolderKanban className="h-4 w-4" />
                  Projects
                </Link>
              </nav>
              {title ? <span className="truncate text-sm text-muted-foreground sm:hidden">{title}</span> : null}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {auth ? (
                <div className="flex items-center gap-2">
                  <span className="hidden max-w-[10rem] truncate text-sm text-muted-foreground md:inline">
                    {auth.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Đăng xuất"
                    onClick={() => router.post(route("logout"))}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        <main
          className={cn(
            "flex w-full flex-col px-4 py-4 sm:px-6",
            fillViewport ? "min-h-0 flex-1 overflow-hidden" : "flex-1",
          )}
        >
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
};

export default AppShell;
