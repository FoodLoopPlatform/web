import { cn } from "@/lib/cn";

type ListItemProps = React.ComponentProps<"li"> & {
  icon?: React.ReactNode;
};

/**
 * Icon is rendered first in DOM order so it lands at the inline-start
 * edge — the right side under the default `dir="rtl"` flow.
 */
export function ListItem({
  className,
  icon,
  children,
  ...props
}: ListItemProps) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 py-stack-sm text-body-md text-on-surface",
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="flex shrink-0 items-center justify-center text-primary">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
    </li>
  );
}
