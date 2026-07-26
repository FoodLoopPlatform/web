import { TopAppBar } from "../register/components/top-app-bar";
import { RegisterFooter } from "../register/components/register-footer";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <TopAppBar />
      <main className="flex flex-1 items-center justify-center px-margin-mobile py-stack-lg md:px-margin-desktop">
        {children}
      </main>
      <RegisterFooter />
    </div>
  );
}
