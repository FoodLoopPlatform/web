import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const cardRootVariants = cva(
  "overflow-hidden rounded-lg border border-card-border shadow-elevation-2",
  {
    variants: {
      variant: {
        static: "",
        interactive:
          "transition-shadow duration-200 hover:shadow-elevation-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      },
    },
    defaultVariants: {
      variant: "static",
    },
  },
);

type CardRootProps = React.ComponentProps<"div"> &
  VariantProps<typeof cardRootVariants>;

export function CardRoot({ className, variant, ...props }: CardRootProps) {
  return (
    <div className={cn(cardRootVariants({ variant }), className)} {...props} />
  );
}
