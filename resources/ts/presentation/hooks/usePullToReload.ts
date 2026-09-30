import { router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import {
  PULL_TO_RELOAD_ACTIVATION_PX,
  PULL_TO_RELOAD_MAX_PX,
  PULL_TO_RELOAD_THRESHOLD_PX,
  PullToReloadPhase,
  type PullToReloadPhase as Phase,
} from "@/ts/domain/constants/pullToReload";

export type PullToReloadState = {
  phase: Phase;
  pullDistance: number;
  progress: number;
  isVisible: boolean;
  isReloading: boolean;
  isReady: boolean;
};

type GestureRef = {
  startY: number;
  startX: number;
  startTarget: EventTarget | null;
  armed: boolean;
  pulling: boolean;
};

const isScrollableOverflow = (overflowY: string): boolean =>
  overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";

const elementCanScroll = (element: Element): boolean => {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  const style = window.getComputedStyle(element);
  if (!isScrollableOverflow(style.overflowY)) {
    return false;
  }
  return element.scrollHeight > element.clientHeight + 1;
};

/** True when window + every scrollable ancestor of the touch target is at top. */
const isScrollAncestorAtTop = (target: EventTarget | null): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const rootScrollTop = Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
  );
  if (rootScrollTop > 1) {
    return false;
  }

  let current: Element | null =
    target instanceof Element ? target : target instanceof Node ? target.parentElement : null;

  while (current) {
    if (elementCanScroll(current) && current.scrollTop > 1) {
      return false;
    }
    current = current.parentElement;
  }

  return true;
};

const isInteractiveField = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }
  return target.isContentEditable;
};

const isBlockedOverlayOpen = (): boolean => document.querySelector('[aria-modal="true"]') !== null;

const clampPullDistance = (distance: number): number =>
  Math.min(PULL_TO_RELOAD_MAX_PX, Math.max(0, distance));

/**
 * Whole-page pull-to-reload.
 *
 * Safety rules (Matrix nested scroll):
 * - Never keep a permanent non-passive `touchmove` on `document`
 * - Arm only when every scroll ancestor is at top
 * - Call preventDefault only after a clear downward pull past activation
 * - Unbind move/end listeners as soon as the gesture ends or is abandoned
 */
export const usePullToReload = (): PullToReloadState => {
  const [phase, setPhase] = useState<Phase>(PullToReloadPhase.Idle);
  const [pullDistance, setPullDistance] = useState(0);
  const phaseRef = useRef<Phase>(PullToReloadPhase.Idle);
  const gestureRef = useRef<GestureRef>({
    startY: 0,
    startX: 0,
    startTarget: null,
    armed: false,
    pulling: false,
  });
  const moveRef = useRef<((event: TouchEvent) => void) | null>(null);
  const endRef = useRef<((event: TouchEvent) => void) | null>(null);
  const cancelRef = useRef<((event: TouchEvent) => void) | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const unbindGestureListeners = (): void => {
      if (moveRef.current) {
        document.removeEventListener("touchmove", moveRef.current);
        moveRef.current = null;
      }
      if (endRef.current) {
        document.removeEventListener("touchend", endRef.current);
        endRef.current = null;
      }
      if (cancelRef.current) {
        document.removeEventListener("touchcancel", cancelRef.current);
        cancelRef.current = null;
      }
    };

    const clearGesture = (): void => {
      unbindGestureListeners();
      gestureRef.current = {
        startY: 0,
        startX: 0,
        startTarget: null,
        armed: false,
        pulling: false,
      };
    };

    const resetUi = (): void => {
      clearGesture();
      setPullDistance(0);
      if (phaseRef.current !== PullToReloadPhase.Reloading) {
        setPhase(PullToReloadPhase.Idle);
      }
    };

    const triggerReload = (): void => {
      setPhase(PullToReloadPhase.Reloading);
      setPullDistance(PULL_TO_RELOAD_THRESHOLD_PX);
      router.reload({
        onFinish: () => {
          setPullDistance(0);
          setPhase(PullToReloadPhase.Idle);
          clearGesture();
        },
      });
    };

    const onTouchMove = (event: TouchEvent): void => {
      const gesture = gestureRef.current;
      if (!gesture.armed || phaseRef.current === PullToReloadPhase.Reloading) {
        return;
      }
      if (event.touches.length !== 1) {
        resetUi();
        return;
      }

      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      const deltaY = touch.clientY - gesture.startY;
      const deltaX = touch.clientX - gesture.startX;

      // Deciding intent: never preventDefault — native scroll must win.
      if (!gesture.pulling) {
        // Scrolling content (finger up) → abandon immediately.
        if (deltaY < 0) {
          resetUi();
          return;
        }

        // Horizontal swipe → abandon.
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 12) {
          resetUi();
          return;
        }

        if (deltaY < PULL_TO_RELOAD_ACTIVATION_PX) {
          return;
        }

        // Left the top while deciding → abandon.
        if (!isScrollAncestorAtTop(gesture.startTarget)) {
          resetUi();
          return;
        }

        gesture.pulling = true;
      }

      if (!isScrollAncestorAtTop(gesture.startTarget)) {
        resetUi();
        return;
      }

      // Committed pull — block rubber-band / native PTR for this gesture only.
      if (event.cancelable) {
        event.preventDefault();
      }

      if (deltaY <= 0) {
        resetUi();
        return;
      }

      const distance = clampPullDistance(deltaY);
      setPullDistance(distance);
      setPhase(
        distance >= PULL_TO_RELOAD_THRESHOLD_PX
          ? PullToReloadPhase.Ready
          : PullToReloadPhase.Pulling,
      );
    };

    const onTouchEnd = (): void => {
      const gesture = gestureRef.current;
      if (!gesture.armed) {
        return;
      }

      const shouldReload = gesture.pulling && phaseRef.current === PullToReloadPhase.Ready;

      clearGesture();

      if (shouldReload) {
        triggerReload();
        return;
      }

      setPullDistance(0);
      setPhase(PullToReloadPhase.Idle);
    };

    const onTouchCancel = (): void => {
      if (phaseRef.current === PullToReloadPhase.Reloading) {
        return;
      }
      resetUi();
    };

    const onTouchStart = (event: TouchEvent): void => {
      // Always drop a stale armed gesture before evaluating a new touch.
      if (gestureRef.current.armed) {
        clearGesture();
        setPullDistance(0);
        if (phaseRef.current !== PullToReloadPhase.Reloading) {
          setPhase(PullToReloadPhase.Idle);
        }
      }

      if (phaseRef.current === PullToReloadPhase.Reloading) {
        return;
      }
      if (event.touches.length !== 1) {
        return;
      }
      if (isBlockedOverlayOpen() || isInteractiveField(event.target)) {
        return;
      }
      if (!isScrollAncestorAtTop(event.target)) {
        return;
      }

      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      gestureRef.current = {
        startY: touch.clientY,
        startX: touch.clientX,
        startTarget: event.target,
        armed: true,
        pulling: false,
      };

      moveRef.current = onTouchMove;
      endRef.current = onTouchEnd;
      cancelRef.current = onTouchCancel;

      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend", onTouchEnd);
      document.addEventListener("touchcancel", onTouchCancel);
    };

    // Permanent listener is passive only — does not block scroll.
    document.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      clearGesture();
    };
  }, []);

  const progress = pullDistance <= 0 ? 0 : Math.min(1, pullDistance / PULL_TO_RELOAD_THRESHOLD_PX);
  const isReloading = phase === PullToReloadPhase.Reloading;
  const isReady = phase === PullToReloadPhase.Ready;
  const isVisible =
    phase === PullToReloadPhase.Pulling ||
    phase === PullToReloadPhase.Ready ||
    phase === PullToReloadPhase.Reloading;

  return {
    phase,
    pullDistance,
    progress,
    isVisible,
    isReloading,
    isReady,
  };
};
