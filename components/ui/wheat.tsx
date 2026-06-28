"use client";

import React from "react";
import { motion, MotionValue, useTransform, useSpring } from "framer-motion"; // 👈 Added useSpring
import Image from "next/image";

interface WheatScrollWrapperProps {
  scrollProgress: MotionValue<number>;
  side: "left" | "right";
}

export function WheatScrollWrapper({
  scrollProgress,
  side,
}: WheatScrollWrapperProps) {
  // 1. Keep your original linear progress ranges
  const rawRotate = useTransform(
    scrollProgress,
    [0.0, 0.4],
    [side === "left" ? -75 : 75, 0],
  );
  const rawY = useTransform(scrollProgress, [0.0, 0.4], [100, 0]);

  // 2. 🔥 THE MAGIC: Wrap them in useSpring to inject physics properties!
  const springConfig = {
    stiffness: 90, // Higher = snappier, faster snap back
    damping: 15, // Lower = more bounces, Higher = less wobble
    mass: 0.8, // Heavy weights take longer to slow down
    restDelta: 0.001,
  };

  const rotateValue = useSpring(rawRotate, springConfig);
  const yValue = useSpring(rawY, springConfig);

  return (
    <motion.div
      style={{
        rotate: rotateValue, // Uses spring dynamics now!
        y: yValue,
        transformOrigin: side === "left" ? "bottom left" : "bottom right",
      }}
      className="w-75 md:w-112.5 h-auto pointer-events-none select-none"
    >
      <Image
        width={450}
        height={450}
        src="/wheat.svg"
        alt="Wheat decorative element"
        className={`w-full h-auto ${side === "right" ? "scale-x-[-1]" : ""}`}
      />
    </motion.div>
  );
}
