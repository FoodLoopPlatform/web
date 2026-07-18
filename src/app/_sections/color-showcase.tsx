import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

const swatches = [
  { label: "Primary", className: "bg-primary text-on-primary" },
  {
    label: "Primary Container",
    className: "bg-primary-container text-on-primary-container",
  },
  { label: "Secondary", className: "bg-secondary text-on-secondary" },
  {
    label: "Secondary Container",
    className: "bg-secondary-container text-on-secondary-container",
  },
  { label: "Tertiary", className: "bg-tertiary text-on-tertiary" },
  {
    label: "Tertiary Fixed",
    className: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  },
  { label: "Error", className: "bg-error text-on-error" },
  {
    label: "Surface Container High",
    className: "bg-surface-container-high text-on-surface",
  },
];

export function ColorShowcase() {
  return (
    <section className="flex flex-col gap-stack-sm">
      <Heading as="h2" level="md">
        الألوان
      </Heading>
      <Text variant="body-md" className="text-on-surface-variant">
        نظام ألوان متجذر في الأخضر الغابي العميق، بدعم من محايد أخضر فاتح وذهبي
        &ldquo;أشعة الشمس&rdquo; للحالات التفاعلية.
      </Text>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {swatches.map((swatch) => (
          <div
            key={swatch.label}
            className={`flex h-20 flex-col justify-end rounded-md p-3 text-label-md ${swatch.className}`}
          >
            {swatch.label}
          </div>
        ))}
      </div>
    </section>
  );
}
