"use client";

import { Map } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingMapButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
}

export function FloatingMapButton({ 
  onClick, 
  className,
  label = "Map" 
}: FloatingMapButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn("floating-map-btn", className)}
    >
      <Map className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
