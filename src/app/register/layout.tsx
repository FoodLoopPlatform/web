import { TopAppBar } from "./components/top-app-bar";
import { RegisterFooter } from "./components/register-footer";
import { RegisterFlowProvider } from "./lib/register-flow-context";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RegisterFlowProvider>
      <div className="flex min-h-full flex-1 flex-col bg-surface">
        <TopAppBar />
        <main className="flex flex-1 items-center justify-center px-margin-mobile py-stack-lg md:px-margin-desktop">
          {children}
        </main>
        <RegisterFooter />
      </div>
    </RegisterFlowProvider>
  );
}
