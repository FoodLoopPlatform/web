"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { resolveImageUrl } from "@/utils/image-utils";

interface PricingProductImageProps {
  src?: string | null;
  alt: string;
  sizes?: string;
  containerClassName?: string;
  className?: string;
  iconClassName?: string;
  fallbackIcon?: string;
}

/**
 * Renders a product image resolved from the backend response body.
 * If no image is provided or if the image fails to load, renders a clean,
 * modern icon placeholder instead of a dummy image.
 */
export function PricingProductImage({
  src,
  alt,
  sizes = "80px",
  containerClassName = "h-16 w-16 rounded-xl overflow-hidden bg-[#ecefe8] border border-outline-variant/20 shrink-0 relative flex items-center justify-center",
  className = "object-cover",
  iconClassName = "h-7 w-7 text-primary/40",
  fallbackIcon = "inventory_2",
}: PricingProductImageProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  const resolved = resolveImageUrl(src);

  return (
    <div className={containerClassName}>
      {resolved && !hasError ? (
        <Image
          src={resolved}
          alt={alt || "صورة المنتج"}
          fill
          sizes={sizes}
          className={className}
          unoptimized={
            resolved.startsWith("http://") ||
            resolved.startsWith("https://") ||
            resolved.startsWith("data:") ||
            resolved.startsWith("blob:")
          }
          onError={() => setHasError(true)}
        />
      ) : (
        <Icon name={fallbackIcon} className={iconClassName} />
      )}
    </div>
  );
}
