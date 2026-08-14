"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";

interface ExportOrdersButtonProps {
  label: string;
  onClick?: () => void;
}

export function ExportOrdersButton({
  label,
  onClick,
}: ExportOrdersButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-card-border hover:bg-surface-container-low text-on-surface font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
    >
      <Icon name="download" className="w-4 h-4 text-primary" />
      <span>{label}</span>
    </button>
  );
}
