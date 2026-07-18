import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 rounded-md text-label-md font-sans transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-primary hover:bg-on-primary-fixed-variant text-white",
        secondary:
          "bg-secondary-container text-on-secondary-container hover:bg-surface-container-highest",
        outline:
          "border border-outline text-on-surface bg-transparent hover:bg-surface-container-low",
        ghost: "bg-transparent text-primary hover:bg-surface-container-low",
      },
      size: {
        sm: "h-9 px-3 text-label-md",
        md: "h-11 px-5",
        lg: "h-13 px-6 text-body-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  };

export function Button({
  className,
  variant,
  size,
  startIcon,
  endIcon,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
}
