import Link from "next/link";
import { ArrowForwardIcon } from "@/components/icons/arrow-forward-icon";

type BackButtonProps = {
  href: string;
  label?: string;
};

export function BackButton({ href, label = "رجوع" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center gap-2 text-label-md font-medium text-on-surface-variant transition-colors hover:text-primary mb-4"
    >
      <ArrowForwardIcon className="h-4 w-4 rotate-180" />
      {label}
    </Link>
  );
}
