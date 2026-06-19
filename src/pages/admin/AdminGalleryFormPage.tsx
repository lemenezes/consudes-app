import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Save } from "lucide-react";
import {
  getGalleryBySlug,
  updateGallery,
  createGallery
} from "../../services/galleryService";
import { useAuditLog } from "../../hooks/useAuditLog";
import {
  GALLERY_CATEGORIES,
  type GalleryAlbum,
  type GalleryCategory
} from "../../data/galleryData";

const TIERS = ["T1", "T2", "T3"] as const;

const TIER_LABELS: Record<string, string> = {
  T1: "Destaque",
  T2: "Galeria",
  T3: "Arquivo"
};

export default function AdminGalleryFormPage() {
  const navigate = useNavigate();
  const { '*': slugParam } = useParams<{ '*'?: string }>();
  const location = useLocation();
  const { log } = useAuditLog();

  // Extrai slug da URL: /admin/galeria/editar/... -> tudo após 'editar/'
  const slug = slugParam || (location.pathname.includes('/editar/') ? location.pathname.split('/editar/')[1] : undefined);

  const [loading, setLoading] = useState(!!slug);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<GalleryAlbum>({
    slug: "",
    title: "",
    year: null,
    city: null,
    country: null,
    description: {
      es: "",
      pt: "",
      en: ""
    },
    category: "historico",
    tier: "T2",
    coverFile: null,
    coverPosition: "center",
    photoCount: 0,
    photos: [],
    featured: false
  });

  const isEditMode = !!slug;

  // Load album if editing
  useEffect(() => {
    if (isEditMode && slug) {
      loadAlbum();
    }
  }, [slug, isEditMode]);

  const loadAlbum = async () => {
    if (!slug) return;
    setLoading(true);
    const { data, error } = await getGalleryBySlug(slug);
    if (error) {
      setError(error);
    } else if (data) {
      setForm(data);
    }
    setLoading(false);
  };

  const handleInputChange = (
    field: keyof Omit<GalleryAlbum, "description" | "photos">,
    value: any
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDescriptionChange = (lang: "es" | "pt" | "en", value: string) => {
    setForm(prev => ({
      ...prev,
      description: {
        ...prev.description,
        [lang]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!form.title.trim()) {
      setError("Título é obrigatório");
      return;
    }
    if (!form.slug.trim()) {
      setError("Slug é obrigatório");
      return;
    }
    if (form.photoCount < 0) {
      setError("Quantidade de fotos não pode ser negativa");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEditMode && slug) {
        // Update existing
        const { error } = await updateGallery(slug, form);
        if (error) {
          setError(error);
        } else {
          await log({
            action: "update_gallery_album" as const,
            entity_type: "gallery_album",
            entity_id: form.slug,
            entity_title: form.title
          });
          setSuccess(true);
          setTimeout(() => navigate("/admin/galeria"), 2000);
        }
      } else {
        // Create new
        const { error } = await createGallery(form);
        if (error) {
          setError(error);
        } else {
          await log({
            action: "create_gallery_album" as const,
            entity_type: "gallery_album",
            entity_id: form.slug,
            entity_title: form.title
          });
          setSuccess(true);
          setTimeout(() => navigate("/admin/galeria"), 2000);
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse w-48" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/galeria")}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Voltar">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
            {isEditMode ? "Editar álbum" : "Novo álbum"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEditMode ? form.title : "Crie um novo álbum na galeria"}
          </p>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700">
          ✓ {isEditMode ? "Álbum atualizado" : "Álbum criado"} com sucesso!
          Redirecionando...
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Título *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => handleInputChange("title", e.target.value)}
              placeholder="Ex: II Juegos Sudamericanos 2019"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Slug *
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={e => handleInputChange("slug", e.target.value)}
              placeholder="Ex: juegos-sudamericanos/2019-juegos-ii"
              disabled={isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Categoria
            </label>
            <select
              value={form.category}
              onChange={e =>
                handleInputChange("category", e.target.value as GalleryCategory)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {GALLERY_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tier */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tier
            </label>
            <select
              value={form.tier}
              onChange={e => handleInputChange("tier", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {TIERS.map(tier => (
                <option key={tier} value={tier}>
                  {TIER_LABELS[tier]}
                </option>
              ))}
            </select>
          </div>

          {/* Ano */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Ano
            </label>
            <input
              type="number"
              value={form.year || ""}
              onChange={e =>
                handleInputChange(
                  "year",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="Ex: 2019"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Cidade
            </label>
            <input
              type="text"
              value={form.city || ""}
              onChange={e => handleInputChange("city", e.target.value || null)}
              placeholder="Ex: Goiânia"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* País */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              País
            </label>
            <input
              type="text"
              value={form.country || ""}
              onChange={e =>
                handleInputChange("country", e.target.value || null)
              }
              placeholder="Ex: Brasil"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quantidade de fotos */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Total de fotos
            </label>
            <input
              type="number"
              value={form.photoCount}
              onChange={e =>
                handleInputChange(
                  "photoCount",
                  Math.max(0, parseInt(e.target.value) || 0)
                )
              }
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Posição da capa */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Posição da capa (object-position)
            </label>
            <select
              value={form.coverPosition || "center"}
              onChange={e => handleInputChange("coverPosition", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="center">Centro</option>
              <option value="top">Topo</option>
              <option value="bottom">Base</option>
              <option value="left">Esquerda</option>
              <option value="right">Direita</option>
            </select>
          </div>

          {/* Arquivo de capa */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Arquivo de capa (thumbnail)
            </label>
            <input
              type="text"
              value={form.coverFile || ""}
              onChange={e =>
                handleInputChange("coverFile", e.target.value || null)
              }
              placeholder="Ex: cover.webp"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nome do arquivo em R2: gallery/[slug]/[arquivo]
            </p>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured || false}
              onChange={e => handleInputChange("featured", e.target.checked)}
              className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="featured"
              className="text-sm font-semibold text-gray-700">
              Destaque na página principal
            </label>
          </div>
        </div>

        {/* Descrições multilíngues */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Descrições
          </h3>
          <div className="space-y-4">
            {["pt", "es", "en"].map(lang => (
              <div key={lang}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Descrição em {lang.toUpperCase()}
                </label>
                <textarea
                  value={form.description[lang as "pt" | "es" | "en"]}
                  onChange={e =>
                    handleDescriptionChange(
                      lang as "pt" | "es" | "en",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Descrição do álbum em ${lang.toUpperCase()}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3 border-t pt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/galeria")}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
            <Save size={16} />
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        <p className="font-semibold mb-1">ℹ️ Nota sobre fotos:</p>
        <p>
          Gerencie as fotos do álbum diretamente da listagem de galeria. Os
          arquivos devem estar em R2 no caminho:{" "}
          <code className="bg-blue-100 px-1 rounded">
            gallery/[slug]/[arquivo]
          </code>
        </p>
      </div>
    </div>
  );
}
