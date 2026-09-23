import { Link, router } from "@inertiajs/react";
import { LogOut, CheckSquare2, FolderKanban, LayoutGrid } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/ts/components/ui/theme-toggle";
import { Button } from "@/ts/components/ui/button";
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
};

const navLinkClass = (active: boolean): string =>
  cn(
    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
    active
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
  );

const AppShell = ({ children, auth, title }: AppShellProps): React.ReactElement => {
  const path = typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
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
      <main className="mx-auto max-w-7xl px-4 py-4">{children}</main>
    </div>
  );
};

export default AppShell;
