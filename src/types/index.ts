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

// ===========================================
// Types pour le système de discussions
// ===========================================

export type AuteurType = "PARENT" | "PROFESSEUR" | "ADMIN" | "SYSTEM";
export type MessageType = "TEXT" | "IMAGE" | "ANNONCE";

export interface Classe {
  id: string;
  nom: string;
  niveau: string | null;
  annee_scolaire: string;
  establishment_id: string;
  created_at: string;
  updated_at: string;
}

export interface Professeur {
  id: string;
  user_id: string | null;
  nom: string;
  prenom: string;
  email: string | null;
  whatsapp: string | null;
  matiere: string | null;
  establishment_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProfesseurClasse {
  id: string;
  professeur_id: string;
  classe_id: string;
  is_principal: boolean;
  created_at: string;
}

export interface GroupeDiscussion {
  id: string;
  classe_id: string;
  nom: string;
  description: string | null;
  is_active: boolean;
  establishment_id: string;
  created_at: string;
  updated_at: string;
  classe?: Classe;
}

export interface MessageDiscussion {
  id: string;
  groupe_id: string;
  auteur_id: string | null;
  auteur_type: AuteurType;
  contenu: string;
  type_message: MessageType;
  is_annonce: boolean;
  is_moderated: boolean;
  moderation_reason: string | null;
  reply_to: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  auteur?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  reply_message?: MessageDiscussion;
}

export interface MessageRead {
  id: string;
  user_id: string;
  groupe_id: string;
  last_read_at: string;
  last_read_message_id: string | null;
}

export interface NotificationDiscussion {
  id: string;
  user_id: string;
  type: string;
  titre: string;
  contenu: string | null;
  lien: string | null;
  is_read: boolean;
  groupe_id: string | null;
  message_id: string | null;
  sent_whatsapp: boolean;
  created_at: string;
}

export interface GroupeWithUnread {
  groupe_id: string;
  groupe_nom: string;
  classe_nom: string;
  classe_niveau: string | null;
  description: string | null;
  last_message_at: string | null;
  last_message_preview: string | null;
  last_message_auteur: string | null;
  unread_count: number;
  total_members: number;
}

export interface GroupeMember {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  member_type: "PARENT" | "PROFESSEUR";
  is_principal: boolean;
  children_count: number;
}
