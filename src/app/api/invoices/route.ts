
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Invoice, ExpenseType, UserRole } from '@/lib/types';
import { invoices as defaultInvoices } from '@/lib/data';

// IMPORTANT: This is a local development-only feature.
// For a production app, invoices should be stored securely in cloud storage.
const INVOICES_DIR = process.env.INVOICES_PDF_DIR || 'C:/Users/solan/Desktop/Factures/PDF';


const getExpenseType = (fileName: string): ExpenseType => {
    const lowerCaseName = fileName.toLowerCase();
    if (lowerCaseName.includes('-i-')) return "Investissement";
    if (lowerCaseName.includes('-f-')) return "Fonctionnement";
    if (lowerCaseName.includes('-fl-')) return "Fluide";
    return "N/A";
}

export async function GET() {
  try {
    if (!fs.existsSync(INVOICES_DIR)) {
      console.warn(`Le dossier des factures n'existe pas : ${INVOICES_DIR}. Utilisation des données par défaut.`);
      return NextResponse.json(defaultInvoices);
    }
    
    const files = fs.readdirSync(INVOICES_DIR).filter(file => path.extname(file).toLowerCase() === '.pdf');

    // This is a simplified logic. In a real app, you would get this from a database.
    const newInvoices: Invoice[] = files.map((file, index) => {
        const serviceName = file.split('-')[0].toUpperCase() as UserRole;
        
        const bypassCompub = serviceName === 'CCAS' || serviceName === 'DRE';

        const initialStatus = bypassCompub ? 'En attente de validation Service' : 'En attente de validation Commande Publique';
        const initialHistoryEntry = { status: initialStatus, date: new Date().toISOString(), by: 'System' };
        
        return {
            id: `INV-LOCAL-${index + 1}`,
            fileName: file,
            service: serviceName,
            status: initialStatus,
            lastUpdated: new Date().toISOString(),
            history: [initialHistoryEntry],
            comments: [],
            expenseType: getExpenseType(file),
        };
    });

    return NextResponse.json(newInvoices);
  } catch (error) {
    console.error("Erreur lors de la lecture du dossier des factures:", error);
    // Fallback to default data in case of any error
    return NextResponse.json(defaultInvoices, { status: 500 });
  }
}
