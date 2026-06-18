export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          bio: string | null;
          avatar_url: string | null;
          diving_experience: 'beginner' | 'intermediate' | 'advanced' | 'instructor';
          location: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          bio?: string | null;
          avatar_url?: string | null;
          diving_experience?: 'beginner' | 'intermediate' | 'advanced' | 'instructor';
          location?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          bio?: string | null;
          avatar_url?: string | null;
          diving_experience?: 'beginner' | 'intermediate' | 'advanced' | 'instructor';
          location?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      dive_sites: {
        Row: {
          id: string;
          name: string;
          description: string;
          location: string;
          latitude: number;
          longitude: number;
          depth: number;
          difficulty: 'easy' | 'intermediate' | 'hard';
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          location: string;
          latitude: number;
          longitude: number;
          depth: number;
          difficulty: 'easy' | 'intermediate' | 'hard';
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          location?: string;
          latitude?: number;
          longitude?: number;
          depth?: number;
          difficulty?: 'easy' | 'intermediate' | 'hard';
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      dive_plans: {
        Row: {
          id: string;
          user_id: string;
          dive_site_id: string | null;
          instructor_id: string | null;
          experience_level: string;
          goal: string;
          ai_message: string | null;
          tips: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          dive_site_id?: string | null;
          instructor_id?: string | null;
          experience_level: string;
          goal: string;
          ai_message?: string | null;
          tips?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          dive_site_id?: string | null;
          instructor_id?: string | null;
          experience_level?: string;
          goal?: string;
          ai_message?: string | null;
          tips?: string[] | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
