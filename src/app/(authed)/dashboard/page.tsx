

import { InvoiceTableClient } from "@/components/dashboard/invoice-table-client";
import { invoices } from "@/lib/data";

export default function Dashboard() {
  // We pass default invoices as a fallback.
  // The actual data will be fetched client-side.
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
      <InvoiceTableClient initialInvoices={invoices} />
    </div>
  );
}
