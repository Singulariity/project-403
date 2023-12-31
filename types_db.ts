export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      advisors: {
        Row: {
          department: Database["public"]["Enums"]["Department"] | null
          name: string
          password: string
          surname: string
          username: string
        }
        Insert: {
          department?: Database["public"]["Enums"]["Department"] | null
          name: string
          password: string
          surname: string
          username?: string
        }
        Update: {
          department?: Database["public"]["Enums"]["Department"] | null
          name?: string
          password?: string
          surname?: string
          username?: string
        }
        Relationships: []
      }
      cifs: {
        Row: {
          company_name: string
          country: string
          created_at: string
          id: number
          intern_end_date: string
          intern_start_date: string
          is_accepted: boolean | null
          pdf_path: string
          remark: string | null
          student_no: number
        }
        Insert: {
          company_name: string
          country: string
          created_at?: string
          id?: number
          intern_end_date: string
          intern_start_date: string
          is_accepted?: boolean | null
          pdf_path: string
          remark?: string | null
          student_no: number
        }
        Update: {
          company_name?: string
          country?: string
          created_at?: string
          id?: number
          intern_end_date?: string
          intern_start_date?: string
          is_accepted?: boolean | null
          pdf_path?: string
          remark?: string | null
          student_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "cifs_student_no_fkey"
            columns: ["student_no"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["no"]
          }
        ]
      }
      logbooks: {
        Row: {
          created_at: string
          id: number
          is_accepted: boolean | null
          remark: string | null
          student_no: number
          submit_date: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_accepted?: boolean | null
          remark?: string | null
          student_no: number
          submit_date?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_accepted?: boolean | null
          remark?: string | null
          student_no?: number
          submit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logbooks_student_no_fkey"
            columns: ["student_no"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["no"]
          }
        ]
      }
      oral_exams: {
        Row: {
          created_at: string
          date: string
          id: number
          is_accepted: boolean | null
          remark: string | null
          student_no: number
        }
        Insert: {
          created_at?: string
          date: string
          id?: number
          is_accepted?: boolean | null
          remark?: string | null
          student_no: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: number
          is_accepted?: boolean | null
          remark?: string | null
          student_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "oral_exams_student_no_fkey"
            columns: ["student_no"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["no"]
          }
        ]
      }
      sessions: {
        Row: {
          advisor_username: string
          expires_at: string
          id: number
          token: string
        }
        Insert: {
          advisor_username: string
          expires_at: string
          id?: number
          token: string
        }
        Update: {
          advisor_username?: string
          expires_at?: string
          id?: number
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_advisor_username_fkey"
            columns: ["advisor_username"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["username"]
          }
        ]
      }
      students: {
        Row: {
          created_at: string
          department: Database["public"]["Enums"]["Department"]
          email: string
          finished_at: string | null
          name: string
          no: number
          started_at: string
          surname: string
        }
        Insert: {
          created_at?: string
          department: Database["public"]["Enums"]["Department"]
          email: string
          finished_at?: string | null
          name: string
          no: number
          started_at?: string
          surname: string
        }
        Update: {
          created_at?: string
          department?: Database["public"]["Enums"]["Department"]
          email?: string
          finished_at?: string | null
          name?: string
          no?: number
          started_at?: string
          surname?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      "CIF Status": "Accepted" | "Denied" | "Waiting"
      Department:
        | "CO"
        | "COTR"
        | "EE"
        | "EETR"
        | "IE"
        | "ES"
        | "ME"
        | "AE"
        | "CE"
      Semester: "Fall" | "Spring"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
