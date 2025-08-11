import { Workflow } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-semibold text-lg">
      <Workflow className="h-7 w-7 text-primary" />
      <span className="hidden md:block">FacturFlow</span>
    </div>
  );
}
