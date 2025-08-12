
"use client";

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { invoices as defaultInvoices } from "@/lib/data"
import { CheckCircle2, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import type { Invoice } from "@/lib/types"

const INVOICES_STORAGE_KEY = "app_invoices";

export default function HistoryPage() {
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
      const storedInvoices = localStorage.getItem(INVOICES_STORAGE_KEY);
      if (storedInvoices) {
          setAllInvoices(JSON.parse(storedInvoices));
      } else {
          setAllInvoices(defaultInvoices);
      }
  }, []);

  const completedInvoices = allInvoices.filter(
    (invoice) => invoice.status === "Mandatée" || invoice.status === "Rejetée"
  );

  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Historique des factures</h1>
        <Card>
            <CardHeader>
            <CardTitle>Factures traitées</CardTitle>
            <CardDescription>
                Liste de toutes les factures qui ont terminé le cycle de validation.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Nom du fichier</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Statut Final</TableHead>
                    <TableHead className="text-right">Date de finalisation</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {completedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.fileName}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{invoice.service}</Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant={invoice.status === "Mandatée" ? "default" : "destructive"} className={invoice.status === "Mandatée" ? "bg-accent text-accent-foreground" : ""}>
                         {invoice.status === "Mandatée" ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                        {invoice.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        {new Date(invoice.lastUpdated).toLocaleDateString()}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    </div>
  )
}
