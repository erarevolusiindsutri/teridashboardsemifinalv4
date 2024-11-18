export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          ip_address: string;
          email: string | null;
          created_at: string;
          is_guest: boolean;
          secret_phrase: string | null;
        };
        Insert: {
          ip_address: string;
          email?: string;
          is_guest?: boolean;
          secret_phrase?: string;
        };
        Update: {
          ip_address?: string;
          email?: string;
          is_guest?: boolean;
          secret_phrase?: string;
        };
      };
      financial_transactions: {
        Row: {
          id: number;
          user_id: number;
          order_id: number | null;
          amount: number;
          transaction_type: string;
          created_at: string;
        };
        Insert: {
          user_id: number;
          order_id?: number;
          amount: number;
          transaction_type: string;
        };
        Update: {
          amount?: number;
          transaction_type?: string;
        };
      };
      balance_transactions: {
        Row: {
          id: number;
          user_id: number;
          amount: number;
          transaction_type: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          user_id: number;
          amount: number;
          transaction_type: string;
          description?: string;
        };
        Update: {
          amount?: number;
          transaction_type?: string;
          description?: string;
        };
      };
      customer_interactions: {
        Row: {
          id: number;
          user_id: number;
          interaction_type: string;
          details: string | null;
          created_at: string;
        };
        Insert: {
          user_id: number;
          interaction_type: string;
          details?: string;
        };
        Update: {
          interaction_type?: string;
          details?: string;
        };
      };
      leads: {
        Row: {
          id: number;
          user_id: number;
          name: string;
          company: string;
          status: string;
          created_at: string;
        };
        Insert: {
          user_id: number;
          name: string;
          company: string;
          status: string;
        };
        Update: {
          name?: string;
          company?: string;
          status?: string;
        };
      };
      meetings: {
        Row: {
          id: number;
          user_id: number;
          name: string;
          company: string;
          scheduled_time: string;
          status: string;
          created_at: string;
        };
        Insert: {
          user_id: number;
          name: string;
          company: string;
          scheduled_time: string;
          status: string;
        };
        Update: {
          name?: string;
          company?: string;
          scheduled_time?: string;
          status?: string;
        };
      };
      deals: {
        Row: {
          id: number;
          user_id: number;
          name: string;
          company: string;
          value: number;
          status: string;
          created_at: string;
        };
        Insert: {
          user_id: number;
          name: string;
          company: string;
          value: number;
          status: string;
        };
        Update: {
          name?: string;
          company?: string;
          value?: number;
          status?: string;
        };
      };
    };
  };
}