import { useEffect, useRef, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getReportById,
  createReport,
  updateReport,
  slugify,
  uploadReportPdf,
  validatePdfFile,
  REPORT_CATEGORIES
} from "../../services/reportsService";
import { useAuditLog } from "../../hooks/useAuditLog";
import { useLanguage } from "../../context/LanguageContext";
import { hasPermission } from "../../utils/rbac";
import { useAuth } from "../../context/AuthContext";
import type { ReportFormData } from "../../services/reportsService";
import type { PublishStatus } from "../../lib/database.aliases";

const EMPTY: ReportFormData = {
  title: "",
  slug: "",
  description: "",
  category: "documento_oficial",
  year: new Date().getFullYear(),
  doc_date: "",
  file_url: "",
  status: "draft"
};

const DRAFT_KEY = "admin-report-form-draft";

export default function AdminReportsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { log } = useAuditLog();
  const { t } = useLanguage();
  const { profile } = useAuth();
  const tr = t.admin.reports;
  const catLabels = t.transparencyPage.categories as Record<string, string>;
  const statusOptions: { value: PublishStatus; label: string }[] = [
    { value: "draft", label: tr.statusLabels.draft },
    { value: "published", label: tr.statusLabels.published },
    { value: "archived", label: tr.statusLabels.archived }
  ];

  const [form, setForm] = useState<ReportFormData>(() => {
    // Se não está editando, tenta restaurar rascunho salvo
    if (!id) {
      try {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) return { ...EMPTY, ...JSON.parse(draft) };
      } catch {}
    }
    return EMPTY;
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  // Upload PDF UX
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100
  type UploadStatus =
    | "idle"
    | "preparing"
    | "uploading"
    | "processing"
    | "done"
    | "error";
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Ref para armazenar o PDF anterior ao substituir
  const previousPdfUrlRef = useRef<string | null>(null);

  // ── Carregar dados para edição ─────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    getReportById(id).then(({ data, error }) => {
      if (error || !data) {
        setError(error ?? "Documento não encontrado.");
        setLoading(false);
        return;
      }
      setForm({
        title: data.title,
        slug: data.slug,
        description: data.description ?? "",
        category: data.category,
        year: data.year,
        doc_date: data.doc_date ?? "",
        file_url: data.file_url ?? "",
        status: data.status as PublishStatus
      });
      setSlugEdited(true);
      setLoading(false);
    });
    // Ao editar, limpa rascunho
    localStorage.removeItem(DRAFT_KEY);
  }, [id]);

  // Salva rascunho no localStorage sempre que form mudar (apenas criação)
  useEffect(() => {
    if (!id) {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      } catch {}
    }
  }, [form, id]);

  // ── Campos controlados ─────────────────────────────────────────────────
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !slugEdited) next.slug = slugify(value);
      if (name === "slug") setSlugEdited(true);
      return next;
    });
  };

  // ── Upload PDF ─────────────────────────────────────────────────────────
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setError(null);
    console.log("PDF selecionado:", file.name, file.size);
    setUploadFile(file);
    setUploadProgress(0);
    setUploadStatus("preparing");
    const err = validatePdfFile(file);
    console.log("Erro validação:", err);
    if (err) {
      setUploadError(
        "Não foi possível enviar o documento porque ele excede o limite de 20 MB.\nPor favor, compacte o PDF e tente novamente."
      );
      setUploadStatus("idle");
      setUploadFile(file);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setUploading(true);
    setUploadStatus("uploading");

    // Progresso simulado até 90% usando isActive
    let isActive = true;
    let progress = 8;
    setUploadProgress(progress);
    const simulate = () => {
      if (!isActive) return;
      progress += Math.random() * 10 + 4;
      if (progress > 90) progress = 90;
      setUploadProgress(Math.floor(progress));
      setTimeout(simulate, 220);
    };
    simulate();

    try {
      const { url, error } = await uploadReportPdf(file);
      isActive = false;
      setUploadProgress(100);
      setUploading(false);
      if (error) {
        setUploadError(error);
        setUploadStatus("error");
        return;
      }
      setForm(prev => ({ ...prev, file_url: url ?? "" }));
      setUploadStatus("done");

      const previousPdfUrl = previousPdfUrlRef.current;

      if (previousPdfUrl && previousPdfUrl !== url) {
        try {
          const oldUrl = new URL(previousPdfUrl);
          const oldKey = oldUrl.pathname.startsWith("/")
            ? oldUrl.pathname.slice(1)
            : oldUrl.pathname;

          if (oldKey.startsWith("reports/documents/")) {
            const endpoint = import.meta.env
              .VITE_REPORT_UPLOAD_ENDPOINT as string;
            const delUrl = `${endpoint}?key=${encodeURIComponent(oldKey)}`;
            const res = await fetch(delUrl, { method: "DELETE" });

            if (!res.ok && res.status !== 204) {
              console.warn(
                "Falha ao deletar PDF anterior no R2:",
                await res.text()
              );
            }
          }
        } catch (err) {
          console.warn(
            "Erro ao tentar deletar PDF anterior após substituição:",
            err
          );
        } finally {
          previousPdfUrlRef.current = null;
        }
      }

      setTimeout(() => setUploadStatus("idle"), 1200);
    } catch (err: any) {
      isActive = false;
      setUploading(false);
      setUploadError(err?.message || "Erro ao enviar PDF");
      setUploadStatus("error");
    }
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
    if (validationError) {
      setError(validationError);
      return;
    }

    // Proteção RBAC para create/update
    const actionType = isEditing ? "update" : "create";
    if (!profile || !hasPermission(profile.role, "relatorios", actionType)) {
      setError(t.admin.rbac.noPermission);
      return;
    }

    setSaving(true);
    setError(null);

    if (isEditing && id) {
      const { error } = await updateReport(id, form);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      await log({
        action: "create_report",
        entity_type: "report",
        entity_id: id,
        entity_title: form.title
      });
      localStorage.removeItem(DRAFT_KEY);
      navigate("/admin/transparencia");
    } else {
      const { data, error } = await createReport(form);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }
      await log({
        action: "create_report",
        entity_type: "report",
        entity_id: data?.id,
        entity_title: form.title
      });
      localStorage.removeItem(DRAFT_KEY);
      navigate("/admin/transparencia");
    }
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded-2xl" />;
  }

  // ── Classes reutilizadas ───────────────────────────────────────────────
  const inputCls =
    "w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#003B73]/30 placeholder:text-gray-300";
  const labelCls =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="max-w-3xl">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/admin/transparencia"
          className="text-gray-400 hover:text-[#003B73] transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
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
          <h2 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1F2937]">
            {tr.sectionIdentification}
          </h2>
          <div>
            <label htmlFor="title" className={labelCls}>
              {tr.labelTitle} *
            </label>
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
            <label htmlFor="description" className={labelCls}>
              {tr.labelDesc}
            </label>
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
          <h2 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1F2937]">
            {tr.sectionClassification}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label htmlFor="category" className={labelCls}>
                {tr.labelCategory} *
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputCls}>
                {REPORT_CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>
                    {catLabels[c.value] ?? c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className={labelCls}>
                {tr.labelYear} *
              </label>
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
              <label htmlFor="doc_date" className={labelCls}>
                {tr.labelDocDate}
              </label>
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

        {/* Upload PDF visual compacto */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1F2937]">
            {tr.sectionFile}
          </h2>

          {/* Card de upload PDF */}
          {(uploadStatus === "uploading" || uploading) && (
            <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50">
                <svg
                  className="w-7 h-7 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.7}
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#003B73] truncate">
                    {uploadFile?.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {uploadFile
                      ? `${(uploadFile.size / 1024).toFixed(1)} KB`
                      : ""}
                  </span>
                </div>
                <div className="w-full mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-[#003B73] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {uploadStatus === "preparing"
                      ? "Preparando envio..."
                      : "Enviando PDF..."}
                  </span>
                  <span className="text-base font-bold text-[#003B73] tabular-nums">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Sucesso */}
          {form.file_url &&
            (uploadStatus === "idle" || uploadStatus === "done") && (
              <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50">
                  <svg
                    className="w-7 h-7 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-[#003B73] truncate block">
                    {form.file_url.split("/").pop()?.split("?")[0] ??
                      "arquivo.pdf"}
                  </span>
                  <span className="text-xs text-gray-400 block">
                    PDF enviado com sucesso
                  </span>
                </div>
                <a
                  href={form.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-green-700 hover:text-green-900 border border-green-200 bg-green-50 rounded-lg px-3 py-1 mr-2 transition-colors">
                  Visualizar
                </a>
                <button
                  type="button"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    previousPdfUrlRef.current = form.file_url;
                    fileInputRef.current?.click();
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      previousPdfUrlRef.current = form.file_url;
                      fileInputRef.current?.click();
                    }
                  }}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 border border-blue-100 bg-blue-50 rounded-lg px-3 py-1 transition-colors cursor-pointer"
                  aria-label="Substituir PDF">
                  Substituir
                </button>
              </div>
            )}

          {/* Alerta de erro sempre abaixo do bloco de upload */}
          {/* Alerta de erro sempre abaixo do uploader, nunca substitui a UI */}
          {uploadError && (
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <div className="whitespace-pre-line">{uploadError}</div>
            </div>
          )}

          {/* Input de arquivo SEMPRE presente para permitir substituição */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={handleFileChange}
            disabled={
              uploading ||
              String(uploadStatus) === "uploading" ||
              String(uploadStatus) === "processing"
            }
          />

          {/* Botão visual de upload só aparece quando não há PDF */}
          {(uploadStatus === "idle" || uploadStatus === "done") &&
            !form.file_url && (
              <label
                className="flex items-center gap-3 cursor-pointer border border-dashed border-gray-200 rounded-2xl px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ")
                    fileInputRef.current?.click();
                }}
                role="button"
                aria-label={tr.pdfClickUpload}>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-[#003B73]">
                    {tr.pdfClickUpload}
                  </span>
                  <span className="text-xs text-gray-400 block">
                    {tr.pdfMaxSize}
                  </span>
                </div>
              </label>
            )}

          {/* Campo de URL manual (mantido) */}
          <div className="mt-4">
            <label htmlFor="file_url" className={labelCls}>
              {tr.pdfPasteUrl}
            </label>
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
          <h2 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1F2937]">
            {tr.sectionPublication}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status" className={labelCls}>
                {tr.labelStatus} *
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputCls}>
                {statusOptions.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* campos ordem/destaque removidos */}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3 justify-end">
          <Link
            to="/admin/transparencia"
            className="px-5 py-2.5 text-sm text-gray-500 hover:text-[#1F2937] transition-colors"
            onClick={async () => {
              // Limpa rascunho
              localStorage.removeItem(DRAFT_KEY);
              // Se for criação e PDF já enviado, deleta do bucket
              if (!isEditing && form.file_url) {
                try {
                  const url = new URL(form.file_url);
                  const key = url.pathname.startsWith("/")
                    ? url.pathname.slice(1)
                    : url.pathname;
                  if (key.startsWith("reports/documents/")) {
                    const endpoint = import.meta.env
                      .VITE_REPORT_UPLOAD_ENDPOINT as string;
                    const delUrl = `${endpoint}?key=${encodeURIComponent(key)}`;
                    await fetch(delUrl, { method: "DELETE" });
                  }
                } catch (err) {
                  // Silencioso
                  console.warn(
                    "Erro ao tentar deletar PDF órfão ao cancelar:",
                    err
                  );
                }
              }
            }}>
            {tr.btnCancel}
          </Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2.5 bg-[#003B73] hover:bg-[#0057A8] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? tr.btnSaving : isEditing ? tr.btnSave : tr.btnPublish}
          </button>
        </div>
      </form>
    </div>
  );
}
