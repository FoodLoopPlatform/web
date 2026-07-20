import { cn } from "@/lib/cn";

type CardTitleProps = React.ComponentProps<"h3">;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn("text-body-lg font-semibold text-on-surface", className)}
      {...props}
    />
  );
}
