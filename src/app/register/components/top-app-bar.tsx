import { BrandMark } from "@/components/ui/brand-mark";

export function TopAppBar() {
  return (
    <header className="flex items-center justify-between bg-surface px-margin-mobile py-4 md:px-margin-desktop border-b border-outline-variant">
      <BrandMark />
    </header>
  );
}
