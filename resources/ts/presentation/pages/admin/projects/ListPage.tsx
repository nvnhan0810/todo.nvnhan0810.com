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
import AppShell, { type RootProps } from "@/ts/presentation/layouts/AppShell";
import { useTranslation } from "@/ts/presentation/i18n/useTranslation";
import { router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useRoute } from "ziggy-js";
import type { TodoProject } from "@/ts/domain/todo";

type Props = RootProps & {
  projects: TodoProject[];
};

const ListPage = ({ auth, projects }: Props): React.ReactElement => {
  const route = useRoute();
  const { t } = useTranslation();

  const handleDelete = (id: number): void => {
    router.delete(route("todos.projects.destroy", id));
  };

  return (
    <AppShell
      auth={auth}
      seoTitle={t("seo.projects_title")}
      seoDescription={t("seo.projects_description")}
      seoPath="/todos/projects"
    >
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t("projects.title")}</h1>
        <Button variant="outline" onClick={() => router.get(route("todos.projects.create"))}>
          <Plus className="mr-1 h-4 w-4" /> {t("common.new")}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-foreground">
            <tr>
              <th className="border border-border px-3 py-2">{t("projects.col_name")}</th>
              <th className="border border-border px-3 py-2">{t("projects.col_domain")}</th>
              <th className="border border-border px-3 py-2">{t("projects.col_repo")}</th>
              <th className="border border-border px-3 py-2">{t("projects.col_todos")}</th>
              <th className="border border-border px-3 py-2">{t("projects.col_actions")}</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="border border-border px-3 py-6 text-center text-muted-foreground">
                  {t("projects.empty")}
                </td>
              </tr>
            )}
            {projects.map((project) => (
              <tr key={project.id} className="bg-card">
                <td className="border border-border px-3 py-2">{project.name}</td>
                <td className="border border-border px-3 py-2">{project.domain ?? t("common.none")}</td>
                <td className="max-w-xs truncate border border-border px-3 py-2">
                  {project.git_repo_url ? (
                    <a
                      href={project.git_repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-700 hover:underline dark:text-sky-300"
                    >
                      {project.git_repo_url}
                    </a>
                  ) : (
                    t("common.none")
                  )}
                </td>
                <td className="border border-border px-3 py-2 text-center">{project.todos_count ?? 0}</td>
                <td className="border border-border px-3 py-2">
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href={route("todos.index", { project_id: project.id })}
                      className="text-sky-700 dark:text-sky-300"
                    >
                      {t("nav.todos")}
                    </a>
                    <a
                      href={route("todos.projects.edit", project.id)}
                      className="text-sky-700 dark:text-sky-300"
                    >
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
                          <AlertDialogTitle>{t("projects.delete_title")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("projects.delete_confirm", { name: project.name })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDelete(project.id)}
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
        </table>
      </div>
    </AppShell>
  );
};

export default ListPage;
