type IconProps = React.ComponentProps<"svg">;

export function HelpCircleIcon(props: IconProps) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.3a2.5 2.5 0 0 1 4.8 1c0 1.7-2.3 1.9-2.3 3.5" />
      <path d="M12 17.25v.01" />
    </svg>
  );
}
