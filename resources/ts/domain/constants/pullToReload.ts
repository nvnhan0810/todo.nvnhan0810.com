export const PullToReloadPhase = {
  Idle: "idle",
  Pulling: "pulling",
  Ready: "ready",
  Reloading: "reloading",
} as const;

export type PullToReloadPhase = (typeof PullToReloadPhase)[keyof typeof PullToReloadPhase];

/** Pixel distance before release triggers a reload. */
export const PULL_TO_RELOAD_THRESHOLD_PX = 72;

/** Cap visual travel so the indicator does not stretch too far. */
export const PULL_TO_RELOAD_MAX_PX = 112;

/** Ignore tiny finger jitter before treating the gesture as a pull. */
export const PULL_TO_RELOAD_ACTIVATION_PX = 8;
