export type UserRole = 
  | "Finance"
  | "Commande Publique"
  | "SGDG" | "SGAFFGENER" | "SGJURID" | "SGCOMMUNIC" | "SGCULTURE" 
  | "SGTHEATRE" | "SGPOLICE" | "SGRH" | "SGFINANCES" | "SGDCVTP" 
  | "SGPROPURB" | "SGESPVERTS" | "SGSPORTS" | "SGSCOLAIRE" | "SGCS" 
  | "CCAS" | "DRE" | "SGPOLITVILLE" | "SAAD" | "SGST" | "SGINFORMAT" 
  | "SGBIBLI" | "SGFETES" | "SGRESTO" | "SGVIEASSO" | "SGMULTIACC" 
  | "SGAFP" | "SGRAM" | "SGGDSTRAV" | "SGMAGASIN" | "SGCOMPUB";

export type InvoiceStatus =
  | "En attente de validation Commande Publique"
  | "En attente de validation Service"
  | "En attente de mandatement"
  | "Mandatée"
  | "Rejetée";

export type ExpenseType = "Investissement" | "Fonctionnement" | "Fluide" | "N/A";

export interface Comment {
  id: string;
  author: string;
  authorRole: UserRole;
  timestamp: string;
  content: string;
}

export interface Invoice {
  id: string;
  fileName: string;
  service: UserRole;
  status: InvoiceStatus;
  lastUpdated: string;
  history: { status: InvoiceStatus; date: string; by: string }[];
  comments: Comment[];
  expenseType: ExpenseType;
  cpRef?: string;
}

export interface Service {
  id: string;
  name: UserRole;
  description: string;
  password?: string;
}
