
import React from "react";
import { cn } from "@/lib/utils";

interface GlassMorphismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "light" | "dark";
  className?: string;
  hoverEffect?: boolean;
  glowEffect?: boolean;
  gradientBorder?: boolean;
}

const GlassMorphismCard = ({
  children,
  variant = "dark",
  className,
  hoverEffect = false,
  glowEffect = false,
  gradientBorder = false,
  ...props
}: GlassMorphismCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden relative",
        variant === "light" ? "glass" : "glass-dark",
        hoverEffect && "hover-lift transition-all duration-300",
        glowEffect && "before:absolute before:inset-0 before:bg-gradient-radial before:from-primary/20 before:to-transparent before:opacity-0 before:transition-opacity",
        glowEffect && "hover:before:opacity-100",
        gradientBorder && "border border-transparent bg-clip-padding p-[1px]",
        gradientBorder && "before:absolute before:inset-0 before:-z-10 before:p-[1px] before:rounded-xl before:bg-gradient-to-r before:from-primary/30 before:via-secondary/30 before:to-primary/30",
        className
      )}
      {...props}
    >
      {gradientBorder ? (
        <div className="h-full w-full glass-dark rounded-xl p-6">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default GlassMorphismCard;
