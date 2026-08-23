"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { LeafIcon } from "@/components/icons";

interface BrandMarkProps {
  href?: string;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  showLeaf?: boolean;
}

/**
 * Standard FoodLoop Brand Logo Component.
 * - Displays "FoodLoop" text FIRST (left side) in dark green (#00381a).
 * - Displays LeafIcon SECOND (right side) in matching dark green (#00381a / #005129).
 * - Fully clickable and redirects to the landing page ("/").
 */
export function BrandMark({
  href = "/",
  className,
  textClassName,
  iconClassName,
  showLeaf = true,
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      dir="ltr"
      lang="en"
      onClick={(e) => {
        if (
          typeof window !== "undefined" &&
          window.location.pathname === href &&
          href === "/"
        ) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className={cn(
        "inline-flex flex-row items-center gap-2 sm:gap-2.5 text-[#00381a] group focus:outline-hidden whitespace-nowrap shrink-0 select-none cursor-pointer p-1 rounded-xl transition-all",
        className,
      )}
      aria-label="FoodLoop Home"
      title="FoodLoop Home"
    >
      <span
        className={cn(
          "text-2xl sm:text-3xl font-extrabold font-brand tracking-tight text-[#00381a] group-hover:text-[#005129] transition-colors duration-300 shrink-0 whitespace-nowrap leading-none",
          textClassName,
        )}
      >
        FoodLoop
      </span>
      {showLeaf && (
        <LeafIcon
          className={cn(
            "w-7 sm:w-8 h-7 sm:h-8 aspect-square text-[#00381a] group-hover:text-[#005129] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shrink-0 drop-shadow-2xs",
            iconClassName,
          )}
        />
      )}
    </Link>
  );
}
