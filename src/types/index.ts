export * from "./database";

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  establishmentId: string;
  role?: string;
}

export interface AbsenceFormData {
  studentId: string;
  date: string;
  endDate?: string;
  reasonText: string;
  justificationFile?: File;
}

export interface AdFormData {
  title: string;
  description: string;
  price: number;
  subject: string;
  level: string;
  condition: string;
  photos: File[];
}

// WhatsApp Types
export interface WhapiMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  type: "text" | "image" | "document";
  timestamp: number;
  media?: {
    url: string;
    mimetype: string;
    filename?: string;
  };
}

export interface WhapiWebhookPayload {
  event: string;
  data: WhapiMessage;
  channel_id: string;
  timestamp: number;
}

// Statistics Types
export interface DashboardStats {
  totalAbsences: number;
  pendingAbsences: number;
  approvedAbsences: number;
  rejectedAbsences: number;
  totalAds: number;
  activeAds: number;
  pendingAds: number;
  messageVolume: number;
  averageResponseTime: number;
}

export interface EstablishmentStats extends DashboardStats {
  establishmentId: string;
  establishmentName: string;
  userCount: number;
  adoptionRate: number;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  roles?: string[];
  children?: NavItem[];
}

// Theme Types
export type Theme = "light" | "dark" | "system";
