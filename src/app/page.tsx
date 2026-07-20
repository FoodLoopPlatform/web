import { BrandMark } from "@/components/ui/brand-mark";
import { Text } from "@/components/ui/text";
import { BottomNav } from "@/components/ui/bottom-nav";
import { HomeIcon } from "@/components/icons/home-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import { BagIcon } from "@/components/icons/bag-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { ColorShowcase } from "./_sections/color-showcase";
import { TypographyShowcase } from "./_sections/typography-showcase";
import { ButtonShowcase } from "./_sections/button-showcase";
import { BadgeShowcase } from "./_sections/badge-showcase";
import { CardShowcase } from "./_sections/card-showcase";
import { FormShowcase } from "./_sections/form-showcase";
import { ListShowcase } from "./_sections/list-showcase";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-outline-variant px-margin-mobile py-4 md:px-margin-desktop">
        <BrandMark />
        <Text variant="label-md" className="text-on-surface-variant">
          نظام التصميم
        </Text>
      </header>

      <main className="flex flex-1 flex-col gap-stack-lg px-margin-mobile py-stack-lg md:px-margin-desktop">
        <ColorShowcase />
        <TypographyShowcase />
        <ButtonShowcase />
        <BadgeShowcase />
        <CardShowcase />
        <FormShowcase />
        <ListShowcase />
      </main>

      <BottomNav.Root>
        <BottomNav.Item
          href="#"
          icon={<HomeIcon className="h-full w-full" />}
          label="الرئيسية"
          active
        />
        <BottomNav.Item
          href="#"
          icon={<SearchIcon className="h-full w-full" />}
          label="بحث"
        />
        <BottomNav.Item
          href="#"
          icon={<BagIcon className="h-full w-full" />}
          label="السلة"
        />
        <BottomNav.Item
          href="#"
          icon={<UserIcon className="h-full w-full" />}
          label="حسابي"
        />
      </BottomNav.Root>
    </div>
  );
}
