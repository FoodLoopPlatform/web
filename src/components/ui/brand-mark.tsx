import { cn } from "@/lib/cn";

type BrandMarkProps = React.ComponentProps<"span">;

/**
 * "FoodLoop" stays in Latin script to preserve global brand equity,
 * embedded inline within the surrounding RTL flow.
 */
export function BrandMark({ className, children, ...props }: BrandMarkProps) {
  return (
    <span
      dir="ltr"
      lang="en"
      className={cn(
        "inline-block font-brand text-brand-mark text-primary",
        className,
      )}
      {...props}
    >
      {children ?? "FoodLoop"}
    </span>
  );
}
