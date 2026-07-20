import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const textVariants = cva("font-sans", {
  variants: {
    variant: {
      "body-lg": "text-body-lg text-on-surface",
      "body-md": "text-body-md text-on-surface",
      "label-md": "text-label-md text-on-surface-variant",
    },
  },
  defaultVariants: {
    variant: "body-md",
  },
});

type TextTag = "p" | "span" | "div";

type TextProps = Omit<React.ComponentProps<"p">, "children"> &
  VariantProps<typeof textVariants> & {
    as?: TextTag;
    children: React.ReactNode;
  };

export function Text({
  className,
  variant,
  as: Tag = "p",
  ...props
}: TextProps) {
  return (
    <Tag className={cn(textVariants({ variant }), className)} {...props} />
  );
}
