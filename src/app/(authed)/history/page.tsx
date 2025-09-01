
"use client";

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { invoices as defaultInvoices, services as defaultServices } from "@/lib/data"
import { CheckCircle2, XCircle, MessageSquare, Eye } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import type { Invoice, Service, UserRole } from "@/lib/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CircleUser } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { differenceInDays } from 'date-fns';

const INVOICES_STORAGE_KEY = "app_invoices";
const SERVICES_STORAGE_KEY = "app_services";


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


export default function HistoryPage() {
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);

  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [expenseTypeFilter, setExpenseTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userService, setUserService] = useState<UserRole | null>(null);


  useEffect(() => {
      const storedInvoices = localStorage.getItem(INVOICES_STORAGE_KEY);
      const invoices = storedInvoices ? JSON.parse(storedInvoices) : defaultInvoices;
      setAllInvoices(invoices);

      const storedServices = localStorage.getItem(SERVICES_STORAGE_KEY);
      const services = storedServices ? JSON.parse(storedServices) : defaultServices;
      setAllServices(services);

      const service = localStorage.getItem("user_service") as UserRole | null;
      setUserService(service);
  }, []);

  const invoicesForHistory = useMemo(() => {
    if (!userService) return [];
    
    return allInvoices.filter(invoice => {
        const isFinished = invoice.status === "Mandatée" || invoice.status === "Rejetée";
        
        let isInProgressButNotOnDashboard = false;
        if (userService === 'SGFINANCES') {
            isInProgressButNotOnDashboard = invoice.status === 'En attente de validation Commande Publique' || invoice.status === 'En attente de validation Service';
        }
        if (userService === 'SGCOMPUB') {
             isInProgressButNotOnDashboard = invoice.status === 'En attente de validation Service' && invoice.service !== 'CCAS' && invoice.service !== 'DRE';
        }

        return isFinished || isInProgressButNotOnDashboard;
    });
  }, [allInvoices, userService]);
  
  useEffect(() => {
    let invoices = invoicesForHistory;
    if (serviceFilter !== 'all') {
        invoices = invoices.filter(invoice => invoice.service === serviceFilter);
    }
    if (expenseTypeFilter !== 'all') {
        invoices = invoices.filter(invoice => invoice.expenseType === expenseTypeFilter);
    }
    if (statusFilter !== 'all') {
        invoices = invoices.filter(invoice => invoice.status === statusFilter);
    }
    setFilteredInvoices(invoices);
  }, [invoicesForHistory, serviceFilter, expenseTypeFilter, statusFilter]);
  

  const handleViewPdf = (fileName: string) => {
    window.open(`/api/invoices/${encodeURIComponent(fileName)}`, '_blank');
  }

  const handleResetFilters = () => {
    setServiceFilter("all");
    setExpenseTypeFilter("all");
    setStatusFilter("all");
  };

  const expenseTypes = useMemo(() => {
     const types = new Set(invoicesForHistory.map(inv => inv.expenseType));
     return Array.from(types).filter(t => t !== "N/A");
  }, [invoicesForHistory]);

  const statuses = useMemo(() => {
     const statusSet = new Set(invoicesForHistory.map(inv => inv.status));
     return Array.from(statusSet);
  }, [invoicesForHistory]);

  const getDeadlineDays = (invoice: Invoice): number | null => {
    if (invoice.status !== 'Mandatée' || invoice.history.length < 2) {
      return null;
    }
    const depositDate = new Date(invoice.history[0].date);
    const mandatedEntry = invoice.history.find(h => h.status === 'Mandatée');
    if (!mandatedEntry) return null;
    
    const mandatedDate = new Date(mandatedEntry.date);
    return differenceInDays(mandatedDate, depositDate);
  };
  
  const getServiceDescription = (serviceName: UserRole): string => {
    const service = allServices.find(s => s.name === serviceName);
    return service ? service.description : serviceName;
  }

  const getAuthorDescription = (author: string): string => {
    // Assuming author is a UserRole
    try {
        const service = allServices.find(s => s.name === author);
        return service ? service.description : author;
    } catch (e) {
        return author;
    }
  }


  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Historique des factures</h1>
        <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Factures traitées et en cours</CardTitle>
                  <CardDescription>
                      Liste de toutes les factures qui ont terminé le cycle ou qui sont en cours de validation.
                  </CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Select value={serviceFilter} onValueChange={setServiceFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filtrer par service" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les services</SelectItem>
                            {allServices.sort((a,b) => a.description.localeCompare(b.description)).map(service => (
                                <SelectItem key={service.id} value={service.name}>{service.description}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Select value={expenseTypeFilter} onValueChange={setExpenseTypeFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filtrer par dépense" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous types de dépenses</SelectItem>
                            {expenseTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            {statuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleResetFilters}>Réinitialiser</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredInvoices.map((invoice) => (
                   <AccordionItem value={invoice.id} key={invoice.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="w-full">
                           <Table className="w-full">
                              <TableBody>
                                <TableRow className="border-b-0">
                                  <TableCell className="font-medium w-1/4">{invoice.fileName}</TableCell>
                                  <TableCell className="w-1/6">
                                    <Badge variant="outline" className="whitespace-nowrap">{getServiceDescription(invoice.service)}</Badge>
                                  </TableCell>
                                   <TableCell className="w-1/6">
                                    {invoice.expenseType !== "N/A" ? <Badge variant="secondary">{invoice.expenseType}</Badge> : '-'}
                                  </TableCell>
                                  <TableCell className="w-1/6">
                                      <DeadlineBadge days={getDeadlineDays(invoice)} />
                                  </TableCell>
                                  <TableCell className="w-1/6">
                                      <Badge variant={invoice.status === "Mandatée" ? "default" : "destructive"} className={invoice.status === "Mandatée" ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700" : ""}>
                                      {invoice.status === "Mandatée" ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                                      {invoice.status}
                                      </Badge>
                                  </TableCell>
                                  <TableCell className="text-right w-1/6">
                                    <div className="flex items-center justify-end gap-2">
                                      <span>{new Date(invoice.lastUpdated).toLocaleDateString()}</span>
                                      <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                               <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleViewPdf(invoice.fileName); }}>
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">Ouvrir le PDF</span>
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Ouvrir le PDF</p>
                                            </TooltipContent>
                                          </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 bg-muted/50 rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2">Historique de validation</h4>
                              <ul className="space-y-2 text-sm">
                                {invoice.history.map((h, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                     <Badge variant="secondary">{h.status}</Badge>
                                     <span>par <strong>{getAuthorDescription(h.by)}</strong> le {new Date(h.date).toLocaleDateString()}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                               <h4 className="font-semibold mb-2 flex items-center">
                                  <MessageSquare className="mr-2 h-5 w-5"/>
                                  Commentaires ({invoice.comments.length})
                                </h4>
                               <Separator className="my-2" />
                                <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                                  {invoice.comments.length > 0 ? (
                                    invoice.comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback><CircleUser className="h-4 w-4"/></AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="font-semibold text-sm">{getAuthorDescription(comment.author)}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(comment.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                            <p className="text-sm leading-snug">{comment.content}</p>
                                        </div>
                                    </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">Aucun commentaire.</p>
                                  )}
                                </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                   </AccordionItem>
                ))}
              </Accordion>
               {filteredInvoices.length === 0 && (
                 <div className="text-center text-muted-foreground py-12">
                    {invoicesForHistory.length > 0 ? "Aucune facture ne correspond à vos critères de recherche." : "Aucune facture dans l'historique pour le moment."}
                 </div>
               )}
            </CardContent>
        </Card>
    </div>
  )
}
