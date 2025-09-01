
import { services } from "@/lib/data";
import { ServiceTableClient } from "@/components/admin/service-table-client";

export default function AdminServicesPage() {
  const allServices = services;

  return (
    <div className="flex flex-col gap-4">
       <h1 className="text-2xl font-bold tracking-tight">Gestion des services</h1>
       <ServiceTableClient initialServices={allServices} />
    </div>
  );
}
