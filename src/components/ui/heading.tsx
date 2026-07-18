import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const headingVariants = cva("font-sans text-on-surface", {
  variants: {
    level: {
      lg: "text-headline-lg-mobile md:text-headline-lg",
      md: "text-headline-md",
    },
  },
  defaultVariants: {
    level: "md",
  },
});

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = Omit<React.ComponentProps<"h1">, "children"> &
  VariantProps<typeof headingVariants> & {
    as?: HeadingTag;
    children: React.ReactNode;
  };

export function Heading({
  className,
  level,
  as: Tag = "h2",
  ...props
}: HeadingProps) {
  return (
    <Tag className={cn(headingVariants({ level }), className)} {...props} />
  );
}
