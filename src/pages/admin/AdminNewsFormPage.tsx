import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  getNewsById,
  createNews,
  updateNews,
  slugify,
} from '../../services/newsService';
import { hasPermission } from '../../utils/rbac';
import { useAuth } from '../../context/AuthContext';
import { useAuditLog } from '../../hooks/useAuditLog';
import { useLanguage } from '../../context/LanguageContext';
import CoverImageUpload from '../../components/CoverImageUpload';
import RichTextEditor from '../../components/RichTextEditor';
import { getOrphanedInlineUrls, getNewlyAddedInlineUrls, deleteInlineImageUrls } from '../../utils/inlineImageCleanup';
import type { NewsFormData } from '../../services/newsService';
import type { PublishStatus } from '../../lib/database.types';

const EMPTY: NewsFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_url: '',
  lang: 'es',
  status: 'draft',
};

export default function AdminNewsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { log } = useAuditLog();
  const { t } = useLanguage();
  const { profile } = useAuth();

  const STATUS_OPTIONS: { value: PublishStatus; label: string }[] = [
    { value: 'draft',     label: t.admin.status.draft },
    { value: 'published', label: t.admin.status.published },
    { value: 'archived',  label: t.admin.status.archived },
  ];

  const [form, setForm] = useState<NewsFormData>(EMPTY);
  const [previousStatus, setPreviousStatus] = useState<PublishStatus>('draft');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  // Conteúdo original carregado do banco — usado para detectar imagens órfãs
  const originalContentRef = useRef<string>('');

  // ── Carregar dados para edição ─────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    getNewsById(id).then(({ data, error }) => {
      if (error || !data) { setError(error ?? 'Notícia não encontrada.'); setLoading(false); return; }
      setForm({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt ?? '',
        content: data.content ?? '',
        cover_url: data.cover_url ?? '',
        lang: data.lang,
        status: data.status,
      });
      originalContentRef.current = data.content ?? '';
      setPreviousStatus(data.status);
      setSlugEdited(true); // slug já existe, não sobrescrever
      setLoading(false);
    });
  }, [id]);

  // ── Campos controlados ─────────────────────────────────────────────────
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // Auto-slug só quando criando e slug não foi editado manualmente
      if (name === 'title' && !slugEdited) {
        next.slug = slugify(value);
      }
      if (name === 'slug') setSlugEdited(true);
      return next;
    });
  };

  // ── Cancelar \u2014 limpa uploads n\u00e3o salvos ───────────────────────────────────
  const handleCancel = async () => {
    // Imagens adicionadas nesta sess\u00e3o mas ainda n\u00e3o salvas
    const toDelete = getNewlyAddedInlineUrls(originalContentRef.current, form.content);
    if (toDelete.length) {
      await deleteInlineImageUrls(toDelete);
    }
    navigate('/admin/noticias');
  };

  // ── Validação ──────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (!form.title.trim()) return 'Título é obrigatório.';
    if (!form.slug.trim()) return 'Slug é obrigatório.';
    if (!/^[a-z0-9-]+$/.test(form.slug)) return 'Slug deve conter apenas letras minúsculas, números e hífens.';
    return null;
  };

  // ── Salvar ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    // Proteção RBAC para create/update
    const actionType = isEditing ? 'update' : 'create';
    if (!profile || !hasPermission(profile.role, 'noticias', actionType)) {
      setError(t.admin.rbac.noPermission);
      return;
    }

    setSaving(true);
    setError(null);

    if (isEditing && id) {
      const { data, error } = await updateNews(id, form, previousStatus);
      if (error) { setError(error); setSaving(false); return; }

      const action =
        form.status === 'published' && previousStatus !== 'published'
          ? 'publish_news'
          : form.status !== 'published' && previousStatus === 'published'
          ? 'unpublish_news'
          : 'edit_news';

      await log({ action, entity_type: 'news', entity_id: data?.id, entity_title: form.title });

      // Limpar imagens inline removidas durante a edição
      const orphaned = getOrphanedInlineUrls(originalContentRef.current, form.content);
      if (orphaned.length) {
        await deleteInlineImageUrls(orphaned, (url) => {
          log({ action: 'delete_image', entity_type: 'news', entity_id: data?.id, entity_title: url });
        });
      }
      originalContentRef.current = form.content;
    } else {
      const { data, error } = await createNews(form);
      if (error) { setError(error); setSaving(false); return; }

      await log({
        action: form.status === 'published' ? 'publish_news' : 'create_news',
        entity_type: 'news',
        entity_id: data?.id,
        entity_title: form.title,
      });
    }

    navigate('/admin/noticias');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 border-4 border-[#0057A8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 overflow-x-hidden">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/admin/noticias"
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0057A8] hover:bg-[#0057A8]/5 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
            {isEditing ? t.admin.editNews : t.admin.newNews}
          </p>
          <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937] leading-none">
            {form.title || <span className="text-gray-300">{t.admin.noTitle}</span>}
          </h1>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div role="alert" className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Slug — oculto */}
        <input type="hidden" name="slug" value={form.slug} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 sm:gap-6 items-start">

          {/* ── COLUNA PRINCIPAL ─────────────────────────────────────── */}
          <div className="space-y-5">

            {/* TÍTULO — input editorial grande */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-4 sm:px-6 sm:py-5">
              <label htmlFor="title" className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                {t.admin.titleLabel} <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={form.title}
                onChange={handleChange}
                placeholder={t.admin.titlePlaceholder}
                className="w-full text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937] bg-transparent border-0 focus:outline-none placeholder:text-gray-300 leading-snug"
              />
            </div>

            {/* IMAGEM DE CAPA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-50 bg-gray-50/60 sm:px-6 sm:py-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{t.admin.coverLabel}</span>
              </div>
              <div className="p-3 sm:p-6">
                <CoverImageUpload
                  value={form.cover_url}
                  onChange={(url) => setForm((prev) => ({ ...prev, cover_url: url }))}
                />
              </div>
            </div>

            {/* CONTEÚDO EDITORIAL — protagonista */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between sm:px-6 sm:py-3.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{t.admin.contentLabel}</span>
                <span className="text-[10px] text-gray-300 font-medium">Rich Text</span>
              </div>
              <div className="p-2 sm:p-4">
                <RichTextEditor
                  value={form.content}
                  onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
                  placeholder={t.admin.contentPlaceholder}
                />
              </div>
            </div>

            {/* AÇÕES + STATUS — ao final do fluxo editorial */}
            <div className="pt-2 pb-8 space-y-3 px-1 sm:px-0">
              {/* Status — acima das ações */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400">{t.admin.statusLabel}:</span>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors"
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              {/* Botões */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-[#1F2937] hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all w-full sm:w-auto"
                >
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#0057A8] text-white hover:bg-[#004a8f] shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all w-full sm:w-auto"
                >
                  {saving ? t.admin.saving : isEditing ? t.admin.saveChanges : t.admin.publish}
                </button>
              </div>
            </div>

          </div>

          {/* ── SIDEBAR vazia — reservada para metadados futuros ─────── */}
          <div className="hidden lg:block" />
        </div>
      </form>
    </div>
  );
}
