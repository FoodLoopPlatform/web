const links = [
  { label: "سياسة الخصوصية", href: "#" },
  { label: "شروط الخدمة", href: "#" },
  { label: "تواصل مع الدعم", href: "#" },
];

export function RegisterFooter() {
  return (
    <footer className="flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest px-margin-mobile py-6 md:px-margin-desktop">
      <p className="text-label-md text-on-surface-variant">
        © 2026 FoodLoop للخدمات اللوجستية. جميع الحقوق محفوظة.
      </p>
      <nav className="flex items-center gap-stack-md">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-body-md text-link opacity-80 transition-opacity hover:opacity-100"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
