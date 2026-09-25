import { cn } from "@ts/utils";
import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";
import { sortMatrixTodos } from "@/ts/application/matrixTodoOrder";
import type { PomodoroPhase } from "@/ts/domain/constants/pomodoro";
import type { TodoItem } from "@/ts/domain/todo";
import { useTranslation } from "@/ts/presentation/i18n/useTranslation";
import MatrixCard from "./MatrixCard";
import type { QuadrantMeta } from "./quadrants";

type Props = {
  meta: QuadrantMeta;
  todos: TodoItem[];
  onCreateInQuadrant: (meta: QuadrantMeta) => void;
  onEditTodo: (todo: TodoItem) => void;
  onSelectForPomodoro: (todo: TodoItem) => void;
  onCompleteActiveTodo: () => void;
  onClearActiveTodo: () => void;
  activePomodoroTodoId: number | null;
  highlightedTodoId: number | null;
  pomodoroPhase: PomodoroPhase;
};

const MatrixQuadrant = ({
  meta,
  todos,
  onCreateInQuadrant,
  onEditTodo,
  onSelectForPomodoro,
  onCompleteActiveTodo,
  onClearActiveTodo,
  activePomodoroTodoId,
  highlightedTodoId,
  pomodoroPhase,
}: Props): React.ReactElement => {
  const route = useRoute();
  const { t } = useTranslation();
  const [isOver, setIsOver] = useState(false);
  const suppressClickRef = useRef(false);
  const orderedTodos = sortMatrixTodos(todos);

  const onDrop = (event: React.DragEvent<HTMLElement>): void => {
    event.preventDefault();
    setIsOver(false);
    suppressClickRef.current = true;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 200);

    const id = event.dataTransfer.getData("text/todo-id");
    if (!id) {
      return;
    }

    router.patch(
      route("matrix.update", id),
      {
        is_urgent: meta.is_urgent,
        is_important: meta.is_important,
      },
      { preserveScroll: true },
    );
  };

  const onQuadrantClick = (): void => {
    if (suppressClickRef.current) {
      return;
    }
    onCreateInQuadrant(meta);
  };

  return (
    <section
      onClick={onQuadrantClick}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={onDrop}
      title={t("matrix.quadrant_create_hint")}
      className={cn(
        "flex h-64 flex-col overflow-hidden rounded-lg border-2 border-dashed p-3 transition-colors duration-200 cursor-pointer sm:h-72 lg:h-full lg:min-h-0",
        meta.accent,
        meta.panel,
        isOver && "border-solid bg-white/5",
      )}
    >
      <header className="mb-3 flex items-baseline justify-between gap-2 shrink-0 pointer-events-none">
        <div>
          <h2 className={cn("text-base font-semibold", meta.header)}>
            {t(`quadrant.${meta.key}.title`)}
          </h2>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {t(`quadrant.${meta.key}.subtitle`)}
          </p>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
          {orderedTodos.length}
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto scrollbar-hidden">
        {orderedTodos.length === 0 && (
          <p className="mt-6 text-center text-xs text-muted-foreground pointer-events-none">
            {t("matrix.quadrant_empty")}
          </p>
        )}
        {orderedTodos.map((todo) => (
          <MatrixCard
            key={todo.id}
            todo={todo}
            onEdit={onEditTodo}
            onSelectForPomodoro={onSelectForPomodoro}
            onCompleteActiveTodo={onCompleteActiveTodo}
            onClearActiveTodo={onClearActiveTodo}
            isPomodoroActive={activePomodoroTodoId === todo.id}
            isHighlighted={highlightedTodoId === todo.id}
            pomodoroPhase={pomodoroPhase}
          />
        ))}
      </div>
    </section>
  );
};

export default MatrixQuadrant;
