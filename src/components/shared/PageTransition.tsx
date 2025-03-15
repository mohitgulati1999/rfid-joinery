
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  mode?: "fade" | "slide-up" | "slide-down" | "none";
}

const PageTransition = ({
  children,
  className,
  mode = "fade",
}: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const getAnimationClass = () => {
    if (mode === "none") return "";
    if (mode === "slide-up") return isVisible ? "animate-slide-up" : "opacity-0 translate-y-4";
    if (mode === "slide-down") return isVisible ? "animate-slide-down" : "opacity-0 -translate-y-4";
    return isVisible ? "animate-fade-in" : "opacity-0";
  };

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        getAnimationClass(),
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageTransition;
