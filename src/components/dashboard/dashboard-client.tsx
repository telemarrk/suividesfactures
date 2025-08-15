
"use client";

import { useEffect, useState, useMemo } from "react";
import type { Invoice, UserRole, ExpenseType } from "@/lib/types";
import { InvoiceTableClient } from "./invoice-table-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Building, Droplets, TrendingUp } from "lucide-react";

interface DashboardClientProps {
    initialInvoices: Invoice[];
}

export function DashboardClient({ initialInvoices }: DashboardClientProps) {
    const [allInvoices, setAllInvoices] = useState<Invoice[]>(initialInvoices);
    const [userService, setUserService] = useState<UserRole | null>(null);

    useEffect(() => {
        const service = localStorage.getItem("user_service") as UserRole | null;
        setUserService(service);

        const storedInvoices = localStorage.getItem("app_invoices");
        if (storedInvoices) {
            setAllInvoices(JSON.parse(storedInvoices));
        }

        const handleStorageChange = () => {
            const updatedStoredInvoices = localStorage.getItem("app_invoices");
            if (updatedStoredInvoices) {
                setAllInvoices(JSON.parse(updatedStoredInvoices));
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const stats = useMemo(() => {
        if (!userService) return null;

        if (userService === 'SGCOMPUB') {
            const toProcessCount = allInvoices.filter(
                inv => inv.status === 'En attente de validation Commande Publique'
            ).length;
            return { total: toProcessCount };
        }

        if (userService === 'SGFINANCES') {
            const invoicesToProcess = allInvoices.filter(inv => 
                 inv.status === 'En attente de validation Commande Publique' ||
                 inv.status === 'En attente de validation Service' ||
                 inv.status === 'En attente de mandatement'
            );
            
            const byType = invoicesToProcess.reduce((acc, inv) => {
                if(inv.expenseType) {
                    acc[inv.expenseType] = (acc[inv.expenseType] || 0) + 1;
                }
                return acc;
            }, {} as Record<ExpenseType, number>);

            return {
                total: invoicesToProcess.length,
                fonctionnement: byType['Fonctionnement'] || 0,
                fluide: byType['Fluide'] || 0,
                investissement: byType['Investissement'] || 0
            };
        }

        return null;

    }, [allInvoices, userService]);

    const renderStats = () => {
        if (!stats) return null;

        if (userService === 'SGCOMPUB') {
            return (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Factures à traiter</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            En attente de validation de la Commande Publique
                        </p>
                    </CardContent>
                </Card>
            )
        }
        
        if (userService === 'SGFINANCES' && stats) {
            return (
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-chart-1/10 border-chart-1/20">
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-chart-1">Total à traiter</CardTitle>
                            <FileText className="h-4 w-4 text-chart-1/80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-chart-1">{stats.total}</div>
                             <p className="text-xs text-chart-1/80">
                                Factures en attente de validation ou mandatement
                            </p>
                        </CardContent>
                    </Card>
                     <Card className="bg-chart-2/10 border-chart-2/20">
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-chart-2">Fonctionnement</CardTitle>
                            <Building className="h-4 w-4 text-chart-2/80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-chart-2">{stats.fonctionnement}</div>
                        </CardContent>
                    </Card>
                     <Card className="bg-chart-3/10 border-chart-3/20">
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-chart-3">Fluides</CardTitle>
                            <Droplets className="h-4 w-4 text-chart-3/80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-chart-3">{stats.fluide}</div>
                        </CardContent>
                    </Card>
                     <Card className="bg-chart-4/10 border-chart-4/20">
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-chart-4">Investissement</CardTitle>
                            <TrendingUp className="h-4 w-4 text-chart-4/80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-chart-4">{stats.investissement}</div>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        return null;
    }

    return (
        <div className="flex flex-col gap-6">
            {renderStats()}
            <InvoiceTableClient initialInvoices={initialInvoices} />
        </div>
    )

}
