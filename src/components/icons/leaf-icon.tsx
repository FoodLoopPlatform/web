type IconProps = React.ComponentProps<"svg">;

export function LeafIcon(props: IconProps) {
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
      <path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 9-10 1 5 4 6 4 10a7 7 0 0 1-6 7Z" />
      <path d="M8 14c3-2 5-4 8-8" />
    </svg>
  );
}
