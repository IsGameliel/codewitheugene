export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image?: string;
  is_published: boolean;
  published_at?: Date;
  author_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  thumbnail?: string;
  duration: string;
  lessons: number;
  learning_objectives: string;
  requirements: string;
  total_duration: string;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CoursePurchase {
  id: string;
  user_id: string;
  course_id: string;
  purchase_date: Date;
  amount: number;
}