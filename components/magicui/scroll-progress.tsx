"use client";

import { cn } from "@/lib/utils";
import { motion, MotionProps, useScroll, useSpring, useTransform } from "motion/react";
import React from "react";

interface ScrollProgressProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {}

export const ScrollProgress = React.forwardRef<
  HTMLDivElement,
  ScrollProgressProps
>(({ className, ...props }, ref) => {
  const { scrollYProgress } = useScroll();
  
  // Clamp the scroll progress between 0 and 1 and add smooth spring animation
  const smoothProgress = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true }),
    { stiffness: 300, damping: 30, restDelta: 0.001 }
  );

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]",
        className,
      )}
      style={{
        scaleX: smoothProgress,
      }}
      {...props}
    />
  );
});

ScrollProgress.displayName = "ScrollProgress";
