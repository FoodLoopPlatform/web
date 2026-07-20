import { cn } from "@/lib/cn";

type ListRootProps = React.ComponentProps<"ul">;

export function ListRoot({ className, ...props }: ListRootProps) {
  return (
    <ul
      className={cn(
        "flex list-none flex-col divide-y divide-outline-variant/40",
        className,
      )}
      {...props}
    />
  );
}
