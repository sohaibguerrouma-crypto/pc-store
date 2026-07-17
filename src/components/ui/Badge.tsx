"use client";

import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type { ReactNode } from "react";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white/10 text-white border border-white/10",
        amd: "bg-amd/20 text-amd border border-amd/30 shadow-[0_0_12px_rgba(237,28,36,0.15)]",
        nvidia: "bg-nvidia/20 text-nvidia border border-nvidia/30 shadow-[0_0_12px_rgba(118,185,0,0.15)]",
        intel: "bg-intel/20 text-intel border border-intel/30 shadow-[0_0_12px_rgba(0,113,197,0.15)]",
        success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
        danger: "bg-red-500/20 text-red-400 border border-red-500/30",
        outOfStock: "bg-white/5 text-white/40 border border-white/10",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: ReactNode;
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({
  className,
  variant,
  size,
  children,
  dot = false,
  pulse = false,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "ml-1.5 inline-block h-1.5 w-1.5 rounded-full",
            pulse && "animate-pulse",
            variant === "success" && "bg-emerald-400",
            variant === "warning" && "bg-amber-400",
            variant === "danger" && "bg-red-400",
            variant === "outOfStock" && "bg-white/30",
            variant === "amd" && "bg-amd",
            variant === "nvidia" && "bg-nvidia",
            variant === "intel" && "bg-intel",
            variant === "default" && "bg-white/60"
          )}
        />
      )}
      {children}
    </span>
  );
}
