"use client";

// Tiny wrapper that fades + lifts its children as they scroll into view.
// Reused across the home page for cheap, consistent reveal animations.
//
// `once: true` means the animation runs the first time the element is
// scrolled to and never replays — that matches the way most sites feel.

import { motion } from "motion/react";

type Props = {
  children: React.ReactNode;
  /** Stagger helper — delay in seconds. */
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
