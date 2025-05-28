export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          additional_comments: string | null
          created_at: string
          current_address: string
          current_city: string
          current_employer: string | null
          current_postal_code: string
          current_province: string
          date_of_birth: string
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relation: string
          employment_length: string | null
          employment_status: string
          first_name: string
          has_been_evicted: boolean
          has_pets: boolean
          id: string
          last_name: string
          monthly_income: number | null
          move_in_date: string
          number_of_occupants: number
          pet_details: string | null
          phone: string
          property_id: string
          reference_name: string | null
          reference_phone: string | null
          reference_relation: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          additional_comments?: string | null
          created_at?: string
          current_address: string
          current_city: string
          current_employer?: string | null
          current_postal_code: string
          current_province: string
          date_of_birth: string
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relation: string
          employment_length?: string | null
          employment_status: string
          first_name: string
          has_been_evicted?: boolean
          has_pets?: boolean
          id?: string
          last_name: string
          monthly_income?: number | null
          move_in_date: string
          number_of_occupants?: number
          pet_details?: string | null
          phone: string
          property_id: string
          reference_name?: string | null
          reference_phone?: string | null
          reference_relation?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          additional_comments?: string | null
          created_at?: string
          current_address?: string
          current_city?: string
          current_employer?: string | null
          current_postal_code?: string
          current_province?: string
          date_of_birth?: string
          email?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          emergency_contact_relation?: string
          employment_length?: string | null
          employment_status?: string
          first_name?: string
          has_been_evicted?: boolean
          has_pets?: boolean
          id?: string
          last_name?: string
          monthly_income?: number | null
          move_in_date?: string
          number_of_occupants?: number
          pet_details?: string | null
          phone?: string
          property_id?: string
          reference_name?: string | null
          reference_phone?: string | null
          reference_relation?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string
          file_path: string
          file_size: number
          id: string
          mime_type: string
          name: string
          original_name: string
          property_id: string | null
          updated_at: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          category: string
          file_path: string
          file_size: number
          id?: string
          mime_type: string
          name: string
          original_name: string
          property_id?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          category?: string
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string
          name?: string
          original_name?: string
          property_id?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          recipient_email: string
          sent_at: string | null
          status: string | null
          subject: string
          template_name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email: string
          sent_at?: string | null
          status?: string | null
          subject: string
          template_name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string
          id: string
          name: string
          subject: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          html_content: string
          id?: string
          name: string
          subject: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          html_content?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      lease_tenants: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          lease_id: string
          tenant_email: string | null
          tenant_name: string
          tenant_phone: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          lease_id: string
          tenant_email?: string | null
          tenant_name: string
          tenant_phone?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          lease_id?: string
          tenant_email?: string | null
          tenant_name?: string
          tenant_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lease_tenants_lease_id_fkey"
            columns: ["lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["id"]
          },
        ]
      }
      leases: {
        Row: {
          created_at: string
          has_pets: boolean | null
          id: string
          landlord_id: string
          lease_end_date: string
          lease_start_date: string
          monthly_rent: number
          pet_deposit: number | null
          property_id: string
          reminder_settings: Json | null
          security_deposit: number
          snow_grass_responsibility: string | null
          special_terms: string | null
          status: string
          tenant_id: string | null
          tenant_name: string
          updated_at: string
          utilities_included: string[] | null
        }
        Insert: {
          created_at?: string
          has_pets?: boolean | null
          id?: string
          landlord_id: string
          lease_end_date: string
          lease_start_date: string
          monthly_rent: number
          pet_deposit?: number | null
          property_id: string
          reminder_settings?: Json | null
          security_deposit: number
          snow_grass_responsibility?: string | null
          special_terms?: string | null
          status?: string
          tenant_id?: string | null
          tenant_name: string
          updated_at?: string
          utilities_included?: string[] | null
        }
        Update: {
          created_at?: string
          has_pets?: boolean | null
          id?: string
          landlord_id?: string
          lease_end_date?: string
          lease_start_date?: string
          monthly_rent?: number
          pet_deposit?: number | null
          property_id?: string
          reminder_settings?: Json | null
          security_deposit?: number
          snow_grass_responsibility?: string | null
          special_terms?: string | null
          status?: string
          tenant_id?: string | null
          tenant_name?: string
          updated_at?: string
          utilities_included?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "leases_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leases_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leases_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          app_alerts: boolean
          billing_alerts: boolean
          created_at: string
          lease_reminders: boolean
          maintenance_alerts: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          app_alerts?: boolean
          billing_alerts?: boolean
          created_at?: string
          lease_reminders?: boolean
          maintenance_alerts?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          app_alerts?: boolean
          billing_alerts?: boolean
          created_at?: string
          lease_reminders?: boolean
          maintenance_alerts?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          is_read: boolean
          metadata: Json | null
          priority: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean
          metadata?: Json | null
          priority?: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean
          metadata?: Json | null
          priority?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          id: string
          order_type: string | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          order_type?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          order_type?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_created_at: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          subscription_plan: string | null
          updated_at: string
        }
        Insert: {
          account_created_at?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subscription_plan?: string | null
          updated_at?: string
        }
        Update: {
          account_created_at?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subscription_plan?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amenities: string[] | null
          available_date: string | null
          bathrooms: number | null
          bedrooms: number | null
          city: string
          created_at: string
          description: string | null
          id: string
          is_available: boolean
          landlord_id: string
          monthly_rent: number
          postal_code: string
          property_type: string | null
          province: string
          square_feet: number | null
          title: string
          unit_count: number | null
          updated_at: string
        }
        Insert: {
          address: string
          amenities?: string[] | null
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean
          landlord_id: string
          monthly_rent: number
          postal_code: string
          property_type?: string | null
          province: string
          square_feet?: number | null
          title: string
          unit_count?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          amenities?: string[] | null
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean
          landlord_id?: string
          monthly_rent?: number
          postal_code?: string
          property_type?: string | null
          province?: string
          square_feet?: number | null
          title?: string
          unit_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          billing_cycle: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          usage_applications: number | null
          usage_properties: number | null
          usage_storage: number | null
          user_id: string
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          usage_applications?: number | null
          usage_properties?: number | null
          usage_storage?: number | null
          user_id: string
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          usage_applications?: number | null
          usage_properties?: number | null
          usage_storage?: number | null
          user_id?: string
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
      user_role: "landlord" | "tenant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["landlord", "tenant"],
    },
  },
} as const
