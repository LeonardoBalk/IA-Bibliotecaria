export type UserRole = 'free' | 'intermediario' | 'full';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stripe_customer_id?: string;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  role: UserRole;
  price: number;
  features: string[];
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'inactive' | 'canceled';
  current_period_end?: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'exercise';
  url?: string;
  thumbnail?: string;
  level: string;
  role_min: UserRole;
  created_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  content: string;
  attachment_url?: string;
  created_at: string;
  status: 'sent' | 'read';
}

export interface ScheduleEvent {
  id: string;
  user_id: string;
  title: string;
  date: string;
  status: 'scheduled' | 'completed' | 'canceled';
}

export interface Recommendation {
  document: Document;
  reason: string;
  priority: number;
}
