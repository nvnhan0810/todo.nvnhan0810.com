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
  active: boolean;
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
 * Pull-to-reload via touch. Soft-reloads the current Inertia page.
 * Works on mobile browsers and installed PWAs (touch events only).
 */
export const usePullToReload = (): PullToReloadState => {
  const [phase, setPhase] = useState<Phase>(PullToReloadPhase.Idle);
  const [pullDistance, setPullDistance] = useState(0);
  const phaseRef = useRef<Phase>(PullToReloadPhase.Idle);
  const gestureRef = useRef<GestureRef>({
    startY: 0,
    startX: 0,
    startTarget: null,
    active: false,
    pulling: false,
  });

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const resetGesture = (): void => {
      gestureRef.current = {
        startY: 0,
        startX: 0,
        startTarget: null,
        active: false,
        pulling: false,
      };
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
          gestureRef.current = {
            startY: 0,
            startX: 0,
            startTarget: null,
            active: false,
            pulling: false,
          };
        },
      });
    };

    const onTouchStart = (event: TouchEvent): void => {
      if (phaseRef.current === PullToReloadPhase.Reloading) {
        return;
      }
      if (event.touches.length !== 1) {
        resetGesture();
        return;
      }
      if (isBlockedOverlayOpen() || isInteractiveField(event.target)) {
        resetGesture();
        return;
      }
      if (!isScrollAncestorAtTop(event.target)) {
        resetGesture();
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
        active: true,
        pulling: false,
      };
    };

    const onTouchMove = (event: TouchEvent): void => {
      const gesture = gestureRef.current;
      if (!gesture.active || phaseRef.current === PullToReloadPhase.Reloading) {
        return;
      }
      if (event.touches.length !== 1) {
        resetGesture();
        return;
      }

      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      const deltaY = touch.clientY - gesture.startY;
      const deltaX = touch.clientX - gesture.startX;

      // Horizontal swipe — abandon pull-to-reload.
      if (!gesture.pulling && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        gesture.active = false;
        return;
      }

      if (deltaY <= 0) {
        if (gesture.pulling) {
          resetGesture();
        }
        return;
      }

      if (!isScrollAncestorAtTop(gesture.startTarget)) {
        resetGesture();
        return;
      }

      // Claim the gesture immediately so the browser does not scroll/rubber-band.
      if (event.cancelable) {
        event.preventDefault();
      }

      if (!gesture.pulling) {
        if (deltaY < PULL_TO_RELOAD_ACTIVATION_PX) {
          return;
        }
        gesture.pulling = true;
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
      if (!gesture.active) {
        return;
      }

      const shouldReload = gesture.pulling && phaseRef.current === PullToReloadPhase.Ready;

      gestureRef.current = {
        startY: 0,
        startX: 0,
        startTarget: null,
        active: false,
        pulling: false,
      };

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
      resetGesture();
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchcancel", onTouchCancel);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchCancel);
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
