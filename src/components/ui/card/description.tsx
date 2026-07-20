import { cn } from "@/lib/cn";

type CardDescriptionProps = React.ComponentProps<"p">;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn("text-body-md text-on-surface-variant", className)}
      {...props}
    />
  );
}
