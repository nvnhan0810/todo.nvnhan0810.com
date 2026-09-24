import { Badge } from "@/ts/components/ui/badge";
import { TODO_PRIORITY_LABEL, TODO_STATUS_LABEL } from "@/ts/domain/constants/labels";
import type { TodoItem, TodoPriority, TodoStatus } from "@/ts/domain/todo";
import { cn } from "@/ts/utils";
import { QUADRANTS } from "@/ts/presentation/pages/matrix/quadrants";

const STATUS_BADGE_CLASS: Record<TodoStatus, string> = {
  backlog: "border-slate-400/50 bg-slate-500/15 text-slate-700 dark:text-slate-300",
  todo: "border-sky-500/50 bg-sky-500/15 text-sky-800 dark:text-sky-300",
  in_progress: "border-orange-500/50 bg-orange-500/15 text-orange-800 dark:text-orange-300",
  done: "border-emerald-500/50 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
  rejected: "border-rose-500/50 bg-rose-500/15 text-rose-800 dark:text-rose-300",
};

const PRIORITY_BADGE_CLASS: Record<TodoPriority, string> = {
  low: "border-slate-400/50 bg-slate-500/15 text-slate-700 dark:text-slate-300",
  medium: "border-sky-500/50 bg-sky-500/15 text-sky-800 dark:text-sky-300",
  high: "border-amber-500/50 bg-amber-500/15 text-amber-900 dark:text-amber-300",
  urgent: "border-rose-500/50 bg-rose-500/15 text-rose-800 dark:text-rose-300",
};

const eisenhowerMeta = (
  isUrgent: boolean,
  isImportant: boolean,
): (typeof QUADRANTS)[number] => {
  const meta = QUADRANTS.find(
    (quadrant) =>
      quadrant.is_urgent === isUrgent && quadrant.is_important === isImportant,
  );

  if (meta) {
    return meta;
  }

  return {
    key: "eliminate",
    title: "Loại bỏ",
    subtitle: "Not urgent · Not important",
    is_urgent: false,
    is_important: false,
    accent: "border-slate-500/60",
    panel: "bg-slate-300/45 dark:bg-slate-900/50",
    header: "text-slate-700 dark:text-slate-300",
  };
};

type StatusBadgeProps = {
  status: TodoStatus;
};

export const TodoStatusBadge = ({ status }: StatusBadgeProps): React.ReactElement => (
  <Badge variant="outline" className={cn("whitespace-nowrap", STATUS_BADGE_CLASS[status])}>
    {TODO_STATUS_LABEL[status]}
  </Badge>
);

type PriorityBadgeProps = {
  priority: TodoPriority;
};

export const TodoPriorityBadge = ({
  priority,
}: PriorityBadgeProps): React.ReactElement => (
  <Badge
    variant="outline"
    className={cn("whitespace-nowrap", PRIORITY_BADGE_CLASS[priority])}
  >
    {TODO_PRIORITY_LABEL[priority]}
  </Badge>
);

type EisenhowerBadgeProps = {
  todo: Pick<TodoItem, "is_urgent" | "is_important">;
};

export const TodoEisenhowerBadge = ({
  todo,
}: EisenhowerBadgeProps): React.ReactElement => {
  const meta = eisenhowerMeta(todo.is_urgent, todo.is_important);

  return (
    <Badge
      variant="outline"
      className={cn(
        "whitespace-nowrap",
        meta.accent,
        meta.panel,
        meta.header,
      )}
      title={meta.subtitle}
    >
      {meta.title}
    </Badge>
  );
};
