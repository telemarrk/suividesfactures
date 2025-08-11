import { invoices } from "@/lib/data";
import { InvoiceTableClient } from "@/components/dashboard/invoice-table-client";

export default function Dashboard() {
  // In a real app, you'd fetch this data from an API.
  const allInvoices = invoices;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
      <InvoiceTableClient initialInvoices={allInvoices} />
    </div>
  );
}
