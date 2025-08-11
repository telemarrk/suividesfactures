import { Workflow } from "lucide-react";

export function Logo({ isLoginPage = false }: { isLoginPage?: boolean }) {
  return (
    <div className="flex items-center gap-2 font-semibold text-lg">
      <Workflow className="h-7 w-7 text-primary" />
       {isLoginPage ? (
        <span className="text-2xl font-bold">Suivi des Factures</span>
      ) : (
        <span className="hidden md:block">Suivi des Factures</span>
      )}
    </div>
  );
}
