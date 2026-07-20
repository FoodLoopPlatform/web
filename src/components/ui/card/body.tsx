import { cn } from "@/lib/cn";

type CardBodyProps = React.ComponentProps<"div">;

export function CardBody({ className, ...props }: CardBodyProps) {
  return (
    <div className={cn("flex flex-col gap-2 p-gutter", className)} {...props} />
  );
}
