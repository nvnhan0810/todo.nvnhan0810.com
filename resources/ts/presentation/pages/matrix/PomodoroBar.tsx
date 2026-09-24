import { Button } from "@/ts/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ts/components/ui/tooltip";
import { cn } from "@ts/utils";
import { Check, Pause, Play, SkipForward, X } from "lucide-react";
import { formatTimer } from "@/ts/domain/constants/pomodoro";
import type { UsePomodoroResult } from "@/ts/presentation/hooks/usePomodoro";
import { useTranslation } from "@/ts/presentation/i18n/useTranslation";
import type { TodoItem } from "@/ts/domain/todo";
import PomodoroPhaseGif from "./PomodoroPhaseGif";

type Props = {
  pomodoro: UsePomodoroResult;
  matrixTodos: TodoItem[];
  onLocateTodo: (todoId: number) => void;
  onCompleteActiveTodo: () => void;
  className?: string;
};

const PomodoroBar = ({
  pomodoro,
  matrixTodos,
  onLocateTodo,
  onCompleteActiveTodo,
  className,
}: Props): React.ReactElement => {
  const { t } = useTranslation();
  const {
    settings,
    phase,
    remainingMs,
    focusCount,
    activeTodoId,
    isRunning,
    clearActiveTodo,
    toggle,
    skipPhase,
  } = pomodoro;

  const activeTodo =
    activeTodoId !== null
      ? matrixTodos.find((todo) => todo.id === activeTodoId) ?? null
      : null;

  const sessionDots = Array.from(
    { length: settings.sessionsBeforeLongBreak },
    (_, index) => index < focusCount,
  );

  const phaseAccent =
    phase === "focus"
      ? "border-rose-300 bg-rose-100 dark:border-rose-800 dark:bg-rose-950"
      : phase === "short_break"
        ? "border-teal-300 bg-teal-100 dark:border-teal-800 dark:bg-teal-950"
        : "border-indigo-300 bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950";

  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3",
        phaseAccent,
        className,
      )}
    >
      <div className="min-w-0 shrink-0 sm:w-[7.5rem]">
        <p className="text-xs font-medium text-foreground">
          {t(`pomodoro.phase.${phase}`)}
        </p>
        <div className="mt-1 flex items-center gap-1">
          {sessionDots.map((filled, index) => (
            <span
              key={index}
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                filled ? "bg-rose-500/80 dark:bg-rose-400/80" : "bg-foreground/25",
              )}
            />
          ))}
          <span className="ml-1 text-[10px] text-muted-foreground tabular-nums">
            {focusCount}/{settings.sessionsBeforeLongBreak}
          </span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        {activeTodo ? (
          <div className="flex items-center gap-1.5 max-w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 shrink-0 p-0 cursor-pointer text-rose-400/90 hover:bg-rose-500/15 hover:text-rose-300"
                  onClick={clearActiveTodo}
                  aria-label={t("pomodoro.clear_task")}
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("pomodoro.clear_task_tip")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 shrink-0 p-0 cursor-pointer text-emerald-400/90 hover:bg-emerald-500/15 hover:text-emerald-300"
                  onClick={onCompleteActiveTodo}
                  aria-label={t("pomodoro.complete_todo")}
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("pomodoro.complete_todo_tip")}</TooltipContent>
            </Tooltip>

            <button
              type="button"
              onClick={() => onLocateTodo(activeTodo.id)}
              className="text-left min-w-0 flex-1 group cursor-pointer"
              title={t("pomodoro.locate_todo")}
            >
              <span className="block truncate text-sm font-medium text-foreground group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors underline-offset-2 group-hover:underline">
                {activeTodo.title}
              </span>
              {activeTodo.project?.name && (
                <span className="block truncate text-[11px] text-muted-foreground">
                  {activeTodo.project.name}
                </span>
              )}
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("pomodoro.no_todo")}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
        <PomodoroPhaseGif phase={phase} size="md" />
        <div className="tabular-nums text-2xl font-semibold tracking-tight text-foreground min-w-[4.5rem] text-right">
          {formatTimer(remainingMs)}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={toggle}
              aria-label={isRunning ? t("pomodoro.pause") : t("pomodoro.start")}
            >
              {isRunning ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isRunning ? t("pomodoro.pause_space") : t("pomodoro.start_space")}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={skipPhase}
              aria-label={t("pomodoro.skip_phase")}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("pomodoro.skip_phase_tip")}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default PomodoroBar;
