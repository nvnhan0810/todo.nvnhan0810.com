import { Button } from "@/ts/components/ui/button";
import { Input } from "@/ts/components/ui/input";
import { Label } from "@/ts/components/ui/label";
import AppShell, { type RootProps } from "@/ts/presentation/layouts/AppShell";
import { useTranslation } from "@/ts/presentation/i18n/useTranslation";
import { router, useForm } from "@inertiajs/react";
import { useRoute } from "ziggy-js";
import type { TodoProject } from "@/ts/domain/todo";

type Props = RootProps & {
  project: TodoProject | null;
};

const FormPage = ({ auth, project }: Props): React.ReactElement => {
  const route = useRoute();
  const { t } = useTranslation();
  const isEdit = Boolean(project?.id);

  const { data, setData, post, put, processing, errors } = useForm({
    name: project?.name ?? "",
    git_repo_url: project?.git_repo_url ?? "",
    domain: project?.domain ?? "",
  });

  const submit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (isEdit && project) {
      put(route("todos.projects.update", project.id));
      return;
    }
    post(route("todos.projects.store"));
  };

  return (
    <AppShell
      auth={auth}
      seoTitle={isEdit ? t("projects.edit_title") : t("projects.create_title")}
      seoDescription={t("seo.projects_description")}
      seoPath={
        isEdit && project ? `/todos/projects/${project.id}/edit` : "/todos/projects/create"
      }
    >
      <h1 className="mb-4 text-2xl font-bold text-foreground">
        {isEdit ? t("projects.edit_title") : t("projects.create_title")}
      </h1>

      <form onSubmit={submit} className="max-w-2xl space-y-4">
        <div>
          <Label>{t("projects.name")}</Label>
          <Input value={data.name} onChange={(e) => setData("name", e.target.value)} />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
        </div>
        <div>
          <Label>{t("projects.domain")}</Label>
          <Input
            value={data.domain}
            placeholder="example.nvnhan0810.com"
            onChange={(e) => setData("domain", e.target.value)}
          />
          {errors.domain && <p className="text-red-400 text-sm">{errors.domain}</p>}
        </div>
        <div>
          <Label>{t("projects.repo")}</Label>
          <Input
            value={data.git_repo_url}
            placeholder="https://github.com/..."
            onChange={(e) => setData("git_repo_url", e.target.value)}
          />
          {errors.git_repo_url && <p className="text-red-400 text-sm">{errors.git_repo_url}</p>}
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={processing}>
            {t("common.save")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.get(route("todos.projects.index"))}
          >
            {t("common.cancel")}
          </Button>
        </div>
      </form>
    </AppShell>
  );
};

export default FormPage;
