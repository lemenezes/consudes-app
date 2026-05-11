import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  getReportById,
  createReport,
  updateReport,
  slugify,
  uploadReportPdf,
  validatePdfFile,
  REPORT_CATEGORIES,
} from '../../services/reportsService';
import { useAuditLog } from '../../hooks/useAuditLog';
import { useLanguage } from '../../context/LanguageContext';
import type { ReportFormData } from '../../services/reportsService';
import type { PublishStatus } from '../../lib/database.types';

const EMPTY: ReportFormData = {
  title: '',
  slug: '',
  description: '',
  category: 'documento_oficial',
  year: new Date().getFullYear(),
  doc_date: '',
  file_url: '',
  status: 'draft',
  featured: false,
  sort_order: 0,
};

export default function AdminReportsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { log } = useAuditLog();
  const { t } = useLanguage();
  const tr = t.admin.reports;
  const catLabels = t.transparencyPage.categories as Record<string, string>;
  const statusOptions: { value: PublishStatus; label: string }[] = [
    { value: 'draft',     label: tr.statusLabels.draft },
    { value: 'published', label: tr.statusLabels.published },
    { value: 'archived',  label: tr.statusLabels.archived },
  ];

  const [form, setForm] = useState<ReportFormData>(EMPTY);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Carregar dados para edição ─────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    getReportById(id).then(({ data, error }) => {
      if (error || !data) { setError(error ?? 'Documento não encontrado.'); setLoading(false); return; }
      setForm({
        title: data.title,
        slug: data.slug,
        description: data.description ?? '',
        category: data.category,
        year: data.year,
        doc_date: data.doc_date ?? '',
        file_url: data.file_url ?? '',
        status: data.status as PublishStatus,
        featured: data.featured,
        sort_order: data.sort_order,
      });
      setSlugEdited(true);
      setLoading(false);
    });
  }, [id]);

  // ── Campos controlados ─────────────────────────────────────────────────
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'title' && !slugEdited) next.slug = slugify(value);
      if (name === 'slug') setSlugEdited(true);
      return next;
    });
  };

  // ── Upload PDF ─────────────────────────────────────────────────────────
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validatePdfFile(file);
    if (err) { setError(err); return; }

    setUploading(true);
    const { url, error } = await uploadReportPdf(file);
    setUploading(false);

    if (error) { setError(error); return; }
    setForm((prev) => ({ ...prev, file_url: url ?? '' }));
  };

  // ── Validação ──────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (!form.title.trim()) return tr.validTitle;
    if (!form.slug.trim()) return tr.validSlug;
    if (!/^[a-z0-9-]+$/.test(form.slug)) return tr.validSlugFormat;
    if (!form.year || form.year < 1900 || form.year > 2100) return tr.validYear;
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
      const { error } = await updateReport(id, form);
      if (error) { setError(error); setSaving(false); return; }
      await log({ action: 'create_report', entity_type: 'report', entity_id: id, entity_title: form.title });
      navigate('/admin/transparencia');
    } else {
      const { data, error } = await createReport(form);
      if (error) { setError(error); setSaving(false); return; }
      await log({ action: 'create_report', entity_type: 'report', entity_id: data?.id, entity_title: form.title });
      navigate('/admin/transparencia');
    }
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded-2xl" />;
  }

  // ── Classes reutilizadas ───────────────────────────────────────────────
  const inputCls = 'w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#003B73]/30 placeholder:text-gray-300';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

  return (
    <div className="max-w-3xl">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin/transparencia" className="text-gray-400 hover:text-[#003B73] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
          {isEditing ? tr.formTitleEdit : tr.formTitleNew}
        </h1>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Título + slug */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1F2937]">{tr.sectionIdentification}</h2>

          <div>
            <label htmlFor="title" className={labelCls}>{tr.labelTitle} *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              placeholder={tr.placeholderTitle}
              className={inputCls}
            />
          </div>

          {/* Slug — oculto, gerado automaticamente do título */}
          <input type="hidden" name="slug" value={form.slug} />

          <div>
            <label htmlFor="description" className={labelCls}>{tr.labelDesc}</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              placeholder={tr.placeholderDesc}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        {/* Categoria + ano + data */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1F2937]">{tr.sectionClassification}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label htmlFor="category" className={labelCls}>{tr.labelCategory} *</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputCls}
              >
                {REPORT_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{catLabels[c.value] ?? c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className={labelCls}>{tr.labelYear} *</label>
              <input
                id="year"
                name="year"
                type="number"
                min={1900}
                max={2100}
                value={form.year}
                onChange={handleChange}
                required
                className={`${inputCls} font-mono`}
              />
            </div>

            <div>
              <label htmlFor="doc_date" className={labelCls}>{tr.labelDocDate}</label>
              <input
                id="doc_date"
                name="doc_date"
                type="date"
                value={form.doc_date}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Upload PDF */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1F2937]">{tr.sectionFile}</h2>

          {form.file_url ? (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
              <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-green-700 font-medium">{tr.pdfLinked}</p>
                <a href={form.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:text-green-800 underline truncate block">
                  {form.file_url.split('/').pop()?.split('?')[0] ?? 'arquivo.pdf'}
                </a>
              </div>
              <button
                type="button"
                onClick={() => { setForm((p) => ({ ...p, file_url: '' })); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="text-green-600 hover:text-red-500 transition-colors p-1"
                aria-label={tr.pdfRemove}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-[#003B73]/40 hover:bg-blue-50/30 transition-colors">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              {uploading ? (
                <p className="text-sm text-[#003B73]">{tr.pdfUploading}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-500">{tr.pdfClickUpload}</p>
                  <p className="text-xs text-gray-400">{tr.pdfMaxSize}</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          )}

          <div>
            <label htmlFor="file_url" className={labelCls}>{tr.pdfPasteUrl}</label>
            <input
              id="file_url"
              name="file_url"
              type="url"
              value={form.file_url}
              onChange={handleChange}
              placeholder={tr.placeholderUrl}
              className={inputCls}
            />
          </div>
        </div>

        {/* Publicação */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1F2937]">{tr.sectionPublication}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status" className={labelCls}>{tr.labelStatus} *</label>
              <select id="status" name="status" value={form.status} onChange={handleChange} className={inputCls}>
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort_order" className={labelCls}>{tr.labelOrder}</label>
              <input
                id="sort_order"
                name="sort_order"
                type="number"
                value={form.sort_order}
                onChange={handleChange}
                className={`${inputCls} font-mono`}
              />
            </div>

            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#003B73] focus:ring-[#003B73]/30"
                />
                <span className="text-sm text-[#1F2937]">{tr.labelFeatured}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3 justify-end">
          <Link
            to="/admin/transparencia"
            className="px-5 py-2.5 text-sm text-gray-500 hover:text-[#1F2937] transition-colors"
          >
            {tr.btnCancel}
          </Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2.5 bg-[#003B73] hover:bg-[#0057A8] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? tr.btnSaving : isEditing ? tr.btnSave : tr.btnPublish}
          </button>
        </div>
      </form>
    </div>
  );
}
