import { cn } from "@/lib/cn";

type BottomNavItemProps = React.ComponentProps<"a"> & {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

export function BottomNavItem({
  className,
  icon,
  label,
  active = false,
  ...props
}: BottomNavItemProps) {
  return (
    <a
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1 rounded-md py-2 text-label-md font-medium transition-colors",
        active
          ? "text-primary"
          : "text-on-surface-variant hover:text-on-surface",
        className,
      )}
      {...props}
    >
      <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
      {label}
    </a>
  );
}
