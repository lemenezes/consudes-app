import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Image, Plus, Save, Trash2, Eye } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import SimpleConfirmModal from "../../components/SimpleConfirmModal";
import {
  getGalleryBySlug,
  updateGallery,
  createGallery
} from "../../services/galleryService";
import { useAuditLog } from "../../hooks/useAuditLog";
import { useToast } from "../../context/ToastContext";
import {
  GALLERY_CATEGORIES,
  getPhotoUrl,
  type GalleryAlbum,
  type GalleryPhoto,
  type GalleryCategory
} from "../../data/galleryData";

function extractSlugFromPath(pathname: string): string | undefined {
  if (!pathname.includes("/editar/")) {
    return undefined;
  }

  const slug = pathname.split("/editar/")[1];
  return slug || undefined;
}

function toSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeAlbumPhotos(
  album: GalleryAlbum,
  photos: GalleryPhoto[]
): GalleryAlbum {
  const coverExists = album.coverFile
    ? photos.some(photo => photo.filename === album.coverFile)
    : false;

  return {
    ...album,
    photos,
    photoCount: photos.length,
    coverFile: coverExists ? album.coverFile : (photos[0]?.filename ?? null)
  };
}

export default function AdminGalleryFormPage() {
  const navigate = useNavigate();
  const { "*": slugParam } = useParams<{ "*"?: string }>();
  const location = useLocation();
  const { log } = useAuditLog();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extrai slug da URL: /admin/galeria/editar/... -> tudo após 'editar/'
  const slug = slugParam || extractSlugFromPath(location.pathname);

  const [loading, setLoading] = useState(!!slug);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoToRemoveIndex, setPhotoToRemoveIndex] = useState<number | null>(
    null
  );
  const [selectedPhotoIndexes, setSelectedPhotoIndexes] = useState<number[]>(
    []
  );
  const [batchRemoveConfirmOpen, setBatchRemoveConfirmOpen] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"informacoes" | "fotos">(
    "informacoes"
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});
  const [tempPhotoCreatedAt, setTempPhotoCreatedAt] = useState<
    Record<string, number>
  >({});

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

  useEffect(() => {
    setFailedPhotos({});
    setSelectedPhotoIndexes(prev =>
      prev.filter(index => index >= 0 && index < form.photos.length)
    );

    setTempPhotoCreatedAt(prev => {
      const activeKeys = new Set(
        form.photos.map(photo => photo.dataUrl || `name:${photo.filename}`)
      );
      let changed = false;
      const next: Record<string, number> = {};

      Object.entries(prev).forEach(([key, value]) => {
        if (activeKeys.has(key)) {
          next[key] = value;
        } else {
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [form.photos]);

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
    setForm(prev => {
      if (field === "title" && !isEditMode) {
        const title = String(value ?? "");
        return {
          ...prev,
          title,
          slug: toSlug(title)
        };
      }

      return {
        ...prev,
        [field]: value
      };
    });
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

  const persistAlbum = async (nextAlbum: GalleryAlbum) => {
    if (!slug) return;

    setSaving(true);
    setError(null);

    const { data, error } = await updateGallery(slug, nextAlbum);
    if (error) {
      setError(error);
    } else if (data) {
      setForm(data);
    } else {
      setForm(nextAlbum);
    }

    setSaving(false);
  };

  const updatePhotos = async (nextPhotos: GalleryPhoto[]) => {
    const nextAlbum = normalizeAlbumPhotos(form, nextPhotos);
    await persistAlbum(nextAlbum);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!isEditMode || !slug || !files) return;

    const selectedFiles = Array.from(files);
    setFailedPhotos({});

    const readAsDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === "string") {
            resolve(result);
            return;
          }
          reject(new Error("Falha ao processar imagem selecionada"));
        };
        reader.onerror = () =>
          reject(new Error("Falha ao ler imagem selecionada"));
        reader.readAsDataURL(file);
      });

    void Promise.all(
      selectedFiles.map(async file => ({
        filename: file.name,
        originalName: file.name,
        dataUrl: await readAsDataUrl(file),
        caption: file.name.replace(/\.[^/.]+$/, "") || undefined
      }))
    )
      .then(newPhotos => {
        const now = Date.now();
        setTempPhotoCreatedAt(prev => {
          const next = { ...prev };
          newPhotos.forEach((photo, addedIndex) => {
            const key = photo.dataUrl || `name:${photo.filename}`;
            next[key] = now + addedIndex;
          });
          return next;
        });

        const allPhotos = [...form.photos, ...newPhotos];
        return updatePhotos(allPhotos);
      })
      .catch(err => {
        const message = (err as Error).message || "Falha ao adicionar foto";
        setError(message);
        showToast(message, "error");
      });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemovePhoto = async (index: number) => {
    setPhotoToRemoveIndex(index);
  };

  const togglePhotoSelection = (index: number) => {
    setSelectedPhotoIndexes(prev =>
      prev.includes(index)
        ? prev.filter(current => current !== index)
        : [...prev, index]
    );
  };

  const confirmBatchRemovePhotos = () => {
    if (selectedPhotoIndexes.length === 0) return;

    const selectedSet = new Set(selectedPhotoIndexes);
    setForm(prev => {
      const nextPhotos = prev.photos.filter((_, index) => !selectedSet.has(index));
      return normalizeAlbumPhotos(prev, nextPhotos);
    });

    setBatchRemoveConfirmOpen(false);
    setSelectedPhotoIndexes([]);
    setFailedPhotos({});
  };

  const confirmRemovePhoto = async () => {
    if (photoToRemoveIndex === null || !isEditMode || !slug) return;

    const index = photoToRemoveIndex;
    const nextPhotos = form.photos.filter(
      (_, currentIndex) => currentIndex !== index
    );
    await updatePhotos(nextPhotos);
    setPhotoToRemoveIndex(null);
  };

  const handleSetCover = async (index: number) => {
    if (!isEditMode || !slug) return;

    const nextAlbum = normalizeAlbumPhotos(form, form.photos);
    nextAlbum.coverFile = form.photos[index]?.filename ?? null;
    await persistAlbum(nextAlbum);
  };

  const adminVisualPhotos = useMemo(() => {
    return form.photos
      .map((photo, index) => {
        const tempKey = photo.dataUrl || `name:${photo.filename}`;
        const createdAt = tempPhotoCreatedAt[tempKey] ?? 0;

        return {
          photo,
          originalIndex: index,
          createdAt,
          photoKey: `${photo.filename}-${index}`
        };
      })
      .sort((a, b) => {
        if (b.createdAt !== a.createdAt) {
          return b.createdAt - a.createdAt;
        }
        return a.originalIndex - b.originalIndex;
      });
  }, [form.photos, tempPhotoCreatedAt]);

  const slides = adminVisualPhotos.map(item => ({
    src: getPhotoUrl(
      form.slug || slug || "",
      item.photo.dataUrl || item.photo.filename
    )
  }));

  const handleOpenLightbox = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!form.title.trim()) {
      setError("Título é obrigatório");
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
          showToast(error, "error");
        } else {
          await log({
            action: "update_gallery_album" as const,
            entity_type: "gallery_album",
            entity_id: form.slug,
            entity_title: form.title
          });
          showToast("Álbum salvo com sucesso.", "success");
          setTimeout(() => navigate("/admin/galeria"), 2000);
        }
      } else {
        // Create new
        const autoSlug = toSlug(form.title);
        if (!autoSlug) {
          setError("Não foi possível gerar slug a partir do título");
          return;
        }

        const albumToCreate: GalleryAlbum = {
          ...form,
          slug: autoSlug
        };

        const { error } = await createGallery(albumToCreate);
        if (error) {
          setError(error);
          showToast(error, "error");
        } else {
          await log({
            action: "create_gallery_album" as const,
            entity_type: "gallery_album",
            entity_id: albumToCreate.slug,
            entity_title: form.title
          });
          showToast("Álbum salvo com sucesso.", "success");
          setTimeout(() => navigate("/admin/galeria"), 2000);
        }
      }
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      showToast(message, "error");
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

      {/* Form com Abas */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Abas */}
        <div className="border-b border-gray-200 flex">
          <button
            type="button"
            onClick={() => setActiveTab("informacoes")}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === "informacoes"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}>
            Informações
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fotos")}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === "fotos"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
            disabled={!isEditMode}>
            Fotos {isEditMode && `(${form.photos.length})`}
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-6">
          {/* ABA INFORMAÇÕES */}
          {activeTab === "informacoes" && (
            <div className="space-y-6">
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

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Categoria
                  </label>
                  <select
                    value={form.category}
                    onChange={e =>
                      handleInputChange(
                        "category",
                        e.target.value as GalleryCategory
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {GALLERY_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
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
                    onChange={e =>
                      handleInputChange("city", e.target.value || null)
                    }
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

                {/* Destaque */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured || false}
                    onChange={e =>
                      handleInputChange("featured", e.target.checked)
                    }
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
            </div>
          )}

          {/* ABA FOTOS */}
          {activeTab === "fotos" && isEditMode && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-['Cormorant_Garamond'] font-semibold text-[#1F2937] mb-1">
                  Biblioteca de fotos
                </h3>
                <p className="text-sm text-gray-500">
                  {form.photos.length}{" "}
                  {form.photos.length === 1 ? "imagem" : "imagens"}
                </p>
              </div>

              {selectedPhotoIndexes.length > 0 && (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-2">
                  <p className="text-sm font-medium text-blue-900">
                    {selectedPhotoIndexes.length} {selectedPhotoIndexes.length === 1 ? "imagem selecionada" : "imagens selecionadas"}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPhotoIndexes([])}
                      className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors">
                      Limpar seleção
                    </button>
                    <button
                      type="button"
                      onClick={() => setBatchRemoveConfirmOpen(true)}
                      className="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors">
                      Remover selecionadas
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 xl:grid-cols-[repeat(7,minmax(0,1fr))] gap-2">
                {/* Card de Upload */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  disabled={saving}
                  className="group relative rounded-lg overflow-hidden bg-white border-2 border-dashed border-gray-300 shadow-sm hover:shadow-md hover:border-blue-400 transition-all aspect-square flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Adicionar fotos">
                  <div className="flex flex-col items-center justify-center gap-1.5 text-center px-2">
                    <Plus
                      size={28}
                      className="text-gray-300 group-hover:text-blue-500 transition-colors"
                    />
                    <p className="text-[11px] font-semibold leading-tight text-gray-600 group-hover:text-blue-600 transition-colors">
                      Adicionar fotos
                    </p>
                  </div>
                </button>

                {/* Cards de Fotos */}
                {adminVisualPhotos.map((item, visualIndex) => {
                  const { photo, originalIndex, photoKey } = item;
                  const src = getPhotoUrl(
                    form.slug || slug || "",
                    photo.dataUrl || photo.filename
                  );
                  const isCover = form.coverFile === photo.filename;
                  const hasLoadError = !!failedPhotos[photoKey];

                  return (
                    <article
                      key={photoKey}
                      className={`group relative rounded-lg border-2 overflow-hidden bg-white shadow-sm transition-all ${
                        isCover
                          ? "border-blue-500 ring-1 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                      <div className="relative aspect-square bg-gray-100">
                        {hasLoadError ? (
                          <div
                            className="w-full h-full flex flex-col items-center justify-center gap-2 px-2 text-center"
                            aria-label="Imagem não disponível">
                            <Image size={24} className="text-gray-400" />
                            <p className="text-[11px] font-medium text-gray-500 leading-tight">
                              Imagem não disponível
                            </p>
                          </div>
                        ) : (
                          <img
                            src={src}
                            alt="Foto do álbum"
                            className="block w-full h-full object-contain cursor-pointer"
                            loading="lazy"
                            onLoad={() => {
                              setFailedPhotos(prev => {
                                if (!prev[photoKey]) {
                                  return prev;
                                }

                                const next = { ...prev };
                                delete next[photoKey];
                                return next;
                              });
                            }}
                            onError={() => {
                              setFailedPhotos(prev => ({
                                ...prev,
                                [photoKey]: true
                              }));
                            }}
                            onClick={() => handleOpenLightbox(visualIndex)}
                          />
                        )}

                        {isCover && (
                          <span className="absolute top-1 left-1 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white bg-blue-600">
                            CAPA
                          </span>
                        )}

                        <label
                          className="absolute top-1 right-1 z-20 inline-flex items-center justify-center rounded bg-white/95 p-1 shadow-sm"
                          onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedPhotoIndexes.includes(originalIndex)}
                            onChange={() => togglePhotoSelection(originalIndex)}
                            className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            aria-label="Selecionar foto"
                          />
                        </label>

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleOpenLightbox(visualIndex);
                            }}
                            disabled={saving}
                            title="Visualizar"
                            className="inline-flex items-center justify-center rounded-full bg-white p-2 text-gray-700 shadow-sm hover:bg-blue-50 transition-colors disabled:opacity-40">
                            <Eye size={14} />
                          </button>
                          {!isCover && (
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                handleSetCover(originalIndex);
                              }}
                              disabled={saving}
                              title="Definir como capa"
                              className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-700 shadow-sm hover:bg-blue-50 transition-colors disabled:opacity-40">
                              Capa
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleRemovePhoto(originalIndex);
                            }}
                            disabled={saving}
                            title="Remover foto"
                            className="inline-flex items-center justify-center rounded-full bg-white p-2 text-gray-700 shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {form.photos.length === 0 && (
                <p className="mt-4 text-sm text-gray-500 text-center py-8">
                  Nenhuma foto adicionada ainda. Clique em{" "}
                  <strong>Adicionar fotos</strong> para começar.
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={e => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>
          )}

          {activeTab === "fotos" && !isEditMode && (
            <div className="text-center py-8">
              <Image className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-500">
                Salve o álbum para liberar a gestão de fotos.
              </p>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/galeria")}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
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
      {/* Modal de Confirmação de Remoção */}
      {photoToRemoveIndex !== null && (
        <SimpleConfirmModal
          title="Remover foto"
          message="Tem certeza que deseja remover esta foto?"
          onConfirm={confirmRemovePhoto}
          onCancel={() => setPhotoToRemoveIndex(null)}
          confirmLabel="Remover"
          cancelLabel="Cancelar"
          isDangerous={true}
        />
      )}

      {batchRemoveConfirmOpen && (
        <SimpleConfirmModal
          title="Remover fotos selecionadas"
          message={`Tem certeza que deseja remover ${selectedPhotoIndexes.length} ${selectedPhotoIndexes.length === 1 ? "foto" : "fotos"} selecionada${selectedPhotoIndexes.length === 1 ? "" : "s"}?`}
          onConfirm={confirmBatchRemovePhotos}
          onCancel={() => setBatchRemoveConfirmOpen(false)}
          confirmLabel="Remover selecionadas"
          cancelLabel="Cancelar"
          isDangerous={true}
        />
      )}

      {/* Lightbox de Preview (mesmo padrão da galeria pública) */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={photoIndex}
        slides={slides}
        plugins={[Zoom, Counter, Fullscreen]}
        zoom={{
          maxZoomPixelRatio: 4,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true
        }}
        carousel={{ preload: 2 }}
        animation={{ fade: 200, swipe: 250 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, 0.97)"
          },
          slide: {
            padding: "0 56px"
          }
        }}
      />
    </div>
  );
}
