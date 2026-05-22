import { useEffect, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  getCalendarEventById,
  createCalendarEvent,
  updateCalendarEvent,
  slugify,
  EMPTY_FORM,
} from '../../services/calendarService';
import { hasPermission } from '../../utils/rbac';
import { useAuth } from '../../context/AuthContext';
import { useAuditLog } from '../../hooks/useAuditLog';
import { useLanguage } from '../../context/LanguageContext';
import type { CalendarEventFormData } from '../../services/calendarService';
import type {
  PublishStatus,
  CalendarEventCategory,
  CalendarEventType,
  CalendarEventStatus,
  DatePrecision,
} from '../../lib/database.types';

// ── Opções de selects ─────────────────────────────────────────────────────

const CATEGORIES: CalendarEventCategory[] = ['interclubes', 'sub21', 'adulto', 'institucional', 'outro'];
const EVENT_TYPES: CalendarEventType[] = ['championship', 'interclubs', 'congress', 'assembly', 'institutional'];
const EVENT_STATUSES: CalendarEventStatus[] = ['upcoming', 'registrations_open', 'confirmed', 'finished'];
const DATE_PRECISIONS: DatePrecision[] = ['full', 'month', 'year'];
const PUBLISH_STATUSES: PublishStatus[] = ['draft', 'published', 'archived'];

// ── Componente de campo ───────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors placeholder:text-gray-300';

const selectCls =
  'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors';

// ── Página ────────────────────────────────────────────────────────────────

export default function AdminCalendarFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { log } = useAuditLog();
  const { t } = useLanguage();
  const ac = t.admin.calendar;
  const { profile } = useAuth();

  const [form, setForm] = useState<CalendarEventFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  // ── Carregar para edição ──────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    getCalendarEventById(id).then(({ data, error }) => {
      if (error || !data) {
        setError(error ?? 'Evento não encontrado.');
        setLoading(false);
        return;
      }
      setForm({
        title:            data.title,
        slug:             data.slug,
        description:      data.description ?? '',
        full_description: data.full_description ?? '',
        start_date:       data.start_date,
        end_date:         data.end_date ?? '',
        date_precision:   data.date_precision,
        country:          data.country,
        city:             data.city ?? '',
        venue:            data.venue ?? '',
        location_open:    data.location_open,
        sport:            data.sport,
        category:         data.category,
        event_type:       data.event_type,
        event_status:     data.event_status,
        federation:       data.federation ?? '',
        link:             data.link ?? '',
        cover_url:        data.cover_url ?? '',
        status:           data.status,
        featured:         data.featured,
        sort_order:       data.sort_order,
      });
      setSlugEdited(true);
      setLoading(false);
    });
  }, [id]);

  // ── Campos controlados ────────────────────────────────────────────────
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'title' && !slugEdited) {
        next.slug = slugify(value);
      }
      if (name === 'slug') setSlugEdited(true);
      return next;
    });
  };

  // ── Validação ─────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (!form.title.trim()) return 'Título é obrigatório.';
    if (!form.slug.trim()) return 'Slug é obrigatório.';
    if (!/^[a-z0-9-]+$/.test(form.slug)) return 'Slug deve conter apenas letras minúsculas, números e hífens.';
    if (!form.start_date) return 'Data de início é obrigatória.';
    return null;
  };

  // ── Salvar ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    // Proteção RBAC para create/update
    const actionType = isEditing ? 'update' : 'create';
    if (!profile || !hasPermission(profile.role, 'calendario', actionType)) {
      setError(t.admin.rbac.noPermission);
      return;
    }

    setSaving(true);
    setError(null);

    if (isEditing && id) {
      const { data, error } = await updateCalendarEvent(id, form);
      if (error) { setError(error); setSaving(false); return; }
      await log({
        action: 'edit_calendar_event',
        entity_type: 'calendar_event',
        entity_id: data?.id,
        entity_title: form.title,
      });
    } else {
      const { data, error } = await createCalendarEvent(form);
      if (error) { setError(error); setSaving(false); return; }
      await log({
        action: form.status === 'published' ? 'publish_calendar_event' : 'create_calendar_event',
        entity_type: 'calendar_event',
        entity_id: data?.id,
        entity_title: form.title,
      });
    }

    navigate('/admin/calendario');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 border-4 border-[#0057A8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/admin/calendario"
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0057A8] hover:bg-[#0057A8]/5 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
            {isEditing ? ac.edit : ac.new}
          </p>
          <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937] leading-none">
            {form.title || <span className="text-gray-300">{t.admin.noTitle}</span>}
          </h1>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-5">

          {/* ── Bloco: Identificação ────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Identificação</p>

            <Field label={t.admin.titleLabel} required>
              <input
                name="title"
                type="text"
                required
                value={form.title}
                onChange={handleChange}
                placeholder={ac.titlePlaceholder}
                className="w-full text-xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937] bg-transparent border-0 border-b border-gray-200 pb-2 focus:outline-none focus:border-[#0057A8] placeholder:text-gray-300 leading-snug"
              />
            </Field>

            {/* Slug — oculto */}
            <input type="hidden" name="slug" value={form.slug} />

            <Field label={ac.descriptionLabel}>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                className={inputCls}
                placeholder="Breve descrição do evento…"
              />
            </Field>

            <Field label={ac.fullDescLabel}>
              <textarea
                name="full_description"
                value={form.full_description}
                onChange={handleChange}
                rows={4}
                className={inputCls}
              />
            </Field>
          </div>

          {/* ── Bloco: Datas ───────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Datas</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label={ac.datePrecisionLabel} required>
                <select name="date_precision" value={form.date_precision} onChange={handleChange} className={selectCls}>
                  {DATE_PRECISIONS.map((p) => (
                    <option key={p} value={p}>{ac.datePrecision[p]}</option>
                  ))}
                </select>
              </Field>
              <Field label={ac.startDateLabel} required>
                <input
                  name="start_date"
                  type="date"
                  required
                  value={form.start_date}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>
              <Field label={ac.endDateLabel}>
                <input
                  name="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* ── Bloco: Localização ─────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Localização</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={ac.countryLabel}>
                <input name="country" type="text" value={form.country} onChange={handleChange} className={inputCls} placeholder="Argentina" />
              </Field>
              <Field label={ac.cityLabel}>
                <input name="city" type="text" value={form.city} onChange={handleChange} className={inputCls} placeholder="Buenos Aires" />
              </Field>
              <Field label={ac.venueLabel}>
                <input name="venue" type="text" value={form.venue} onChange={handleChange} className={inputCls} />
              </Field>
              <Field label={ac.locationOpenLabel}>
                <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                  <input
                    name="location_open"
                    type="checkbox"
                    checked={form.location_open}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 accent-[#0057A8]"
                  />
                  <span className="text-sm text-gray-600">{ac.locationOpenLabel}</span>
                </label>
              </Field>
            </div>
          </div>

          {/* ── Bloco: Classificação ───────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Classificação</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={ac.sportLabel} required>
                <input name="sport" type="text" required value={form.sport} onChange={handleChange} className={inputCls} placeholder="Fútbol Sala" />
              </Field>
              <Field label={ac.categoryLabel} required>
                <select name="category" value={form.category} onChange={handleChange} className={selectCls}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{ac.categories[c]}</option>
                  ))}
                </select>
              </Field>
              <Field label={ac.eventTypeLabel} required>
                <select name="event_type" value={form.event_type} onChange={handleChange} className={selectCls}>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>{ac.eventTypes[t]}</option>
                  ))}
                </select>
              </Field>
              <Field label={ac.eventStatusLabel} required>
                <select name="event_status" value={form.event_status} onChange={handleChange} className={selectCls}>
                  {EVENT_STATUSES.map((s) => (
                    <option key={s} value={s}>{ac.eventStatuses[s]}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* ── Bloco: Metadados extras ────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Metadados</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={ac.federationLabel}>
                <input name="federation" type="text" value={form.federation} onChange={handleChange} className={inputCls} placeholder="CONSUDES" />
              </Field>
              <Field label={ac.linkLabel}>
                <input name="link" type="url" value={form.link} onChange={handleChange} className={inputCls} placeholder="https://…" />
              </Field>
              <Field label={ac.coverLabel}>
                <input name="cover_url" type="url" value={form.cover_url} onChange={handleChange} className={inputCls} placeholder="https://…" />
              </Field>
              <Field label={ac.sortOrderLabel}>
                <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className={inputCls} min={0} />
              </Field>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none mt-2">
              <input
                name="featured"
                type="checkbox"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 accent-[#D9A441]"
              />
              <span className="text-sm text-gray-600">{ac.featuredLabel}</span>
            </label>
          </div>

          {/* ── Ações ─────────────────────────────────────────────────── */}
          <div className="pt-2 pb-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400">{t.admin.statusLabel}:</span>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors"
              >
                {PUBLISH_STATUSES.map((s) => (
                  <option key={s} value={s}>{t.admin.status[s]}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/admin/calendario')}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-[#1F2937] hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all"
              >
                {t.admin.cancel}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-xl text-sm font-semibold bg-[#0057A8] text-white hover:bg-[#004a8f] shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {saving ? t.admin.saving : isEditing ? t.admin.saveChanges : ac.new}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
