"use client";

// A small fade-up-into-view wrapper.
//
// Deliberately restrained: only 8px of travel, only 0.4s, only once per
// element. The point isn't to *show* an animation — it's to settle a block
// into the page so the eye knows where it landed. Anything bigger would
// read as a generic Framer Motion flourish.

import { motion } from "motion/react";
import { useEffectiveReducedMotion } from "@/components/MotionPreference";

type Props = {
  children: React.ReactNode;
  /** Stagger helper — delay in seconds. */
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: Props) {
  const reduced = useEffectiveReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
