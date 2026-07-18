import { LeafIcon } from "@/components/icons/leaf-icon";

export function RegisterDivider() {
  return (
    <div className="flex items-center justify-center gap-stack-md pt-stack-lg opacity-20">
      <span className="h-px w-24 bg-outline-variant" />
      <LeafIcon className="h-4 w-4 text-outline-variant" />
      <span className="h-px w-24 bg-outline-variant" />
    </div>
  );
}
