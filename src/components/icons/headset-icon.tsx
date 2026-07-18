type IconProps = React.ComponentProps<"svg">;

export function HeadsetIcon(props: IconProps) {
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
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="2.5" y="13" width="5" height="7" rx="2" />
      <rect x="16.5" y="13" width="5" height="7" rx="2" />
      <path d="M19.5 20a4.5 4.5 0 0 1-4.5 3h-2" />
    </svg>
  );
}
