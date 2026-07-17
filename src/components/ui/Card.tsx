"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: "lift" | "glow" | "none";
  brand?: "amd" | "nvidia" | "intel" | null;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  hover = "lift",
  brand = null,
  onClick,
}: CardProps) {
  const brandBorder =
    brand === "amd"
      ? "hover:border-amd/40"
      : brand === "nvidia"
        ? "hover:border-nvidia/40"
        : brand === "intel"
          ? "hover:border-intel/40"
          : "hover:border-white/20";

  const brandShadow =
    brand === "amd"
      ? "hover:shadow-[0_0_30px_rgba(237,28,36,0.1)]"
      : brand === "nvidia"
        ? "hover:shadow-[0_0_30px_rgba(118,185,0,0.1)]"
        : brand === "intel"
          ? "hover:shadow-[0_0_30px_rgba(0,113,197,0.1)]"
          : "hover:shadow-[0_8px_32px_rgba(255,255,255,0.05)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={
        hover === "lift"
          ? { y: -6, transition: { duration: 0.3 } }
          : hover === "glow"
            ? { scale: 1.02, transition: { duration: 0.3 } }
            : undefined
      }
      onClick={onClick}
      className={cn(
        "glass rounded-2xl overflow-hidden transition-all duration-300",
        hover !== "none" && brandBorder,
        hover !== "none" && brandShadow,
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-5 pb-0", className)}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-5", className)}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-t border-white/5 p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
