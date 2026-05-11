// Tipos gerados manualmente para o CMS institucional da CONSUDES.
// Rode `supabase gen types typescript` após criar as tabelas no Supabase.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ── Enums ────────────────────────────────────────────────────────────────────

export type Lang = 'es' | 'pt' | 'en';
export type PublishStatus = 'draft' | 'published' | 'archived';
export type ReportCategory =
  | 'relatorio'
  | 'estatuto'
  | 'regulamento'
  | 'ata'
  | 'prestacao_contas'
  | 'documento_oficial';

export interface ReportRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: ReportCategory;
  year: number;
  doc_date: string | null;
  file_url: string | null;
  status: PublishStatus;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
export type ChampionshipStatus = 'upcoming' | 'ongoing' | 'finished';
export type AuditAction =
  | 'create_news' | 'edit_news' | 'publish_news' | 'unpublish_news' | 'delete_news'
  | 'upload_image' | 'delete_image'
  | 'create_report' | 'delete_report'
  | 'create_federation' | 'edit_federation' | 'delete_federation'
  | 'create_calendar_event' | 'edit_calendar_event' | 'publish_calendar_event'
  | 'unpublish_calendar_event' | 'delete_calendar_event';

// ── Calendar event enums ──────────────────────────────────────────────────────

export type CalendarEventCategory = 'interclubes' | 'sub21' | 'adulto' | 'institucional' | 'outro';
export type CalendarEventType = 'championship' | 'interclubs' | 'congress' | 'assembly' | 'institutional';
export type CalendarEventStatus = 'upcoming' | 'registrations_open' | 'confirmed' | 'finished';
export type DatePrecision = 'full' | 'month' | 'year';

export interface CalendarEventRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  full_description: string | null;
  start_date: string; // date as YYYY-MM-DD
  end_date: string | null;
  date_precision: DatePrecision;
  country: string;
  city: string | null;
  venue: string | null;
  location_open: boolean;
  sport: string;
  category: CalendarEventCategory;
  event_type: CalendarEventType;
  event_status: CalendarEventStatus;
  federation: string | null;
  link: string | null;
  cover_url: string | null;
  status: PublishStatus;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ── Enums — legado marketplace ───────────────────────────────────────────────


export type ProfileRole = 'user' | 'resident' | 'admin';
export type ProfileStatus = 'approved' | 'suspended';
export type AccessRequestStatus = 'pending' | 'approved' | 'rejected';

// ── Database schema ──────────────────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {

      /** Notícias e avisos oficiais */
      news: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          cover_url: string | null;
          lang: Lang;
          status: PublishStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          cover_url?: string | null;
          lang?: Lang;
          status?: PublishStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          cover_url?: string | null;
          lang?: Lang;
          status?: PublishStatus;
          published_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      /** Federações afiliadas */
      federations: {
        Row: {
          id: string;
          name: string;
          country: string;
          country_code: string;
          logo_url: string | null;
          website_url: string | null;
          contact_email: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          country: string;
          country_code: string;
          logo_url?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          country?: string;
          country_code?: string;
          logo_url?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };

      /** Documentos de transparência (informes, atas, estatutos) */
      reports: {
        Row: {
          id: string;
          title: string;
          category: ReportCategory;
          file_url: string;
          year: number | null;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: ReportCategory;
          file_url: string;
          year?: number | null;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: ReportCategory;
          file_url?: string;
          year?: number | null;
          description?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };

      /** Galeria de fotos e vídeos */
      gallery: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          media_url: string;
          media_type: 'photo' | 'video';
          cover_url: string | null;
          sort_order: number;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          media_url: string;
          media_type?: 'photo' | 'video';
          cover_url?: string | null;
          sort_order?: number;
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          media_url?: string;
          media_type?: 'photo' | 'video';
          cover_url?: string | null;
          sort_order?: number;
          published_at?: string | null;
        };
        Relationships: [];
      };

      /** Campeonatos e competições */
      championships: {
        Row: {
          id: string;
          title: string;
          edition: string | null;
          location: string | null;
          country: string | null;
          start_date: string | null;
          end_date: string | null;
          status: ChampionshipStatus;
          cover_url: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          edition?: string | null;
          location?: string | null;
          country?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: ChampionshipStatus;
          cover_url?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          edition?: string | null;
          location?: string | null;
          country?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: ChampionshipStatus;
          cover_url?: string | null;
          description?: string | null;
        };
        Relationships: [];
      };

      /** Membros da equipe atual */
      team_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          country: string | null;
          photo_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          country?: string | null;
          photo_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          country?: string | null;
          photo_url?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };

      /** Ex-presidentes */
      former_presidents: {
        Row: {
          id: string;
          name: string;
          country: string | null;
          period_start: number;
          period_end: number | null;
          photo_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          country?: string | null;
          period_start: number;
          period_end?: number | null;
          photo_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          country?: string | null;
          period_start?: number;
          period_end?: number | null;
          photo_url?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };



      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          block: string | null;
          apartment: string | null;
          role: ProfileRole;
          status: ProfileStatus;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          block?: string | null;
          apartment?: string | null;
          role?: ProfileRole;
          status?: ProfileStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          block?: string | null;
          apartment?: string | null;
          role?: ProfileRole;
          status?: ProfileStatus;
          created_at?: string;
        };
        Relationships: [];
      };

      access_requests: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          block: string;
          apartment: string;
          message: string | null;
          status: AccessRequestStatus;
          created_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          rejection_reason: string | null;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          block: string;
          apartment: string;
          message?: string | null;
          status?: AccessRequestStatus;
          created_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          rejection_reason?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          block?: string;
          apartment?: string;
          message?: string | null;
          status?: AccessRequestStatus;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          rejection_reason?: string | null;
        };
        Relationships: [];
      };

      /** Log de auditoria das ações administrativas */
      admin_audit_logs: {
        Row: {
          id: string;
          actor_email: string;
          action: AuditAction;
          entity_type: string;
          entity_id: string | null;
          entity_title: string | null;
          reason: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_email: string;
          action: AuditAction;
          entity_type: string;
          entity_id?: string | null;
          entity_title?: string | null;
          reason?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Record<string, never>; // imutável após inserido
        Relationships: [];
      };

      /** Eventos do calendário esportivo institucional */
      calendar_events: {
        Row: CalendarEventRow;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          full_description?: string | null;
          start_date: string;
          end_date?: string | null;
          date_precision?: DatePrecision;
          country?: string;
          city?: string | null;
          venue?: string | null;
          location_open?: boolean;
          sport?: string;
          category?: CalendarEventCategory;
          event_type?: CalendarEventType;
          event_status?: CalendarEventStatus;
          federation?: string | null;
          link?: string | null;
          cover_url?: string | null;
          status?: PublishStatus;
          featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          full_description?: string | null;
          start_date?: string;
          end_date?: string | null;
          date_precision?: DatePrecision;
          country?: string;
          city?: string | null;
          venue?: string | null;
          location_open?: boolean;
          sport?: string;
          category?: CalendarEventCategory;
          event_type?: CalendarEventType;
          event_status?: CalendarEventStatus;
          federation?: string | null;
          link?: string | null;
          cover_url?: string | null;
          status?: PublishStatus;
          featured?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };

    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// ── Helpers de tipo — CMS CONSUDES ───────────────────────────────────────────

export type NewsRow            = Database['public']['Tables']['news']['Row'];
export type FederationRow      = Database['public']['Tables']['federations']['Row'];
export type GalleryRow         = Database['public']['Tables']['gallery']['Row'];
export type ChampionshipRow    = Database['public']['Tables']['championships']['Row'];
export type TeamMemberRow      = Database['public']['Tables']['team_members']['Row'];
export type FormerPresidentRow = Database['public']['Tables']['former_presidents']['Row'];
export type AuditLogRow        = Database['public']['Tables']['admin_audit_logs']['Row'];
export type AuditLogInsert     = Database['public']['Tables']['admin_audit_logs']['Insert'];

export type ProfileRow       = Database['public']['Tables']['profiles']['Row'];
export type AccessRequestRow = Database['public']['Tables']['access_requests']['Row'];

