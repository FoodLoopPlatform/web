import { Text } from "@/components/ui/text";

export function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="body-lg" className="text-on-surface-variant">
      {children}
    </Text>
  );
}
