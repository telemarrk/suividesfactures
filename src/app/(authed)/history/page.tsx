
"use client";

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { invoices as defaultInvoices } from "@/lib/data"
import { CheckCircle2, XCircle, MessageSquare, Eye } from "lucide-react"
import { useEffect, useState } from "react"
import type { Invoice } from "@/lib/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CircleUser } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const handleViewPdf = (fileName: string) => {
    window.open(`/api/invoices/${encodeURIComponent(fileName)}`, '_blank');
  }

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
              <Accordion type="single" collapsible className="w-full">
                {completedInvoices.map((invoice) => (
                   <AccordionItem value={invoice.id} key={invoice.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="w-full">
                           <Table className="w-full">
                              <TableBody>
                                <TableRow className="border-b-0">
                                  <TableCell className="font-medium w-1/3">{invoice.fileName}</TableCell>
                                  <TableCell className="w-1/6">
                                    <Badge variant="outline">{invoice.service}</Badge>
                                  </TableCell>
                                   <TableCell className="w-1/6">
                                    {invoice.expenseType !== "N/A" ? <Badge variant="secondary">{invoice.expenseType}</Badge> : '-'}
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
                                     <span>par <strong>{h.by}</strong> le {new Date(h.date).toLocaleDateString()}</span>
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
                                                <div className="font-semibold text-sm">{comment.author}</div>
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
               {completedInvoices.length === 0 && (
                 <div className="text-center text-muted-foreground py-12">
                    Aucune facture dans l'historique pour le moment.
                 </div>
               )}
            </CardContent>
        </Card>
    </div>
  )
}
