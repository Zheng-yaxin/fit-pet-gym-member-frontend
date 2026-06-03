"use client";

import { useEffect, useRef } from "react";
import { createScope } from "animejs";
import type { DefaultsParams, Scope } from "animejs";

import { DURATION, prefersReducedMotion } from "@/components/motion/fitpet-motion";

type AnimeScopeSetup<T extends HTMLElement | SVGElement> = (
  scope: Scope,
  root: T,
  reducedMotion: boolean,
) => void | (() => void);

interface UseAnimeScopeOptions {
  defaults?: DefaultsParams;
  disabled?: boolean;
  mediaQueries?: Record<string, string>;
}

export function useAnimeScope<T extends HTMLElement | SVGElement = HTMLDivElement>(
  setup: AnimeScopeSetup<T>,
  dependencies: React.DependencyList = [],
  options: UseAnimeScopeOptions = {},
) {
  const rootRef = useRef<T>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || options.disabled) return;

    const reducedMotion = prefersReducedMotion();
    const scope = createScope({
      root,
      defaults: {
        duration: DURATION.normal,
        ease: "out(3)",
        ...options.defaults,
      },
      mediaQueries: {
        reducedMotion: "(prefers-reduced-motion: reduce)",
        ...options.mediaQueries,
      },
    });

    scope.add((activeScope) => setup(activeScope ?? scope, root, reducedMotion));

    return () => {
      scope.revert();
    };
    // Callers own the dependency list so animation lifetimes match component state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return rootRef;
}

