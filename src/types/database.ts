export type UserRole = "parent" | "teacher" | "censeur" | "admin" | "super_admin";

export type AbsenceStatus = "pending" | "approved" | "rejected";

export type AdStatus = "draft" | "pending_review" | "published" | "rejected";

export type ModerationAction = "approved" | "rejected";

export type MessageDirection = "inbound" | "outbound";

export interface Establishment {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  phone_verified: boolean;
  role: UserRole;
  establishment_id: string | null;
  establishment?: Establishment;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  full_name: string;
  class_name: string | null;
  level: string | null;
  parent_id: string;
  establishment_id: string;
  created_at: string;
  updated_at: string;
}

export interface Absence {
  id: string;
  user_id: string;
  student_id: string;
  student?: Student;
  date: string;
  end_date: string | null;
  reason_text: string | null;
  status: AbsenceStatus;
  admin_comments: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AbsenceJustification {
  id: string;
  absence_id: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

export interface Ad {
  id: string;
  user_id: string;
  user?: User;
  title: string;
  description: string | null;
  price: number;
  subject: string | null;
  level: string | null;
  condition: string | null;
  establishment_id: string;
  status: AdStatus;
  moderation_score: number | null;
  moderation_feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdPhoto {
  id: string;
  ad_id: string;
  file_path: string;
  file_type: string;
  file_size: number;
  order: number;
  uploaded_at: string;
}

export interface ModerationLog {
  id: string;
  entity_type: "absence" | "ad";
  entity_id: string;
  moderator_id: string;
  moderator?: User;
  action: ModerationAction;
  comments: string | null;
  ai_analysis: Record<string, unknown> | null;
  created_at: string;
}

export interface WhatsAppMessage {
  id: string;
  direction: MessageDirection;
  phone_number: string;
  message_id: string | null;
  payload: Record<string, unknown>;
  status: string | null;
  user_id: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  data: Record<string, unknown> | null;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter Types
export interface AbsenceFilters {
  status?: AbsenceStatus;
  studentId?: string;
  dateFrom?: string;
  dateTo?: string;
  establishmentId?: string;
}

export interface AdFilters {
  status?: AdStatus;
  subject?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  establishmentId?: string;
  search?: string;
}
