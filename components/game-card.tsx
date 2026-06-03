"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import clsx from "clsx";

type GameCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function GameCard({ children, className, delay = 0 }: GameCardProps) {
  return (
    <motion.section
      className={clsx("toy-card", className)}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.42, ease: [0.2, 0.9, 0.18, 1] }}
      whileHover={{ y: -4 }}
    >
      {children}
    </motion.section>
  );
}
