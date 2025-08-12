import { Invoice, Service, UserRole } from "./types";

export const services: Service[] = [
    { id: '1', name: 'SGDG', description: 'Direction Générale', password: 'password123' },
    { id: '2', name: 'SGRH', description: 'Ressources Humaines', password: 'password123' },
    { id: '3', name: 'SGFINANCES', description: 'Finances', password: 'password123' },
    { id: '4', name: 'SGINFORMAT', description: 'Informatique', password: 'password123' },
    { id: '5', name: 'SGCOMPUB', description: 'Commande Publique', password: 'password123' },
    { id: '6', name: 'SGCULTURE', description: 'Culture', password: 'password123' },
    { id: '7', name: 'SGAFFGENER', description: 'Affaires Générales', password: 'password123' },
    { id: '8', name: 'SGJURID', description: 'Juridique', password: 'password123' },
    { id: '9', name: 'SGCOMMUNIC', description: 'Communication', password: 'password123' },
    { id: '10', name: 'SGTHEATRE', description: 'Théâtre', password: 'password123' },
    { id: '11', name: 'SGPOLICE', description: 'Police Municipale', password: 'password123' },
    { id: '12', name: 'SGDCVTP', description: 'DCVTP', password: 'password123' },
    { id: '13', name: 'SGPROPURB', description: 'Propreté Urbaine', password: 'password123' },
    { id: '14', name: 'SGESPVERTS', description: 'Espaces Verts', password: 'password123' },
    { id: '15', name: 'SGSPORTS', description: 'Sports', password: 'password123' },
    { id: '16', name: 'SGSCOLAIRE', description: 'Scolaire', password: 'password123' },
    { id: '17', name: 'SGCS', description: 'Centre Social', password: 'password123' },
    { id: '18', name: 'CCAS', description: 'CCAS', password: 'password123' },
    { id: '19', name: 'DRE', description: 'DRE', password: 'password123' },
    { id: '20', name: 'SGPOLITVILLE', description: 'Politique de la Ville', password: 'password123' },
    { id: '21', name: 'SAAD', description: 'SAAD', password: 'password123' },
    { id: '22', name: 'SGST', description: 'Service Technique', password: 'password123' },
    { id: '23', name: 'SGBIBLI', description: 'Bibliothèque', password: 'password123' },
    { id: '24', name: 'SGFETES', description: 'Fêtes et Cérémonies', password: 'password123' },
    { id: '25', name: 'SGRESTO', description: 'Restauration', password: 'password123' },
    { id: '26', name: 'SGVIEASSO', description: 'Vie Associative', password: 'password123' },
    { id: '27', name: 'SGMULTIACC', description: 'Multi-accueil', password: 'password123' },
    { id: '28', name: 'SGAFP', description: 'AFP', password: 'password123' },
    { id: '29', name: 'SGRAM', description: 'RAM', password: 'password123' },
    { id: '30', name: 'SGGDSTRAV', description: 'Grands Travaux', password: 'password123' },
    { id: '31', name: 'SGMAGASIN', description: 'Magasin', password: 'password123' }
];

export const invoices: Invoice[] = [
  {
    id: "INV001",
    fileName: "SGRH-facture-fournisseur-f-.pdf",
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
    expenseType: "Fonctionnement",
  },
  {
    id: "INV002",
    fileName: "SGFINANCES-note-de-frais-f-.pdf",
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
    expenseType: "Fonctionnement",
  },
  {
    id: "INV003",
    fileName: "SGCOMPUB-facture-logiciel-fl-.pdf",
    service: "SGCOMPUB",
    status: "En attente de validation Commande Publique",
    lastUpdated: "2024-07-22T10:15:00Z",
    history: [
       { status: "En attente de validation Commande Publique", date: "2024-07-22T10:15:00Z", by: "Finance" }
    ],
    comments: [],
    expenseType: "Fluide",
  },
  {
    id: "INV004",
    fileName: "SGCULTURE-prestation-artiste-i-.pdf",
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
    expenseType: "Investissement",
  },
  {
    id: "INV005",
    fileName: "SGINFORMAT-achat-materiel-i-.pdf",
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
    expenseType: "Investissement",
  },
];
