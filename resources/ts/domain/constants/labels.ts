import type { TodoPriority, TodoStatus } from "@/ts/domain/todo";

type TranslateFn = (
  key: string,
  replacements?: Record<string, string | number>,
) => string;

export const todoStatusLabel = (t: TranslateFn, status: TodoStatus): string =>
  t(`status.${status}`);

export const todoPriorityLabel = (
  t: TranslateFn,
  priority: TodoPriority,
): string => t(`priority.${priority}`);

export const todoPriorityShortLabel = (
  t: TranslateFn,
  priority: TodoPriority,
): string => t(`priority_short.${priority}`);
