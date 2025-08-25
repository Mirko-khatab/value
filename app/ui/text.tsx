"use client";

import { useTheme } from "@/app/lib/theme-context";
import { cn } from "@/app/lib/utils";

interface TextProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "default";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  className?: string;
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export default function Text({
  children,
  variant = "default",
  size = "base",
  weight = "normal",
  className,
  as: Component = "p",
  ...props
}: TextProps) {
  const { colors } = useTheme();

  const variantColors = {
    primary: `text-[${colors.primary}]`,
    secondary: `text-[${colors.secondary}]`,
    tertiary: `text-[${colors.tertiary}]`,
    default: `text-[${colors.text}]`,
  };

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  };

  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  return (
    <Component
      className={cn(
        variantColors[variant],
        sizeClasses[size],
        weightClasses[weight],
        "transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
