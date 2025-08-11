"use client";

import React, { useState } from "react";
import { MoreHorizontal, FileText, CheckCircle2, XCircle, Clock, Send, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CommentsDrawer } from "./comments-drawer";
import type { Invoice, InvoiceStatus } from "@/lib/types";

interface InvoiceTableClientProps {
  initialInvoices: Invoice[];
}

const statusConfig: Record<
  InvoiceStatus,
  { icon: React.ElementType; color: "default" | "secondary" | "destructive" | "outline" | "accent" | "success" | "warning"; label: string }
> = {
  "En attente de validation Commande Publique": { icon: Clock, color: "warning", label: "Attente Commande Publique" },
  "En attente de validation Service": { icon: Clock, color: "warning", label: "Attente Service" },
  "En attente de mandatement": { icon: Clock, color: "warning", label: "Attente Mandatement" },
  "Mandatée": { icon: CheckCircle2, color: "success", label: "Mandatée" },
  "Rejetée": { icon: XCircle, color: "destructive", label: "Rejetée" },
};

const CustomBadge = ({ color, children, ...props }: { color: string, children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => {
  const badgeClasses: { [key: string]: string } = {
    success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700',
  };
  return <Badge {...props} className={badgeClasses[color] || ''}>{children}</Badge>;
}


export function InvoiceTableClient({ initialInvoices }: InvoiceTableClientProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewComments = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedInvoice(null);
  };
  
  const handleAction = (invoiceId: string, action: "approve" | "reject") => {
    // This is a mock function. In a real app, this would be a server action.
    console.log(`Invoice ${invoiceId} action: ${action}`);
  };


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Factures en attente</CardTitle>
          <CardDescription>
            Liste des factures nécessitant une action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Type</span>
                </TableHead>
                <TableHead>Nom du fichier</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.filter(inv => inv.status !== 'Mandatée' && inv.status !== 'Rejetée').map((invoice) => {
                const config = statusConfig[invoice.status];
                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="hidden sm:table-cell">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">{invoice.fileName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{invoice.service}</Badge>
                    </TableCell>
                    <TableCell>
                       <CustomBadge color={config.color}>
                          <div className="flex items-center gap-2">
                             <config.icon className="h-3.5 w-3.5" />
                            <span>{config.label}</span>
                          </div>
                       </CustomBadge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                           <DropdownMenuItem onSelect={() => alert('Ouverture du PDF non implémentée.')}>Ouvrir le PDF</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleViewComments(invoice)}>Voir les commentaires</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => handleAction(invoice.id, 'approve')} className="text-green-600 focus:text-green-700 focus:bg-green-50">
                            <CheckCircle2 className="mr-2 h-4 w-4"/>
                            Approuver
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleAction(invoice.id, 'reject')} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                            <XCircle className="mr-2 h-4 w-4"/>
                            Rejeter
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CommentsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        invoice={selectedInvoice}
      />
    </>
  );
}
