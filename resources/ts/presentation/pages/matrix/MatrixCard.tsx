import { Button } from "@/ts/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ts/components/ui/tooltip";
import { cn } from "@ts/utils";
import { Check, Play, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { todoPriorityShortLabel } from "@/ts/domain/constants/labels";
import type { PomodoroPhase } from "@/ts/domain/constants/pomodoro";
import type { TodoItem } from "@/ts/domain/todo";
import { useTranslation } from "@/ts/presentation/i18n/useTranslation";
import PomodoroPhaseGif from "./PomodoroPhaseGif";
import { statusStyles } from "./quadrants";

type Props = {
  todo: TodoItem;
  onEdit: (todo: TodoItem) => void;
  onSelectForPomodoro: (todo: TodoItem) => void;
  onCompleteActiveTodo: () => void;
  onClearActiveTodo: () => void;
  isPomodoroActive: boolean;
  isHighlighted: boolean;
  pomodoroPhase: PomodoroPhase;
};

const MatrixCard = ({
  todo,
  onEdit,
  onSelectForPomodoro,
  onCompleteActiveTodo,
  onClearActiveTodo,
  isPomodoroActive,
  isHighlighted,
  pomodoroPhase,
}: Props): React.ReactElement => {
  const { t } = useTranslation();
  const status = todo.status === "in_progress" ? "in_progress" : "todo";
  const style = statusStyles[status];
  const didDragRef = useRef(false);
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isHighlighted || !cardRef.current) {
      return;
    }
    cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isHighlighted]);

  const onDragStart = (event: React.DragEvent<HTMLElement>): void => {
    didDragRef.current = true;
    event.dataTransfer.setData("text/todo-id", String(todo.id));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <article
      ref={cardRef}
      data-matrix-card
      data-todo-id={todo.id}
      draggable
      onDragStart={onDragStart}
      onDragEnd={() => {
        window.setTimeout(() => {
          didDragRef.current = false;
        }, 0);
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (didDragRef.current) {
          didDragRef.current = false;
          return;
        }
        onEdit(todo);
      }}
      className={cn(
        "rounded-md px-3 py-2.5 cursor-grab active:cursor-grabbing transition-colors duration-200",
        "border border-border hover:border-foreground/25",
        style.card,
        isPomodoroActive && "ring-1 ring-rose-400 dark:ring-rose-400/60",
        isHighlighted && "animate-matrix-locate relative z-[1]",
      )}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground leading-snug">
            {todo.title}
          </span>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            {todo.project?.name && (
              <span className="truncate max-w-[10rem]">{todo.project.name}</span>
            )}
            {todo.due_at && (
              <span className="tabular-nums">
                {t("common.due", { date: todo.due_at.slice(0, 10) })}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 self-start">
          {isPomodoroActive && (
            <PomodoroPhaseGif phase={pomodoroPhase} size="sm" />
          )}
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {todoPriorityShortLabel(t, todo.priority)}
          </span>
          {isPomodoroActive ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 cursor-pointer p-0 text-rose-600/80 hover:bg-rose-500/15 hover:text-rose-700 dark:text-rose-300/90 dark:hover:text-rose-200"
                    aria-label={t("pomodoro.clear_task")}
                    onClick={(event) => {
                      event.stopPropagation();
                      onClearActiveTodo();
                    }}
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">{t("pomodoro.clear_task_tip")}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 cursor-pointer p-0 text-emerald-600/80 hover:bg-emerald-500/15 hover:text-emerald-700 dark:text-emerald-300/90 dark:hover:text-emerald-200"
                    aria-label={t("pomodoro.complete_todo")}
                    onClick={(event) => {
                      event.stopPropagation();
                      onCompleteActiveTodo();
                    }}
                  >
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">{t("pomodoro.complete_todo_tip")}</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 cursor-pointer p-0 text-rose-600/80 hover:text-rose-700 dark:text-rose-300/90 dark:hover:text-rose-200"
                  aria-label={t("matrix.card_pomodoro")}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectForPomodoro(todo);
                  }}
                >
                  <Play className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">{t("matrix.card_pomodoro_tip")}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </article>
  );
};

export default MatrixCard;
