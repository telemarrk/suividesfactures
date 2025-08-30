
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const INVOICES_DIR = process.env.INVOICES_PDF_DIR || 'C:/Users/solan/Desktop/Factures/PDF';

export async function GET(
  req: NextRequest,
  { params }: { params: { fileName: string } }
) {
  const { fileName } = params;
  const filePath = path.join(INVOICES_DIR, fileName);

  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    return new NextResponse(fileBuffer, { status: 200, statusText: 'OK', headers });
  } else {
    console.error(`Fichier non trouvé : ${filePath}`);
    return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
  }
}
