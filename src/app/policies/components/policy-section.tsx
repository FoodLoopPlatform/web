import { Heading } from "@/components/ui/heading";

export function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <Heading as="h2" level="md" className="text-primary">
        {title}
      </Heading>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}
