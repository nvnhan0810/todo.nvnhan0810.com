import type { MatrixQuadrantKey, TodoPriority, TodoStatus } from "@/ts/domain/todo";

export type { MatrixQuadrantKey, MatrixQuadrants } from "@/ts/domain/todo";

export type QuadrantMeta = {
  key: MatrixQuadrantKey;
  title: string;
  subtitle: string;
  is_urgent: boolean;
  is_important: boolean;
  accent: string;
  panel: string;
  header: string;
};

export const QUADRANTS: QuadrantMeta[] = [
  {
    key: "do",
    title: "Làm ngay",
    subtitle: "Urgent · Important",
    is_urgent: true,
    is_important: true,
    accent: "border-rose-300 dark:border-rose-800",
    panel: "bg-rose-100 dark:bg-rose-950",
    header: "text-rose-800 dark:text-rose-200",
  },
  {
    key: "schedule",
    title: "Lên lịch",
    subtitle: "Not urgent · Important",
    is_urgent: false,
    is_important: true,
    accent: "border-teal-300 dark:border-teal-800",
    panel: "bg-teal-100 dark:bg-teal-950",
    header: "text-teal-800 dark:text-teal-200",
  },
  {
    key: "delegate",
    title: "Giao việc",
    subtitle: "Urgent · Not important",
    is_urgent: true,
    is_important: false,
    accent: "border-amber-300 dark:border-amber-800",
    panel: "bg-amber-100 dark:bg-amber-950",
    header: "text-amber-900 dark:text-amber-200",
  },
  {
    key: "eliminate",
    title: "Loại bỏ",
    subtitle: "Not urgent · Not important",
    is_urgent: false,
    is_important: false,
    accent: "border-slate-300 dark:border-slate-700",
    panel: "bg-slate-200 dark:bg-slate-900",
    header: "text-slate-700 dark:text-slate-200",
  },
];

export const priorityLabel: Record<TodoPriority, string> = {
  low: "Low",
  medium: "Med",
  high: "High",
  urgent: "Urgent",
};

export const statusStyles: Record<
  Extract<TodoStatus, "todo" | "in_progress">,
  { card: string }
> = {
  todo: {
    card: "border-l-4 border-l-sky-400 bg-card dark:border-l-sky-500 dark:bg-sky-950",
  },
  in_progress: {
    card: "border-l-4 border-l-orange-400 bg-card dark:border-l-orange-500 dark:bg-orange-950",
  },
};
