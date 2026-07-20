import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-label-md font-sans",
  {
    variants: {
      variant: {
        status: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
        primary: "bg-primary-container text-on-primary-container",
        neutral: "bg-secondary-container text-on-secondary-container",
        outline: "border border-outline-variant text-on-surface-variant",
      },
    },
    defaultVariants: {
      variant: "status",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
