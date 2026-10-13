import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Wish = {
  id: string;
  author_id: string | null;
  guest_name: string;
  message: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

interface Database {
  public: {
    Tables: {
      wishes: {
        Row: Wish;
        Insert: {
          id?: string;
          author_id?: string | null;
          guest_name: string;
          message: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Pick<Wish, "guest_name" | "message" | "deleted_at">>;
        Relationships: [];
      };
      wish_owners: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      submit_wish: {
        Args: { p_guest_name: string; p_message: string; p_author_token: string };
        Returns: string;
      };
      manage_wish_by_token: {
        Args: {
          p_wish_id: string;
          p_author_token: string;
          p_guest_name: string;
          p_message: string;
          p_delete: boolean;
        };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

let client: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !publishableKey) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("URL protocol must be HTTP or HTTPS.");
    }
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid URL.");
  }

  client ??= createClient<Database>(url, publishableKey);
  return client;
}
