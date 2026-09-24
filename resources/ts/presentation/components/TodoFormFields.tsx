import Combobox from "@/ts/components/ui/combobox";
import { Checkbox } from "@/ts/components/ui/checkbox";
import { Input } from "@/ts/components/ui/input";
import { Label } from "@/ts/components/ui/label";
import { Textarea } from "@/ts/components/ui/textarea";
import {
  todoPriorityLabel,
  todoStatusLabel,
} from "@/ts/domain/constants/labels";
import type { TodoPriority, TodoProject, TodoStatus } from "@/ts/domain/todo";
import { useTranslation } from "@/ts/presentation/i18n/useTranslation";

export type TodoFormValues = {
  project_id: number | string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  due_at: string;
  is_urgent: boolean;
  is_important: boolean;
};

type Props = {
  values: TodoFormValues;
  errors: Partial<Record<keyof TodoFormValues, string>>;
  projects: Pick<TodoProject, "id" | "name">[];
  statuses: TodoStatus[];
  priorities: TodoPriority[];
  onChange: <K extends keyof TodoFormValues>(key: K, value: TodoFormValues[K]) => void;
  onCreateProject?: () => void;
};

const TodoFormFields = ({
  values,
  errors,
  projects,
  statuses,
  priorities,
  onChange,
  onCreateProject,
}: Props): React.ReactElement => {
  const { t } = useTranslation();

  const projectOptions = [
    { value: "", label: t("form.no_project") },
    ...projects.map((project) => ({
      value: String(project.id),
      label: project.name,
    })),
  ];

  const statusOptions = statuses.map((status) => ({
    value: status,
    label: todoStatusLabel(t, status),
  }));

  const priorityOptions = priorities.map((priority) => ({
    value: priority,
    label: todoPriorityLabel(t, priority),
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label>{t("form.title")}</Label>
        <Input
          value={values.title}
          onChange={(e) => onChange("title", e.target.value)}
          autoFocus
        />
        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <Label>{t("form.project")}</Label>
        <Combobox
          options={projectOptions}
          value={
            values.project_id === "" || values.project_id == null
              ? ""
              : String(values.project_id)
          }
          handleChange={(next) =>
            onChange("project_id", next === "" ? "" : Number(next))
          }
          placeholder={t("form.select_project")}
          searchPlaceholder={t("form.search_project")}
          footerAction={
            onCreateProject
              ? {
                  label: t("form.create_project"),
                  onSelect: onCreateProject,
                }
              : undefined
          }
        />
        {errors.project_id && (
          <p className="text-red-400 text-sm mt-1">{errors.project_id}</p>
        )}
      </div>

      <div>
        <Label>{t("form.description")}</Label>
        <Textarea
          value={values.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={4}
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>{t("form.status")}</Label>
          <Combobox
            options={statusOptions}
            value={values.status}
            handleChange={(next) => onChange("status", next as TodoStatus)}
            placeholder={t("form.select_status")}
            searchPlaceholder={t("form.search_status")}
          />
          {errors.status && (
            <p className="text-red-400 text-sm mt-1">{errors.status}</p>
          )}
        </div>
        <div>
          <Label>{t("form.priority")}</Label>
          <Combobox
            options={priorityOptions}
            value={values.priority}
            handleChange={(next) => onChange("priority", next as TodoPriority)}
            placeholder={t("form.select_priority")}
            searchPlaceholder={t("form.search_priority")}
          />
          {errors.priority && (
            <p className="text-red-400 text-sm mt-1">{errors.priority}</p>
          )}
        </div>
      </div>

      <div>
        <Label>{t("form.due_date")}</Label>
        <Input
          type="date"
          value={values.due_at}
          onChange={(e) => onChange("due_at", e.target.value)}
        />
        {errors.due_at && (
          <p className="text-red-400 text-sm mt-1">{errors.due_at}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-foreground">
          <Checkbox
            checked={values.is_urgent}
            onCheckedChange={(v) => onChange("is_urgent", v === true)}
          />
          {t("common.urgent")}
        </label>
        <label className="flex items-center gap-2 text-foreground">
          <Checkbox
            checked={values.is_important}
            onCheckedChange={(v) => onChange("is_important", v === true)}
          />
          {t("common.important")}
        </label>
      </div>
    </div>
  );
};

export default TodoFormFields;
