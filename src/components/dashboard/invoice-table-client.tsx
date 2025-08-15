
"use client";

import React, { useState, useEffect } from "react";
import { MoreHorizontal, FileText, CheckCircle2, XCircle, Clock, MessageSquare, Trash, Pencil, Send, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CommentsDrawer } from "./comments-drawer";
import type { Invoice, InvoiceStatus, UserRole, Comment } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { invoices as defaultInvoices } from "@/lib/data";
import { differenceInDays } from "date-fns";


const INVOICES_STORAGE_KEY = "app_invoices";

interface InvoiceTableClientProps {
  initialInvoices: Invoice[];
}

const statusConfig: Record<
  InvoiceStatus,
  { icon: React.ElementType; color: "default" | "secondary" | "destructive" | "outline" | "accent" | "success" | "warning" | "info" | "purple"; label: string }
> = {
  "En attente de validation Commande Publique": { icon: Clock, color: "info", label: "Attente Commande Publique" },
  "En attente de validation Service": { icon: Clock, color: "warning", label: "Attente Service" },
  "En attente de mandatement": { icon: Clock, color: "purple", label: "Attente Mandatement" },
  "Mandatée": { icon: CheckCircle2, color: "success", label: "Mandatée" },
  "Rejetée": { icon: XCircle, color: "destructive", label: "Rejetée" },
};

const CustomBadge = ({ color, children, ...props }: { color: string, children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => {
  const badgeClasses: { [key: string]: string } = {
    success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700',
    warning: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700',
    info: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700',
    purple: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700',
  };
  
  if (color === "destructive") {
    return <Badge {...props} variant="destructive">{children}</Badge>;
  }

  return <Badge {...props} className={badgeClasses[color] || ''}>{children}</Badge>;
}

const DeadlineBadge = ({ days }: { days: number | null }) => {
    if (days === null) {
        return <span>-</span>;
    }

    let colorClasses = "";
    if (days < 15) {
        colorClasses = "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700";
    } else if (days <= 20) {
        colorClasses = "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700";
    } else if (days <= 30) {
        colorClasses = "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700";
    } else {
        colorClasses = "bg-gray-800 text-gray-100 border-gray-900 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700";
    }

    return (
        <Badge className={colorClasses}>{days} jours</Badge>
    );
};


export function InvoiceTableClient({ initialInvoices: defaultInvoices }: InvoiceTableClientProps) {
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [visibleInvoices, setVisibleInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userService, setUserService] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/invoices');
        if (!response.ok) {
            throw new Error('Failed to fetch invoices');
        }
        const localInvoices = await response.json();
        
        const storedInvoicesRaw = localStorage.getItem(INVOICES_STORAGE_KEY);
        const storedInvoices = storedInvoicesRaw ? JSON.parse(storedInvoicesRaw) : [];

        const mergedInvoices = localInvoices.map((localInv: Invoice) => {
            const stored = storedInvoices.find((s: Invoice) => s.fileName === localInv.fileName);
            if (stored) {
                return { ...localInv, ...stored, id: localInv.id }; // Keep local ID but take stored status/comments
            }
            return localInv;
        });

        updateAllInvoices(mergedInvoices);
        
    } catch (error) {
        console.error("Error fetching local invoices, falling back to storage or default:", error);
        const storedInvoices = localStorage.getItem(INVOICES_STORAGE_KEY);
        setAllInvoices(storedInvoices ? JSON.parse(storedInvoices) : defaultInvoices);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const service = localStorage.getItem("user_service") as UserRole | null;
    setUserService(service);
    fetchInvoices();

    const handleStorageChange = () => {
        const updatedStoredInvoices = localStorage.getItem(INVOICES_STORAGE_KEY);
        if (updatedStoredInvoices) {
            setAllInvoices(JSON.parse(updatedStoredInvoices));
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateAllInvoices = (updatedInvoices: Invoice[]) => {
    setAllInvoices(updatedInvoices);
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updatedInvoices));
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    if (userService) {
      const filteredInvoices = allInvoices.filter(inv => {
        if (inv.status === 'Mandatée' || inv.status === 'Rejetée') {
            return false;
        }

        switch (userService) {
            case 'SGFINANCES':
                return inv.status === 'En attente de validation Commande Publique' ||
                       inv.status === 'En attente de validation Service' ||
                       inv.status === 'En attente de mandatement';
            case 'SGCOMPUB':
                 return inv.status === 'En attente de validation Commande Publique' ||
                        (inv.status === 'En attente de validation Service' && inv.service !== 'CCAS' && inv.service !== 'DRE');
            default:
                return inv.service === userService && inv.status === 'En attente de validation Service';
        }
      });
      setVisibleInvoices(filteredInvoices);
    }
  }, [userService, allInvoices]);

  const handleViewComments = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedInvoice(null);
  };

  const handleUpdateInvoice = (invoiceId: string, updates: Partial<Invoice>) => {
    const updatedInvoices = allInvoices.map(inv => 
        inv.id === invoiceId ? { ...inv, ...updates, lastUpdated: new Date().toISOString() } : inv
    );
    updateAllInvoices(updatedInvoices);
  };

  const handleAction = (invoiceId: string, action: "approve" | "reject") => {
    const invoice = allInvoices.find(inv => inv.id === invoiceId);
    if (!invoice || !userService) return;

    let nextStatus: InvoiceStatus | null = null;
    let historyEntryBy = userService;

    if (action === "approve") {
        if (invoice.status === 'En attente de validation Commande Publique') nextStatus = 'En attente de validation Service';
        else if (invoice.status === 'En attente de validation Service') {
            nextStatus = 'En attente de mandatement';
        }
        else if (invoice.status === 'En attente de mandatement') nextStatus = 'Mandatée';
    } else {
        nextStatus = 'Rejetée';
    }

    if (nextStatus) {
      const newHistoryEntry = { status: nextStatus, date: new Date().toISOString(), by: historyEntryBy };
      handleUpdateInvoice(invoiceId, { status: nextStatus, history: [...invoice.history, newHistoryEntry] });
    }
  };

  const handleViewPdf = (fileName: string) => {
    window.open(`/api/invoices/${encodeURIComponent(fileName)}`, '_blank');
  }
  
  const getDaysSinceDeposit = (invoice: Invoice): number | null => {
    if (!invoice.history || invoice.history.length === 0) {
      return null;
    }
    const depositDate = new Date(invoice.history[0].date);
    return differenceInDays(new Date(), depositDate);
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
                <TableHead>Type de dépense</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">Chargement des factures...</TableCell>
                </TableRow>
              ) : visibleInvoices.length > 0 ? (
                visibleInvoices.map((invoice) => {
                  const config = statusConfig[invoice.status];
                   const canValidate = 
                      (userService === 'SGCOMPUB' && invoice.status === 'En attente de validation Commande Publique') ||
                      (userService === 'SGFINANCES' && invoice.status === 'En attente de mandatement') ||
                      (userService === invoice.service && invoice.status === 'En attente de validation Service');
                  
                  const isFinanceOrCompubService = (invoice.service === 'SGFINANCES' || invoice.service === 'SGCOMPUB');

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
                        {invoice.expenseType !== "N/A" ? <Badge variant="secondary">{invoice.expenseType}</Badge> : '-'}
                      </TableCell>
                      <TableCell>
                        <DeadlineBadge days={getDaysSinceDeposit(invoice)} />
                      </TableCell>
                      <TableCell>
                         <CustomBadge color={config.color}>
                            <div className="flex items-center gap-2">
                               <config.icon className="h-3.5 w-3.5" />
                              <span>{config.label}</span>
                            </div>
                         </CustomBadge>
                      </TableCell>
                      <TableCell className="text-right">
                         <TooltipProvider>
                          <div className="flex items-center justify-end gap-2">
                             <Tooltip>
                              <TooltipTrigger asChild>
                                 <Button variant="ghost" size="icon" onClick={() => handleViewPdf(invoice.fileName)}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Ouvrir le PDF</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ouvrir le PDF</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="relative">
                                  <Button variant="ghost" size="icon" onClick={() => handleViewComments(invoice)}>
                                    <MessageSquare className="h-4 w-4" />
                                    <span className="sr-only">Voir les commentaires</span>
                                  </Button>
                                  {invoice.comments.length > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center p-1 text-xs" variant="destructive">
                                      {invoice.comments.length}
                                    </Badge>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Voir les commentaires</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                 <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleAction(invoice.id, 'approve')} disabled={!canValidate}>
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span className="sr-only">Approuver</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Approuver</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                               <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleAction(invoice.id, 'reject')} disabled={!canValidate}>
                                  <XCircle className="h-4 w-4" />
                                  <span className="sr-only">Rejeter</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Rejeter</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                 <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">Aucune facture en attente pour votre service.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CommentsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        invoice={selectedInvoice}
        onCommentSubmit={(invoiceId, newComments) => handleUpdateInvoice(invoiceId, { comments: newComments })}
        userService={userService}
      />
    </>
  );
}
