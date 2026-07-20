type IconProps = React.ComponentProps<"svg">;

export function StoreIcon(props: IconProps) {
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
      <path d="M4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9" />
      <path d="M3 5h18l1.2 4a2.5 2.5 0 0 1-4.9 1 2.5 2.5 0 0 1-4.9 0 2.5 2.5 0 0 1-4.8 0 2.5 2.5 0 0 1-4.9-1L3 5Z" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}
