
import { services } from "@/lib/data";
import { ServiceTableClient } from "@/components/admin/service-table-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminServicesPage() {
  const allServices = services;

  return (
    <div className="flex flex-col gap-4">
       <h1 className="text-2xl font-bold tracking-tight">Gestion des services</h1>
       <Card>
            <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>Gérer les services et leurs descriptions.</CardDescription>
            </CardHeader>
            <CardContent>
                <ServiceTableClient initialServices={allServices} />
            </CardContent>
       </Card>
    </div>
  );
}
