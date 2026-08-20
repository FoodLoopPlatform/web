import React from "react";

type IconProps = React.ComponentProps<"svg">;

export function LeafIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 16.8C6.0 10.8 9.5 5.0 18.2 4.5C18.2 13.2 14.5 18.2 8.2 18.2C7.5 18.2 6.9 17.7 6.5 16.8ZM6.5 16.8C8.2 14.0 10.5 11.5 13.8 9.5C10.2 12.5 8.2 15.0 6.5 16.8Z"
      />
    </svg>
  );
}
