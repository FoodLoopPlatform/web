type IconProps = React.ComponentProps<"svg">;

export function PlayCircleIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9.5" />
      <polygon points="10 8 15.5 12 10 16 10 8" fill="currentColor" />
    </svg>
  );
}
