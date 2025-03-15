
import React from "react";
import { cn } from "@/lib/utils";

interface GlassMorphismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "light" | "dark";
  className?: string;
  hoverEffect?: boolean;
  glowEffect?: boolean;
}

const GlassMorphismCard = ({
  children,
  variant = "light",
  className,
  hoverEffect = false,
  glowEffect = false,
  ...props
}: GlassMorphismCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden relative",
        variant === "light" ? "glass" : "glass-dark",
        hoverEffect && "hover-lift transition-all duration-300",
        glowEffect && "before:absolute before:inset-0 before:bg-gradient-radial before:from-primary/20 before:to-transparent before:opacity-0 before:transition-opacity",
        glowEffect && "hover:before:opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassMorphismCard;
