type IconProps = React.ComponentProps<"svg">;

/**
 * Points toward the reading-forward direction under `dir="rtl"` (left),
 * matching this app's default direction rather than a mirrored LTR arrow.
 */
export function ArrowForwardIcon(props: IconProps) {
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
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  );
}
