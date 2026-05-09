import { useEffect, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  getNewsById,
  createNews,
  updateNews,
  slugify,
} from '../../services/newsService';
import { useAuditLog } from '../../hooks/useAuditLog';
import type { NewsFormData } from '../../services/newsService';
import type { PublishStatus, Lang } from '../../lib/database.types';

const EMPTY: NewsFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_url: '',
  lang: 'es',
  status: 'draft',
};

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'es', label: 'Español' },
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'English' },
];

const STATUS_OPTIONS: { value: PublishStatus; label: string }[] = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'published', label: 'Publicada' },
  { value: 'archived', label: 'Arquivada' },
];

export default function AdminNewsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { log } = useAuditLog();

  const [form, setForm] = useState<NewsFormData>(EMPTY);
  const [previousStatus, setPreviousStatus] = useState<PublishStatus>('draft');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

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
    <div className="max-w-3xl">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/noticias"
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0057A8] hover:bg-[#0057A8]/5 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
          {isEditing ? 'Editar notícia' : 'Nova notícia'}
        </h1>
      </div>

      {/* Erro */}
      {error && (
        <div role="alert" className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#1F2937] mb-1.5">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-[#1F2937] mb-1.5">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={form.slug}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] font-mono transition-colors"
            placeholder="url-da-noticia"
          />
          <p className="text-xs text-gray-400 mt-1">Apenas letras minúsculas, números e hífens.</p>
        </div>

        {/* Resumo */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-[#1F2937] mb-1.5">
            Resumo
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            value={form.excerpt}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-[#F5F7FA] resize-none focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors"
          />
        </div>

        {/* Conteúdo */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-[#1F2937] mb-1.5">
            Conteúdo
          </label>
          <textarea
            id="content"
            name="content"
            rows={10}
            value={form.content}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-[#F5F7FA] resize-y focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] font-mono transition-colors"
          />
        </div>

        {/* URL da capa */}
        <div>
          <label htmlFor="cover_url" className="block text-sm font-medium text-[#1F2937] mb-1.5">
            URL da imagem de capa
          </label>
          <input
            id="cover_url"
            name="cover_url"
            type="url"
            value={form.cover_url}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors"
            placeholder="https://..."
          />
          <p className="text-xs text-gray-400 mt-1">Upload de imagem será implementado em breve.</p>
        </div>

        {/* Idioma + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lang" className="block text-sm font-medium text-[#1F2937] mb-1.5">
              Idioma
            </label>
            <select
              id="lang"
              name="lang"
              value={form.lang}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors"
            >
              {LANG_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-[#1F2937] mb-1.5">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/noticias"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#D9A441] text-[#1F2937] hover:bg-[#c8942e] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Salvando…' : isEditing ? 'Salvar alterações' : 'Criar notícia'}
          </button>
        </div>
      </form>
    </div>
  );
}
