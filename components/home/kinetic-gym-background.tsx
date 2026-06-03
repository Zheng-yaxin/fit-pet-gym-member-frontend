"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";

import styles from "./kinetic-gym-background.module.css";

type TokenKind = "pet" | "dumbbell" | "mat" | "bottle" | "medal" | "paw";

type Token = {
  kind: TokenKind;
  tone: "mint" | "blue" | "yolk" | "coral" | "pink";
  size: "sm" | "md" | "lg";
  left: string;
  top: string;
  depth: number;
  rotate: number;
};

const tokens: Token[] = [
  { kind: "pet", tone: "pink", size: "lg", left: "5%", top: "11%", depth: 1.35, rotate: -8 },
  { kind: "dumbbell", tone: "blue", size: "md", left: "18%", top: "72%", depth: 1.1, rotate: 12 },
  { kind: "mat", tone: "mint", size: "lg", left: "70%", top: "15%", depth: 1.25, rotate: 9 },
  { kind: "bottle", tone: "yolk", size: "sm", left: "84%", top: "63%", depth: 0.9, rotate: -14 },
  { kind: "medal", tone: "coral", size: "md", left: "38%", top: "7%", depth: 0.75, rotate: 6 },
  { kind: "paw", tone: "mint", size: "sm", left: "58%", top: "82%", depth: 1.45, rotate: -10 },
  { kind: "dumbbell", tone: "yolk", size: "sm", left: "92%", top: "25%", depth: 1.15, rotate: -24 },
  { kind: "pet", tone: "blue", size: "md", left: "9%", top: "51%", depth: 0.85, rotate: 16 }
];

export function KineticGymBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();

    media.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        finePointer: "(pointer: fine)"
      },
      (context) => {
        const reduceMotion = Boolean(context.conditions?.reduceMotion);
        const finePointer = Boolean(context.conditions?.finePointer);

        if (reduceMotion) {
          gsap.set(root, { "--fit-bg-x": 0, "--fit-bg-y": 0, "--fit-bg-tilt": 0 });
          return;
        }

        const tokenNodes = root.querySelectorAll(`.${styles.token}`);
        const lineNodes = root.querySelectorAll(`.${styles.magnetLine}`);

        gsap.fromTo(
          tokenNodes,
          { autoAlpha: 0, y: 24, scale: 0.72 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.45)", stagger: { each: 0.055, from: "random" } }
        );

        gsap.to(tokenNodes, {
          y: (index) => (index % 2 === 0 ? -18 : 16),
          rotation: (index) => (index % 2 === 0 ? "+=7" : "-=7"),
          duration: (index) => 3.6 + (index % 4) * 0.38,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: { each: 0.18, from: "random" }
        });

        gsap.to(lineNodes, {
          rotation: (index) => (index % 2 === 0 ? "+=18" : "-=18"),
          scaleX: (index) => (index % 3 === 0 ? 1.35 : 0.82),
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: { each: 0.04, from: "center" }
        });

        if (!finePointer) return;

        const xTo = gsap.quickTo(root, "--fit-bg-x", { duration: 0.75, ease: "power3.out" });
        const yTo = gsap.quickTo(root, "--fit-bg-y", { duration: 0.75, ease: "power3.out" });
        const tiltTo = gsap.quickTo(root, "--fit-bg-tilt", { duration: 0.65, ease: "power3.out" });

        const handlePointerMove = (event: PointerEvent) => {
          const rect = root.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          xTo(x * 42);
          yTo(y * 34);
          tiltTo(x * 10);
        };

        const handlePointerLeave = () => {
          xTo(0);
          yTo(0);
          tiltTo(0);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerleave", handlePointerLeave);

        return () => {
          window.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener("pointerleave", handlePointerLeave);
        };
      }
    );

    return () => {
      media.revert();
    };
  }, []);

  return (
    <div className={styles.root} ref={rootRef} aria-hidden="true">
      <div className={styles.paper} />
      <div className={styles.mesh} />

      <div className={styles.magnetField}>
        {Array.from({ length: 30 }).map((_, index) => (
          <i
            className={styles.magnetLine}
            style={
              {
                left: `${6 + (index % 10) * 10}%`,
                top: `${12 + Math.floor(index / 10) * 29}%`,
                "--line-rotate": `${(index % 6) * 13 - 30}deg`,
                "--line-delay": `${index * 28}ms`
              } as CSSProperties
            }
            key={index}
          />
        ))}
      </div>

      {tokens.map((token, index) => (
        <span
          className={[styles.token, styles[`tone${capitalize(token.tone)}`], styles[`size${capitalize(token.size)}`]].join(" ")}
          style={
            {
              left: token.left,
              top: token.top,
              "--token-depth": token.depth,
              "--token-rotate": `${token.rotate}deg`
            } as CSSProperties
          }
          key={`${token.kind}-${index}`}
        >
          <TokenIcon kind={token.kind} />
        </span>
      ))}
    </div>
  );
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function TokenIcon({ kind }: { kind: TokenKind }) {
  if (kind === "pet") {
    return (
      <svg viewBox="0 0 96 96" role="presentation">
        <path d="M25 35C19 19 28 11 43 20C47 22 50 26 51 31C54 25 58 21 64 20C78 18 84 29 75 42" className={styles.strokeFill} />
        <path d="M19 51C19 31 32 21 51 22C70 23 81 36 77 56C74 76 61 86 44 82C28 79 19 69 19 51Z" className={styles.strokeFill} />
        <circle cx="36" cy="48" r="5" />
        <circle cx="59" cy="49" r="5" />
        <path d="M43 61C47 65 53 65 57 61" className={styles.strokeOnly} />
        <path d="M22 57C13 59 10 68 16 74C21 80 31 75 31 64" className={styles.strokeFill} />
      </svg>
    );
  }

  if (kind === "dumbbell") {
    return (
      <svg viewBox="0 0 96 96" role="presentation">
        <rect x="14" y="36" width="16" height="26" rx="6" className={styles.strokeFill} />
        <rect x="66" y="36" width="16" height="26" rx="6" className={styles.strokeFill} />
        <rect x="28" y="42" width="40" height="14" rx="7" className={styles.strokeFillLight} />
        <path d="M34 49H62" className={styles.strokeOnly} />
      </svg>
    );
  }

  if (kind === "mat") {
    return (
      <svg viewBox="0 0 96 96" role="presentation">
        <path d="M19 30H66C75 30 82 37 82 46V64C82 72 75 78 67 78H29C21 78 14 71 14 63V35C14 32 16 30 19 30Z" className={styles.strokeFill} />
        <path d="M66 30C60 31 56 35 56 43V58C56 70 64 77 72 76" className={styles.strokeOnly} />
        <path d="M26 43H48M26 55H48M26 67H54" className={styles.strokeOnlyThin} />
      </svg>
    );
  }

  if (kind === "bottle") {
    return (
      <svg viewBox="0 0 96 96" role="presentation">
        <path d="M39 14H57V26L64 36V78C64 84 59 88 53 88H43C37 88 32 84 32 78V36L39 26V14Z" className={styles.strokeFill} />
        <path d="M39 14H57M35 44H61M35 61H61" className={styles.strokeOnly} />
        <path d="M43 25H53" className={styles.strokeOnlyThin} />
      </svg>
    );
  }

  if (kind === "medal") {
    return (
      <svg viewBox="0 0 96 96" role="presentation">
        <path d="M33 14L46 39M63 14L50 39" className={styles.strokeOnly} />
        <circle cx="48" cy="58" r="23" className={styles.strokeFill} />
        <path d="M48 45L52 54L62 55L55 62L57 72L48 67L39 72L41 62L34 55L44 54Z" className={styles.strokeFillLight} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 96 96" role="presentation">
      <ellipse cx="31" cy="31" rx="9" ry="12" className={styles.strokeFill} />
      <ellipse cx="48" cy="24" rx="9" ry="12" className={styles.strokeFill} />
      <ellipse cx="65" cy="31" rx="9" ry="12" className={styles.strokeFill} />
      <ellipse cx="38" cy="61" rx="14" ry="16" className={styles.strokeFill} />
      <ellipse cx="59" cy="61" rx="14" ry="16" className={styles.strokeFill} />
    </svg>
  );
}
