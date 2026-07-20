import { cn } from "@/lib/cn";

type CardMediaProps = React.ComponentProps<"div">;

/**
 * Edge-to-edge media slot. For a horizontal (image-beside-text) layout,
 * wrap `Card.Media` and `Card.Body` in a `flex` row on `Card.Root` and
 * override rounding with logical utilities (e.g. `rounded-s-lg rounded-e-none`)
 * so it mirrors correctly under RTL.
 */
export function CardMedia({ className, ...props }: CardMediaProps) {
  return (
    <div
      className={cn(
        "[&>img]:h-full [&>img]:w-full [&>img]:object-cover",
        className,
      )}
      {...props}
    />
  );
}
