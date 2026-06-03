"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DURATION } from "@/components/motion/fitpet-motion";

/**
 * useBlink — schedules natural blinking for character eyes.
 * Returns `blinking: boolean` that flips true for ~100ms every 3-4s.
 */
export function useBlink(enabled = true) {
  const [blinking, setBlinking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blinkRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleBlink = useCallback(() => {
    if (!enabled) return;
    const gap = DURATION.blinkGap + Math.random() * 800;
    timerRef.current = setTimeout(() => {
      setBlinking(true);
      blinkRef.current = setTimeout(() => {
        setBlinking(false);
        scheduleBlink();
      }, DURATION.instant);
    }, gap);
  }, [enabled]);

  useEffect(() => {
    scheduleBlink();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (blinkRef.current) clearTimeout(blinkRef.current);
    };
  }, [scheduleBlink]);

  return blinking;
}
