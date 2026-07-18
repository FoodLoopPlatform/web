import { cn } from "@/lib/cn";

type CardFooterProps = React.ComponentProps<"div">;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn("flex items-center gap-2 px-gutter pb-gutter", className)}
      {...props}
    />
  );
}
