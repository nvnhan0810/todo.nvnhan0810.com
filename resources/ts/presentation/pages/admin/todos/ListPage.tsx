import PaginationBar from "@/ts/components/common/PaginationBar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ts/components/ui/alert-dialog";
import { Button } from "@/ts/components/ui/button";
import Combobox from "@/ts/components/ui/combobox";
import { Input } from "@/ts/components/ui/input";
import AppShell, { type RootProps } from "@/ts/presentation/layouts/AppShell";
import { Pagination } from "@/ts/types/common";
import { router } from "@inertiajs/react";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRoute } from "ziggy-js";
import {
  TodoEisenhowerBadge,
  TodoPriorityBadge,
  TodoStatusBadge,
} from "@/ts/presentation/components/todoBadges";
import { todoStatusLabel } from "@/ts/domain/constants/labels";
import type { TodoItem, TodoPriority, TodoProject, TodoStatus } from "@/ts/domain/todo";
import { useTranslation } from "@/ts/presentation/i18n/useTranslation";

type Props = RootProps & {
  todos: Pagination<TodoItem>;
  projects: Pick<TodoProject, "id" | "name">[];
  filters: {
    project_id: number | null;
    status: string | null;
    search: string | null;
  };
  statuses: TodoStatus[];
  priorities: TodoPriority[];
};

type FilterParams = {
  project_id?: string | number;
  status?: string;
  search?: string;
};

const ListPage = ({ auth, todos, projects, filters, statuses }: Props): React.ReactElement => {
  const route = useRoute();
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  useEffect(() => {
    setSearchInput(filters.search ?? "");
  }, [filters.search]);

  const visitWithFilters = (next: FilterParams): void => {
    router.get(
      route("todos.index"),
      {
        project_id: next.project_id || undefined,
        status: next.status || undefined,
        search: next.search?.trim() || undefined,
      },
      { preserveState: true, replace: true },
    );
  };

  const applyFilter = (key: "project_id" | "status", value: string): void => {
    visitWithFilters({
      project_id: key === "project_id" ? value : (filters.project_id ?? undefined),
      status: key === "status" ? value : (filters.status ?? undefined),
      search: filters.search ?? undefined,
    });
  };

  useEffect(() => {
    const trimmed = searchInput.trim();
    const current = (filters.search ?? "").trim();
    if (trimmed === current) {
      return;
    }

    const timer = window.setTimeout(() => {
      visitWithFilters({
        project_id: filters.project_id ?? undefined,
        status: filters.status ?? undefined,
        search: trimmed || undefined,
      });
    }, 300);

    return () => window.clearTimeout(timer);
    // Keep debounce keyed to search input; filter snapshot is read when timer fires.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const handleDelete = (id: number): void => {
    router.delete(route("todos.destroy", id));
  };

  const projectOptions = [
    { value: "", label: t("todos.all_projects") },
    ...projects.map((project) => ({
      value: String(project.id),
      label: project.name,
    })),
  ];

  const statusOptions = [
    { value: "", label: t("todos.all_statuses") },
    ...statuses.map((status) => ({
      value: status,
      label: todoStatusLabel(t, status),
    })),
  ];

  return (
    <AppShell
      auth={auth}
      seoTitle={t("seo.todos_title")}
      seoDescription={t("seo.todos_description")}
      seoPath="/todos"
    >
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t("todos.title")}</h1>
        <Button
          variant="outline"
          onClick={() =>
            router.get(
              route("todos.create"),
              filters.project_id ? { project_id: filters.project_id } : undefined,
            )
          }
        >
          <Plus className="mr-1 h-4 w-4" /> {t("common.new")}
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={t("todos.search_placeholder")}
            className="pl-9"
            aria-label={t("todos.search_aria")}
          />
        </div>
        <div className="w-full sm:w-56">
          <Combobox
            options={projectOptions}
            value={filters.project_id != null ? String(filters.project_id) : ""}
            handleChange={(value) => applyFilter("project_id", value)}
            placeholder={t("todos.all_projects")}
            searchPlaceholder={t("todos.search_project")}
          />
        </div>
        <div className="w-full sm:w-48">
          <Combobox
            options={statusOptions}
            value={filters.status ?? ""}
            handleChange={(value) => applyFilter("status", value)}
            placeholder={t("todos.all_statuses")}
            searchPlaceholder={t("todos.search_status")}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-foreground">
            <tr>
              <th className="border border-border px-3 py-2">{t("todos.col_title")}</th>
              <th className="border border-border px-3 py-2">{t("todos.col_project")}</th>
              <th className="border border-border px-3 py-2">{t("todos.col_status")}</th>
              <th className="border border-border px-3 py-2">{t("todos.col_priority")}</th>
              <th className="border border-border px-3 py-2">{t("todos.col_eisenhower")}</th>
              <th className="border border-border px-3 py-2">{t("todos.col_due")}</th>
              <th className="border border-border px-3 py-2">{t("todos.col_actions")}</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            {todos.data.length === 0 && (
              <tr>
                <td colSpan={7} className="border border-border px-3 py-6 text-center text-muted-foreground">
                  {filters.search
                    ? t("todos.empty_search", { search: filters.search })
                    : t("todos.empty")}
                </td>
              </tr>
            )}
            {todos.data.map((todo) => (
              <tr key={todo.id} className="bg-card">
                <td className="border border-border px-3 py-2">{todo.title}</td>
                <td className="border border-border px-3 py-2">{todo.project?.name ?? t("common.none")}</td>
                <td className="border border-border px-3 py-2 text-center">
                  <TodoStatusBadge status={todo.status} />
                </td>
                <td className="border border-border px-3 py-2 text-center">
                  <TodoPriorityBadge priority={todo.priority} />
                </td>
                <td className="border border-border px-3 py-2 text-center">
                  <TodoEisenhowerBadge todo={todo} />
                </td>
                <td className="border border-border px-3 py-2 text-center">
                  {todo.due_at ? todo.due_at.slice(0, 10) : t("common.none")}
                </td>
                <td className="border border-border px-3 py-2">
                  <div className="flex items-center justify-center gap-3">
                    <a href={route("todos.edit", todo.id)} className="text-sky-700 dark:text-sky-300">
                      {t("common.edit")}
                    </a>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span className="cursor-pointer text-rose-600 dark:text-rose-400">
                          {t("common.delete")}
                        </span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("todos.delete_title")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("todos.delete_confirm", { title: todo.title })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDelete(todo.id)}
                          >
                            {t("common.delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} className="p-4 text-center">
                <PaginationBar pagination={todos} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </AppShell>
  );
};

export default ListPage;
