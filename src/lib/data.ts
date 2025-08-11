import { Invoice, Service, UserRole } from "./types";

export const services: Service[] = [
    { id: '1', name: 'SGDG', description: 'Direction Générale' },
    { id: '2', name: 'SGRH', description: 'Ressources Humaines' },
    { id: '3', name: 'SGFINANCES', description: 'Finances' },
    { id: '4', name: 'SGINFORMAT', description: 'Informatique' },
    { id: '5', name: 'SGCOMPUB', description: 'Commande Publique' },
    { id: '6', name: 'SGCULTURE', description: 'Culture' },
];

export const invoices: Invoice[] = [
  {
    id: "INV001",
    fileName: "SGRH-facture-fournisseur-A.pdf",
    service: "SGRH",
    status: "En attente de validation Service",
    lastUpdated: "2024-07-22T14:30:00Z",
    history: [
        { status: "En attente de validation Commande Publique", date: "2024-07-22T10:00:00Z", by: "Finance" },
        { status: "En attente de validation Service", date: "2024-07-22T14:30:00Z", by: "Commande Publique" }
    ],
    comments: [
      { id: 'c1', author: 'Alice (Commande Publique)', authorRole: 'Commande Publique', timestamp: '2024-07-22T14:29:00Z', content: 'Vérifié, conforme.' },
    ],
  },
  {
    id: "INV002",
    fileName: "SGFINANCES-note-de-frais-B.pdf",
    service: "SGFINANCES",
    status: "En attente de mandatement",
    lastUpdated: "2024-07-21T11:00:00Z",
     history: [
        { status: "En attente de validation Commande Publique", date: "2024-07-20T09:00:00Z", by: "Finance" },
        { status: "En attente de validation Service", date: "2024-07-20T16:45:00Z", by: "Commande Publique" },
        { status: "En attente de mandatement", date: "2024-07-21T11:00:00Z", by: "SGFINANCES" }
    ],
    comments: [
        { id: 'c1', author: 'Bob (SGFINANCES)', authorRole: 'SGFINANCES', timestamp: '2024-07-21T10:59:00Z', content: 'Validé pour le service. Prêt pour mandatement.' },
    ],
  },
  {
    id: "INV003",
    fileName: "SGCOMPUB-facture-logiciel-C.pdf",
    service: "SGCOMPUB",
    status: "En attente de validation Commande Publique",
    lastUpdated: "2024-07-22T10:15:00Z",
    history: [
       { status: "En attente de validation Commande Publique", date: "2024-07-22T10:15:00Z", by: "Finance" }
    ],
    comments: [],
  },
  {
    id: "INV004",
    fileName: "SGCULTURE-prestation-artiste-D.pdf",
    service: "SGCULTURE",
    status: "Mandatée",
    lastUpdated: "2024-07-19T17:00:00Z",
     history: [
        { status: "En attente de validation Commande Publique", date: "2024-07-18T11:00:00Z", by: "Finance" },
        { status: "En attente de validation Service", date: "2024-07-18T15:00:00Z", by: "Commande Publique" },
        { status: "En attente de mandatement", date: "2024-07-19T09:30:00Z", by: "SGCULTURE" },
        { status: "Mandatée", date: "2024-07-19T17:00:00Z", by: "Finance" }
    ],
    comments: [
        { id: 'c1', author: 'Charles (SGCULTURE)', authorRole: 'SGCULTURE', timestamp: '2024-07-19T09:29:00Z', content: 'RAS' },
        { id: 'c2', author: 'Diane (Finance)', authorRole: 'Finance', timestamp: '2024-07-19T16:59:00Z', content: 'Mandatement effectué.' },
    ],
  },
  {
    id: "INV005",
    fileName: "SGINFORMAT-achat-materiel-E.pdf",
    service: "SGINFORMAT",
    status: "Rejetée",
    lastUpdated: "2024-07-20T18:00:00Z",
    history: [
        { status: "En attente de validation Commande Publique", date: "2024-07-20T13:00:00Z", by: "Finance" },
        { status: "Rejetée", date: "2024-07-20T18:00:00Z", by: "Commande Publique" }
    ],
    comments: [
        { id: 'c1', author: 'Alice (Commande Publique)', authorRole: 'Commande Publique', timestamp: '2024-07-20T17:59:00Z', content: 'Manque le bon de commande. Facture rejetée.' },
    ],
  },
];
