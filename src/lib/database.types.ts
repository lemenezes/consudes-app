export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_email: string
          created_at: string
          entity_id: string | null
          entity_title: string | null
          entity_type: string
          id: string
          metadata: Json
          reason: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_email: string
          created_at?: string
          entity_id?: string | null
          entity_title?: string | null
          entity_type: string
          id?: string
          metadata?: Json
          reason?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          actor_email?: string
          created_at?: string
          entity_id?: string | null
          entity_title?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
          reason?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          category: Database["public"]["Enums"]["calendar_event_category"]
          city: string | null
          country: string
          cover_url: string | null
          created_at: string
          date_precision: Database["public"]["Enums"]["date_precision"]
          description: string | null
          end_date: string | null
          event_status: Database["public"]["Enums"]["calendar_event_status"]
          event_type: Database["public"]["Enums"]["calendar_event_type"]
          featured: boolean
          federation: string | null
          full_description: string | null
          id: string
          link: string | null
          location_open: boolean
          slug: string
          sort_order: number
          sport: string
          start_date: string
          status: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["calendar_event_category"]
          city?: string | null
          country?: string
          cover_url?: string | null
          created_at?: string
          date_precision?: Database["public"]["Enums"]["date_precision"]
          description?: string | null
          end_date?: string | null
          event_status?: Database["public"]["Enums"]["calendar_event_status"]
          event_type?: Database["public"]["Enums"]["calendar_event_type"]
          featured?: boolean
          federation?: string | null
          full_description?: string | null
          id?: string
          link?: string | null
          location_open?: boolean
          slug: string
          sort_order?: number
          sport?: string
          start_date: string
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["calendar_event_category"]
          city?: string | null
          country?: string
          cover_url?: string | null
          created_at?: string
          date_precision?: Database["public"]["Enums"]["date_precision"]
          description?: string | null
          end_date?: string | null
          event_status?: Database["public"]["Enums"]["calendar_event_status"]
          event_type?: Database["public"]["Enums"]["calendar_event_type"]
          featured?: boolean
          federation?: string | null
          full_description?: string | null
          id?: string
          link?: string | null
          location_open?: boolean
          slug?: string
          sort_order?: number
          sport?: string
          start_date?: string
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      championships: {
        Row: {
          country: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          edition: string | null
          end_date: string | null
          id: string
          location: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["championship_status"]
          title: string
        }
        Insert: {
          country?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          edition?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["championship_status"]
          title: string
        }
        Update: {
          country?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          edition?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["championship_status"]
          title?: string
        }
        Relationships: []
      }
      federations: {
        Row: {
          acronym: string | null
          contact_email: string | null
          country: string
          country_code: string
          country_en: string | null
          country_es: string | null
          country_pt: string | null
          created_at: string
          facebook_url: string | null
          flag: string
          flickr_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          logo_url: string | null
          name: string
          name_en: string | null
          name_es: string | null
          name_pt: string | null
          sort_order: number
          tiktok_url: string | null
          twitter_url: string | null
          updated_at: string
          website_url: string | null
          youtube_url: string | null
        }
        Insert: {
          acronym?: string | null
          contact_email?: string | null
          country: string
          country_code: string
          country_en?: string | null
          country_es?: string | null
          country_pt?: string | null
          created_at?: string
          facebook_url?: string | null
          flag?: string
          flickr_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          name: string
          name_en?: string | null
          name_es?: string | null
          name_pt?: string | null
          sort_order?: number
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          acronym?: string | null
          contact_email?: string | null
          country?: string
          country_code?: string
          country_en?: string | null
          country_es?: string | null
          country_pt?: string | null
          created_at?: string
          facebook_url?: string | null
          flag?: string
          flickr_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          name?: string
          name_en?: string | null
          name_es?: string | null
          name_pt?: string | null
          sort_order?: number
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      former_presidents: {
        Row: {
          country: string | null
          created_at: string
          id: string
          name: string
          period_end: number | null
          period_start: number
          photo_url: string | null
          sort_order: number
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          name: string
          period_end?: number | null
          period_start: number
          photo_url?: string | null
          sort_order?: number
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          period_end?: number | null
          period_start?: number
          photo_url?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      gallery: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          media_type: Database["public"]["Enums"]["media_type"]
          media_url: string
          published_at: string | null
          sort_order: number
          title: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          media_url: string
          published_at?: string | null
          sort_order?: number
          title: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          media_url?: string
          published_at?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          admin_touched_at: number | null
          category: string
          city: string | null
          country: string | null
          cover_file: string | null
          cover_position: string | null
          created_at: string
          description: Json
          featured: boolean
          id: string
          photo_count: number
          photos: Json
          slug: string
          tier: string
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          admin_touched_at?: number | null
          category: string
          city?: string | null
          country?: string | null
          cover_file?: string | null
          cover_position?: string | null
          created_at?: string
          description?: Json
          featured?: boolean
          id?: string
          photo_count?: number
          photos?: Json
          slug: string
          tier?: string
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          admin_touched_at?: number | null
          category?: string
          city?: string | null
          country?: string | null
          cover_file?: string | null
          cover_position?: string | null
          created_at?: string
          description?: Json
          featured?: boolean
          id?: string
          photo_count?: number
          photos?: Json
          slug?: string
          tier?: string
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          lang: Database["public"]["Enums"]["content_lang"]
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          lang?: Database["public"]["Enums"]["content_lang"]
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          lang?: Database["public"]["Enums"]["content_lang"]
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          category: Database["public"]["Enums"]["report_category"]
          created_at: string
          description: string | null
          doc_date: string | null
          featured: boolean
          file_url: string | null
          id: string
          slug: string
          sort_order: number
          status: string
          title: string
          updated_at: string
          year: number
        }
        Insert: {
          category?: Database["public"]["Enums"]["report_category"]
          created_at?: string
          description?: string | null
          doc_date?: string | null
          featured?: boolean
          file_url?: string | null
          id?: string
          slug: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
          year: number
        }
        Update: {
          category?: Database["public"]["Enums"]["report_category"]
          created_at?: string
          description?: string | null
          doc_date?: string | null
          featured?: boolean
          file_url?: string | null
          id?: string
          slug?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      team_members: {
        Row: {
          country: string | null
          created_at: string
          id: string
          name: string
          photo_url: string | null
          role: string
          sort_order: number
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          role: string
          sort_order?: number
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          role?: string
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: { Args: { roles: string[] }; Returns: boolean }
    }
    Enums: {
      audit_action:
        | "create_news"
        | "edit_news"
        | "publish_news"
        | "unpublish_news"
        | "delete_news"
        | "upload_image"
        | "delete_image"
        | "create_report"
        | "delete_report"
        | "create_federation"
        | "edit_federation"
        | "delete_federation"
      calendar_event_category:
        | "interclubes"
        | "sub21"
        | "adulto"
        | "institucional"
        | "outro"
      calendar_event_status:
        | "upcoming"
        | "registrations_open"
        | "confirmed"
        | "finished"
      calendar_event_type:
        | "championship"
        | "interclubs"
        | "congress"
        | "assembly"
        | "institutional"
      championship_status: "upcoming" | "ongoing" | "finished"
      content_lang: "es" | "pt" | "en"
      date_precision: "full" | "month" | "year"
      media_type: "photo" | "video"
      publish_status: "draft" | "published" | "archived"
      report_category:
        | "relatorio"
        | "estatuto"
        | "regulamento"
        | "ata"
        | "prestacao_contas"
        | "documento_oficial"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      audit_action: [
        "create_news",
        "edit_news",
        "publish_news",
        "unpublish_news",
        "delete_news",
        "upload_image",
        "delete_image",
        "create_report",
        "delete_report",
        "create_federation",
        "edit_federation",
        "delete_federation",
      ],
      calendar_event_category: [
        "interclubes",
        "sub21",
        "adulto",
        "institucional",
        "outro",
      ],
      calendar_event_status: [
        "upcoming",
        "registrations_open",
        "confirmed",
        "finished",
      ],
      calendar_event_type: [
        "championship",
        "interclubs",
        "congress",
        "assembly",
        "institutional",
      ],
      championship_status: ["upcoming", "ongoing", "finished"],
      content_lang: ["es", "pt", "en"],
      date_precision: ["full", "month", "year"],
      media_type: ["photo", "video"],
      publish_status: ["draft", "published", "archived"],
      report_category: [
        "relatorio",
        "estatuto",
        "regulamento",
        "ata",
        "prestacao_contas",
        "documento_oficial",
      ],
    },
  },
} as const

