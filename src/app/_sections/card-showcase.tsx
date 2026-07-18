import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPinIcon } from "@/components/icons/map-pin-icon";

export function CardShowcase() {
  return (
    <section className="flex flex-col gap-stack-sm">
      <Heading as="h2" level="md">
        البطاقات
      </Heading>
      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2">
        <Card.Root variant="interactive">
          <Card.Media className="h-40 bg-gradient-to-bl from-primary-container to-secondary-container" />
          <Card.Body>
            <Badge variant="status" className="w-fit">
              عضوي
            </Badge>
            <Card.Title>صندوق خضروات موسمية</Card.Title>
            <Card.Description>
              مجموعة طازجة من المزارع المحلية، تُحصد يوميًا وتُسلّم في نفس
              اليوم.
            </Card.Description>
            <div className="flex items-center gap-1 text-label-md text-on-surface-variant">
              <MapPinIcon className="h-4 w-4" />
              على بعد 2 كم
            </div>
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" size="sm" className="flex-1">
              أضف إلى السلة
            </Button>
          </Card.Footer>
        </Card.Root>

        <Card.Root>
          <Card.Body>
            <Card.Title>الاستدامة أولاً</Card.Title>
            <Card.Description>
              كل عملية تسليم تقلل من هدر الطعام وتدعم شبكة استزراع محلية
              متنامية.
            </Card.Description>
          </Card.Body>
        </Card.Root>
      </div>
    </section>
  );
}
