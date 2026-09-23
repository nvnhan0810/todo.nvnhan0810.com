import type { PomodoroPhase } from "./constants/pomodoro";

export type PomodoroRuntimeSnapshot = {
  phase: PomodoroPhase;
  /**
   * Frozen remaining while paused (`endsAt === null`).
   * Ignored for display while running — use `endsAt - Date.now()`.
   */
  remainingMs: number;
  /** Absolute epoch ms when the phase job fires; null when paused/idle */
  endsAt: number | null;
  /** Completed focus sessions in current cycle (0..N-1 while in focus, resets after long break) */
  focusCount: number;
  activeTodoId: number | null;
  isRunning: boolean;
  updatedAt: number;
  /** Server phase session — used for focus heartbeat + job guard */
  sessionUuid: string | null;
};
