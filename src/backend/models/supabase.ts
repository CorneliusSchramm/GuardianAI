export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      analyses_chunks: {
        Row: {
          analyses_chunk_id: number;
          category: string | null;
          confidence: number | null;
          created_at: string | null;
          previous_score: string | null;
          reasoning: string | null;
          score: number | null;
          sub_category: string | null;
          updated_at: string | null;
        };
        Insert: {
          analyses_chunk_id?: never;
          category?: string | null;
          confidence?: number | null;
          created_at?: string | null;
          previous_score?: string | null;
          reasoning?: string | null;
          score?: number | null;
          sub_category?: string | null;
          updated_at?: string | null;
        };
        Update: {
          analyses_chunk_id?: never;
          category?: string | null;
          confidence?: number | null;
          created_at?: string | null;
          previous_score?: string | null;
          reasoning?: string | null;
          score?: number | null;
          sub_category?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      calls: {
        Row: {
          call_control_id: string | null;
          call_id: number;
          call_start_datetime: string | null;
          created_at: string | null;
          duration: number | null;
          thread_id: string | null;
          updated_at: string | null;
          user_id: string | null;
          was_scam: boolean | null;
        };
        Insert: {
          call_control_id?: string | null;
          call_id?: never;
          call_start_datetime?: string | null;
          created_at?: string | null;
          duration?: number | null;
          thread_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          was_scam?: boolean | null;
        };
        Update: {
          call_control_id?: string | null;
          call_id?: never;
          call_start_datetime?: string | null;
          created_at?: string | null;
          duration?: number | null;
          thread_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          was_scam?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "calls_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      transcription_chunks: {
        Row: {
          analyses_chunk_id: number | null;
          analyzed: boolean | null;
          call_id: number | null;
          created_at: string | null;
          transcription_chunk: string | null;
          transcription_chunk_id: number;
          updated_at: string | null;
        };
        Insert: {
          analyses_chunk_id?: number | null;
          analyzed?: boolean | null;
          call_id?: number | null;
          created_at?: string | null;
          transcription_chunk?: string | null;
          transcription_chunk_id?: never;
          updated_at?: string | null;
        };
        Update: {
          analyses_chunk_id?: number | null;
          analyzed?: boolean | null;
          call_id?: number | null;
          created_at?: string | null;
          transcription_chunk?: string | null;
          transcription_chunk_id?: never;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_transcription_chunks_analyses_chunk_id_fkey";
            columns: ["analyses_chunk_id"];
            isOneToOne: false;
            referencedRelation: "analyses_chunks";
            referencedColumns: ["analyses_chunk_id"];
          },
          {
            foreignKeyName: "public_transcription_chunks_analyses_chunk_id_fkey";
            columns: ["analyses_chunk_id"];
            isOneToOne: false;
            referencedRelation: "v_calls_with_analyses";
            referencedColumns: ["analyses_chunk_id"];
          },
          {
            foreignKeyName: "transcription_chunks_call_id_fkey";
            columns: ["call_id"];
            isOneToOne: false;
            referencedRelation: "calls";
            referencedColumns: ["call_id"];
          },
          {
            foreignKeyName: "transcription_chunks_call_id_fkey";
            columns: ["call_id"];
            isOneToOne: false;
            referencedRelation: "v_calls_with_analyses";
            referencedColumns: ["call_id"];
          }
        ];
      };
      transcriptions: {
        Row: {
          analyzed: boolean | null;
          call_control_id: string | null;
          created_at: string;
          id: number;
          transcription: string | null;
        };
        Insert: {
          analyzed?: boolean | null;
          call_control_id?: string | null;
          created_at?: string;
          id?: number;
          transcription?: string | null;
        };
        Update: {
          analyzed?: boolean | null;
          call_control_id?: string | null;
          created_at?: string;
          id?: number;
          transcription?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string | null;
          first_name: string | null;
          last_name: string | null;
          phone_number: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          phone_number?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          phone_number?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      v_calls_with_analyses: {
        Row: {
          analyses_chunk_id: number | null;
          call_control_id: string | null;
          call_id: number | null;
          call_start_datetime: string | null;
          category: string | null;
          confidence: number | null;
          created_at: string | null;
          previous_score: string | null;
          reasoning: string | null;
          score: number | null;
          sub_category: string | null;
          thread_id: string | null;
          transcription: string | null;
          updated_at: string | null;
        };
        Relationships: [];
      };
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
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
