"use client";

import React from "react";

interface ConfirmOrderButtonProps {
  orderId: string;
  label: string;
  onConfirmOrder?: (id: string) => void;
}

export function ConfirmOrderButton({
  orderId,
  label,
  onConfirmOrder,
}: ConfirmOrderButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onConfirmOrder?.(orderId)}
      className="w-full py-2 px-3 rounded-xl bg-[#0B3C26] hover:bg-primary text-white font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
    >
      {label}
    </button>
  );
}
