import React from "react";

type IconProps = React.ComponentProps<"svg">;

export function SparklesIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
      <path d="M5 3 4 6 1 7l3 1 1 3 1-3 3-1-3-1-1-3z" />
      <path d="M19 17l-1 3-3 1 3 1 1 3 1-3 3-1-3-1-1-3z" />
    </svg>
  );
}
