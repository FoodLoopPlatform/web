import { cn } from "@/lib/cn";

type BottomNavRootProps = React.ComponentProps<"nav">;

export function BottomNavRoot({ className, ...props }: BottomNavRootProps) {
  return (
    <nav
      aria-label="التنقل الرئيسي"
      className={cn(
        "sticky inset-x-0 bottom-0 flex items-stretch justify-around border-t border-outline-variant bg-surface-container-lowest px-2 py-1 md:hidden",
        className,
      )}
      {...props}
    />
  );
}
