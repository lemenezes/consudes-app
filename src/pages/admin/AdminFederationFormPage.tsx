import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getFederationById,
  createFederation,
  updateFederation,
  FEDERATIONS_BUCKET
} from "../../services/federationsService";
import { hasPermission } from "../../utils/rbac";
import { useAuth } from "../../context/AuthContext";
import { useAuditLog } from "../../hooks/useAuditLog";
import { useLanguage } from "../../context/LanguageContext";
import CoverImageUpload from "../../components/CoverImageUpload";
import type { FederationFormData } from "../../services/federationsService";

const EMPTY: FederationFormData = {
  acronym: "",
  name_es: "",
  name_pt: "",
  name_en: "",
  country_es: "",
  country_pt: "",
  country_en: "",
  flag: "",
  logo_url: "",
  website_url: "",
  instagram_url: "",
  facebook_url: "",
  youtube_url: "",
  twitter_url: "",
  linkedin_url: "",
  tiktok_url: "",
  flickr_url: "",
  sort_order: 0
};

/* ── Rótulos de campos ─────────────────────────────────────────────────── */
const SOCIAL_FIELDS: {
  name: keyof FederationFormData;
  label: string;
  placeholder: string;
}[] = [
  { name: "website_url", label: "Website", placeholder: "https://..." },
  {
    name: "instagram_url",
    label: "Instagram",
    placeholder: "https://instagram.com/..."
  },
  {
    name: "facebook_url",
    label: "Facebook",
    placeholder: "https://facebook.com/..."
  },
  {
    name: "youtube_url",
    label: "YouTube",
    placeholder: "https://youtube.com/..."
  },
  {
    name: "twitter_url",
    label: "X / Twitter",
    placeholder: "https://x.com/..."
  },
  {
    name: "linkedin_url",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/..."
  },
  {
    name: "tiktok_url",
    label: "TikTok",
    placeholder: "https://tiktok.com/..."
  },
  { name: "flickr_url", label: "Flickr", placeholder: "https://flickr.com/..." }
];

/* ── Componente ─────────────────────────────────────────────────────────── */
export default function AdminFederationFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { log } = useAuditLog();
  const { t } = useLanguage();
  const { profile } = useAuth();

  const [form, setForm] = useState<FederationFormData>(EMPTY);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Carregar para edição ───────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    getFederationById(id).then(({ data, error }) => {
      if (error || !data) {
        setError(error ?? "Federação não encontrada.");
        setLoading(false);
        return;
      }
      setForm({
        acronym: data.acronym ?? "",
        name_es: data.name_es ?? "",
        name_pt: data.name_pt ?? "",
        name_en: data.name_en ?? "",
        country_es: data.country_es ?? "",
        country_pt: data.country_pt ?? "",
        country_en: data.country_en ?? "",
        flag: data.flag ?? "",
        logo_url: data.logo_url ?? "",
        website_url: data.website_url ?? "",
        instagram_url: data.instagram_url ?? "",
        facebook_url: data.facebook_url ?? "",
        youtube_url: data.youtube_url ?? "",
        twitter_url: data.twitter_url ?? "",
        linkedin_url: data.linkedin_url ?? "",
        tiktok_url: data.tiktok_url ?? "",
        flickr_url: data.flickr_url ?? "",
        sort_order: data.sort_order ?? 0
      });
      setLoading(false);
    });
  }, [id]);

  // ── Campos controlados ─────────────────────────────────────────────────
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "sort_order" ? Number(value) : value
    }));
  };

  // ── Validação ──────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (!form.acronym.trim()) return "Sigla é obrigatória.";
    if (!form.name_es.trim()) return "Nome oficial (ES) é obrigatório.";
    if (!form.country_es.trim()) return "País (ES) é obrigatório.";
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
    if (!profile || !hasPermission(profile.role, "federacoes", actionType)) {
      setError(t.admin.rbac.noPermission);
      return;
    }

    setSaving(true);
    setError(null);

    if (isEditing && id) {
      const { error } = await updateFederation(id, form);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }

      await log({
        action: "edit_federation",
        entity_type: "federation",
        entity_id: id,
        entity_title: form.acronym
      });

      navigate("/admin/federacoes");
    } else {
      const { data, error } = await createFederation(form);
      if (error) {
        setError(error);
        setSaving(false);
        return;
      }

      await log({
        action: "create_federation",
        entity_type: "federation",
        entity_id: data?.id,
        entity_title: form.acronym
      });

      navigate("/admin/federacoes");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/federacoes"
          className="p-2 rounded-lg text-gray-400 hover:text-[#1F2937] hover:bg-gray-100 transition-colors"
          aria-label="Voltar">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
          {isEditing ? "Editar federação" : "Nova federação"}
        </h1>
      </div>

      {/* Erro global */}
      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Identidade ── */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
            Identidade
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Sigla */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Sigla <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="acronym"
                value={form.acronym}
                onChange={handleChange}
                placeholder="CADES"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057A8]/30 focus:border-[#0057A8] uppercase"
              />
            </div>

            {/* Bandeira emoji */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Bandeira (emoji)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="flag"
                  value={form.flag}
                  onChange={handleChange}
                  placeholder="🇦🇷"
                  maxLength={8}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057A8]/30 focus:border-[#0057A8]"
                />
                {form.flag && (
                  <span className="text-3xl shrink-0">{form.flag}</span>
                )}
              </div>
            </div>
          </div>

          {/* Ordem de exibição */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Ordem de exibição
            </label>
            <input
              type="number"
              name="sort_order"
              value={form.sort_order}
              onChange={handleChange}
              min={0}
              max={999}
              className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057A8]/30 focus:border-[#0057A8]"
            />
          </div>
        </section>

        {/* ── País ── */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
            País
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                País — ES <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country_es"
                value={form.country_es}
                onChange={handleChange}
                placeholder="Argentina"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057A8]/30 focus:border-[#0057A8]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                País — PT
              </label>
              <input
                type="text"
                name="country_pt"
                value={form.country_pt}
                onChange={handleChange}
                placeholder="Argentina"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057A8]/30 focus:border-[#0057A8]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                País — EN
              </label>
              <input
                type="text"
                name="country_en"
                value={form.country_en}
                onChange={handleChange}
                placeholder="Argentina"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057A8]/30 focus:border-[#0057A8]"
              />
            </div>
          </div>
        </section>

        {/* ── Nome oficial ── */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
            Nome oficial
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nome — ES <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name_es"
              value={form.name_es}
              onChange={handleChange}
              placeholder="Confederación Argentina de Deportes de Sordos"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057A8]/30 focus:border-[#0057A8]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nome — PT
            </label>
            <input
              type="text"
              name="name_pt"
              value={form.name_pt}
              onChange={handleChange}
              placeholder="Confederação Argentina de Esportes de Surdos"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057A8]/30 focus:border-[#0057A8]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nome — EN
            </label>
            <input
              type="text"
              name="name_en"
              value={form.name_en}
              onChange={handleChange}
              placeholder="Argentine Confederation of Deaf Sports"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057A8]/30 focus:border-[#0057A8]"
            />
          </div>
        </section>

        {/* ── Logo ── */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Logo
          </h2>
          <CoverImageUpload
            value={form.logo_url}
            onChange={url => setForm(prev => ({ ...prev, logo_url: url }))}
            bucket={FEDERATIONS_BUCKET}
            folder="logos"
          />
        </section>

        {/* ── Redes sociais ── */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
            Redes sociais e links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SOCIAL_FIELDS.map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {label}
                </label>
                <input
                  type="url"
                  name={name}
                  value={form[name] as string}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057A8]/30 focus:border-[#0057A8]"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Ações ── */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/federacoes"
            className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            {t.admin.cancel}
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-[#0057A8] text-white text-sm font-semibold hover:bg-[#004a8f] disabled:opacity-50 transition-colors">
            {saving
              ? t.admin.saving
              : isEditing
                ? t.admin.saveChanges
                : t.admin.federationsList.new}
          </button>
        </div>
      </form>
    </div>
  );
}
