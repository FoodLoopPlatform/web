type IconProps = React.ComponentProps<"svg">;

export function UploadCloudIcon(props: IconProps) {
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
      <path d="M7 18a4.5 4.5 0 0 1-1-8.9 5.5 5.5 0 0 1 10.7-2A4.5 4.5 0 0 1 17 18H7Z" />
      <path d="M12 21v-8" />
      <path d="m9 15.5 3-3 3 3" />
    </svg>
  );
}
