import { Loader2, RefreshCw } from "lucide-react";
import { PULL_TO_RELOAD_MAX_PX } from "@/ts/domain/constants/pullToReload";
import { cn } from "@/ts/utils";

type Props = {
  isVisible: boolean;
  isReloading: boolean;
  isReady: boolean;
  pullDistance: number;
  progress: number;
};

const PullToReloadIndicator = ({
  isVisible,
  isReloading,
  isReady,
  pullDistance,
  progress,
}: Props): React.ReactElement | null => {
  if (!isVisible) {
    return null;
  }

  const travel = Math.min(PULL_TO_RELOAD_MAX_PX, Math.max(0, pullDistance));
  const iconRotation = isReloading ? undefined : Math.round(progress * 180);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[300] flex justify-center"
      style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      aria-live="polite"
      aria-busy={isReloading}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-sm backdrop-blur-sm transition-opacity",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        style={{
          transform: `translateY(${Math.max(0, travel * 0.35)}px)`,
        }}
        role="status"
        aria-label="Reload"
      >
        {isReloading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />
        ) : (
          <RefreshCw
            className={cn(
              "h-4 w-4 text-muted-foreground transition-colors",
              isReady && "text-foreground",
            )}
            style={{ transform: `rotate(${iconRotation ?? 0}deg)` }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
};

export default PullToReloadIndicator;
