import { Button } from "@/ts/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ts/components/ui/dialog";
import { Input } from "@/ts/components/ui/input";
import { Label } from "@/ts/components/ui/label";
import type { TodoProject } from "@/ts/domain/todo";
import { useTranslation } from "@/ts/presentation/i18n/useTranslation";
import { useForm } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

export type CreatedProjectOption = Pick<TodoProject, "id" | "name">;

type FlashProps = {
  flash?: {
    created_project?: CreatedProjectOption | null;
  };
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (project: CreatedProjectOption) => void;
};

const ProjectFormModal = ({
  open,
  onOpenChange,
  onCreated,
}: Props): React.ReactElement => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md z-[250]"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {open ? (
          <ProjectFormModalBody
            onClose={() => onOpenChange(false)}
            onCreated={onCreated}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

type BodyProps = {
  onClose: () => void;
  onCreated: (project: CreatedProjectOption) => void;
};

const ProjectFormModalBody = ({
  onClose,
  onCreated,
}: BodyProps): React.ReactElement => {
  const route = useRoute();
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    git_repo_url: "",
    domain: "",
    return_to: "matrix" as const,
  });

  const submit = (event: React.FormEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    post(route("todos.projects.store"), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: (inertiaPage) => {
        const created = (inertiaPage.props as FlashProps).flash?.created_project;
        if (
          created &&
          typeof created.id === "number" &&
          typeof created.name === "string"
        ) {
          onCreated(created);
        }
        onClose();
      },
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{t("projects.create_title")}</DialogTitle>
        <DialogDescription>{t("projects.create_description")}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="project-name">{t("projects.name")}</Label>
          <Input
            id="project-name"
            value={data.name}
            onChange={(event) => setData("name", event.target.value)}
            autoFocus
          />
          {errors.name ? (
            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="project-domain">{t("projects.domain")}</Label>
          <Input
            id="project-domain"
            value={data.domain}
            placeholder="example.nvnhan0810.com"
            onChange={(event) => setData("domain", event.target.value)}
          />
          {errors.domain ? (
            <p className="mt-1 text-sm text-red-400">{errors.domain}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="project-repo">{t("projects.repo")}</Label>
          <Input
            id="project-repo"
            value={data.git_repo_url}
            placeholder="https://github.com/..."
            onChange={(event) => setData("git_repo_url", event.target.value)}
          />
          {errors.git_repo_url ? (
            <p className="mt-1 text-sm text-red-400">{errors.git_repo_url}</p>
          ) : null}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={processing}>
          {t("common.create")}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProjectFormModal;
