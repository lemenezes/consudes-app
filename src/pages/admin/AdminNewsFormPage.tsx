import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getNewsById,
  createNews,
  updateNews,
  slugify
} from "../../services/newsService";
import { hasPermission } from "../../utils/rbac";
import { useAuth } from "../../context/AuthContext";
import { useAuditLog } from "../../hooks/useAuditLog";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import CoverImageUpload from "../../components/CoverImageUpload";
import RichTextEditor from "../../components/RichTextEditor";
import {
  getOrphanedInlineUrls,
  getNewlyAddedInlineUrls,
  deleteInlineImageUrls
} from "../../utils/inlineImageCleanup";
import { translatePlain, translateHTML } from "../../utils/translateContent";
import type { NewsFormData } from "../../services/newsService";
import type { PublishStatus, Lang } from "../../lib/database.aliases";

const EMPTY: NewsFormData = {
  slug: "",
  cover_url: "",
  original_language: "es",
  title_pt: "",
  title_es: "",
  title_en: "",
  excerpt_pt: "",
  excerpt_es: "",
  excerpt_en: "",
  content_pt: "",
  content_es: "",
  content_en: "",
  // Compatibilidade temporaria com modelo legado
  title: "",
  excerpt: "",
  content: "",
  lang: "es",
  status: "draft"
};

type LocalizedField = "title" | "excerpt" | "content";
type LocalizedKey = keyof Pick<
  NewsFormData,
  | "title_pt"
  | "title_es"
  | "title_en"
  | "excerpt_pt"
  | "excerpt_es"
  | "excerpt_en"
  | "content_pt"
  | "content_es"
  | "content_en"
>;

const LANG_TABS: { code: Lang; label: string }[] = [
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "en", label: "English" }
];

// Nomes em português para usar em mensagens e no botão de tradução
const LANG_LABEL_PT: Record<Lang, string> = {
  es: "Espanhol",
  pt: "Português",
  en: "Inglês"
};

const REQUIRED_MESSAGE: Record<LocalizedField, string> = {
  title: "Titulo e obrigatorio no idioma original.",
  excerpt: "Resumo e obrigatorio no idioma original.",
  content: "Conteudo e obrigatorio no idioma original."
};

function fieldKey(field: LocalizedField, lang: Lang): LocalizedKey {
  return `${field}_${lang}` as LocalizedKey;
}

function getLocalizedValue(
  form: NewsFormData,
  field: LocalizedField,
  lang: Lang
): string {
  return form[fieldKey(field, lang)] ?? "";
}

function withLegacyCompatibility(form: NewsFormData): NewsFormData {
  const source = form.original_language;
  const title = getLocalizedValue(form, "title", source);
  const excerpt = getLocalizedValue(form, "excerpt", source);
  const content = getLocalizedValue(form, "content", source);

  return {
    ...form,
    title,
    excerpt,
    content,
    lang: source
  };
}

function mergeUnique(...groups: string[][]): string[] {
  return Array.from(new Set(groups.flat()));
}

export default function AdminNewsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { log } = useAuditLog();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { profile } = useAuth();

  const STATUS_OPTIONS: { value: PublishStatus; label: string }[] = [
    { value: "draft", label: t.admin.status.draft },
    { value: "published", label: t.admin.status.published },
    { value: "archived", label: t.admin.status.archived }
  ];

  const [form, setForm] = useState<NewsFormData>(
    withLegacyCompatibility(EMPTY)
  );
  const [initialForm, setInitialForm] = useState<NewsFormData>(
    withLegacyCompatibility(EMPTY)
  );
  const [activeLang, setActiveLang] = useState<Lang>("es");
  const [previousStatus, setPreviousStatus] = useState<PublishStatus>("draft");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<LocalizedKey, string>>
  >({});
  const [slugEdited, setSlugEdited] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  // Snapshot original carregado do banco para detectar imagens novas/removidas.
  const originalContentSnapshotRef = useRef<Record<Lang, string>>({
    es: "",
    pt: "",
    en: ""
  });
  const originalTitleRef = useRef<HTMLInputElement | null>(null);
  const originalExcerptRef = useRef<HTMLTextAreaElement | null>(null);
  const originalContentAnchorRef = useRef<HTMLDivElement | null>(null);

  const effectiveForm = useMemo(() => withLegacyCompatibility(form), [form]);
  const isDirty = JSON.stringify(effectiveForm) !== JSON.stringify(initialForm);

  const originalLang = form.original_language;
  const targetLangs = LANG_TABS.map(l => l.code).filter(
    c => c !== originalLang
  );
  const allTargetLangsHaveContent = targetLangs.every(
    target =>
      getLocalizedValue(form, "title", target).trim() !== "" &&
      getLocalizedValue(form, "excerpt", target).trim() !== "" &&
      getLocalizedValue(form, "content", target).trim() !== ""
  );
  const isUpdateMode = isEditing && allTargetLangsHaveContent;
  const originalTitle = getLocalizedValue(form, "title", originalLang);

  const activeTitleKey = fieldKey("title", activeLang);
  const activeExcerptKey = fieldKey("excerpt", activeLang);
  const activeContentKey = fieldKey("content", activeLang);
  const activeTitle = getLocalizedValue(form, "title", activeLang);
  const activeExcerpt = getLocalizedValue(form, "excerpt", activeLang);
  const activeContent = getLocalizedValue(form, "content", activeLang);

  const originalTitleKey = fieldKey("title", originalLang);
  const originalExcerptKey = fieldKey("excerpt", originalLang);
  const originalContentKey = fieldKey("content", originalLang);

  useEffect(() => {
    if (!id) {
      const next = withLegacyCompatibility(EMPTY);
      setForm(next);
      setInitialForm(next);
      setActiveLang(next.original_language);
      originalContentSnapshotRef.current = {
        es: next.content_es,
        pt: next.content_pt,
        en: next.content_en
      };
      return;
    }

    getNewsById(id).then(({ data, error: loadError }) => {
      if (loadError || !data) {
        setError(loadError ?? "Noticia nao encontrada.");
        setLoading(false);
        return;
      }

      const original_language = data.original_language ?? data.lang;
      const loaded = withLegacyCompatibility({
        slug: data.slug,
        cover_url: data.cover_url ?? "",
        original_language,
        title_pt: data.title_pt ?? (data.lang === "pt" ? data.title : ""),
        title_es: data.title_es ?? (data.lang === "es" ? data.title : ""),
        title_en: data.title_en ?? (data.lang === "en" ? data.title : ""),
        excerpt_pt:
          data.excerpt_pt ?? (data.lang === "pt" ? (data.excerpt ?? "") : ""),
        excerpt_es:
          data.excerpt_es ?? (data.lang === "es" ? (data.excerpt ?? "") : ""),
        excerpt_en:
          data.excerpt_en ?? (data.lang === "en" ? (data.excerpt ?? "") : ""),
        content_pt:
          data.content_pt ?? (data.lang === "pt" ? (data.content ?? "") : ""),
        content_es:
          data.content_es ?? (data.lang === "es" ? (data.content ?? "") : ""),
        content_en:
          data.content_en ?? (data.lang === "en" ? (data.content ?? "") : ""),
        title: data.title,
        excerpt: data.excerpt ?? "",
        content: data.content ?? "",
        lang: data.lang,
        status: data.status
      });

      setForm(loaded);
      setInitialForm(loaded);
      setActiveLang(loaded.original_language);
      setPreviousStatus(loaded.status);
      setSlugEdited(true);
      originalContentSnapshotRef.current = {
        es: loaded.content_es,
        pt: loaded.content_pt,
        en: loaded.content_en
      };
      setLoading(false);
    });
  }, [id]);

  const updateLocalizedField = (
    field: LocalizedField,
    lang: Lang,
    value: string
  ) => {
    const key = fieldKey(field, lang);

    setForm(prev => {
      const next: NewsFormData = { ...prev, [key]: value };

      if (field === "title" && lang === prev.original_language && !slugEdited) {
        next.slug = slugify(value);
      }

      return next;
    });

    setFieldErrors(prev => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleBaseChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOriginalLanguageChange = (lang: Lang) => {
    setForm(prev => {
      const next = { ...prev, original_language: lang, lang };
      if (!slugEdited) {
        next.slug = slugify(getLocalizedValue(next, "title", lang));
      }
      return next;
    });
    setActiveLang(lang);
    setFieldErrors({});
  };

  const hasTranslationData = (lang: Lang): boolean => {
    return Boolean(
      getLocalizedValue(form, "title", lang).trim() ||
      getLocalizedValue(form, "excerpt", lang).trim() ||
      getLocalizedValue(form, "content", lang).trim()
    );
  };

  const focusFirstInvalidOriginalField = (
    errors: Partial<Record<LocalizedKey, string>>
  ) => {
    if (errors[originalTitleKey]) {
      originalTitleRef.current?.focus();
      originalTitleRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      return;
    }

    if (errors[originalExcerptKey]) {
      originalExcerptRef.current?.focus();
      originalExcerptRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      return;
    }

    if (errors[originalContentKey]) {
      originalContentAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  };

  const validate = (): boolean => {
    const nextFieldErrors: Partial<Record<LocalizedKey, string>> = {};

    if (!getLocalizedValue(form, "title", originalLang).trim()) {
      nextFieldErrors[originalTitleKey] = REQUIRED_MESSAGE.title;
    }
    if (!getLocalizedValue(form, "excerpt", originalLang).trim()) {
      nextFieldErrors[originalExcerptKey] = REQUIRED_MESSAGE.excerpt;
    }
    if (!getLocalizedValue(form, "content", originalLang).trim()) {
      nextFieldErrors[originalContentKey] = REQUIRED_MESSAGE.content;
    }

    setFieldErrors(nextFieldErrors);

    if (!form.slug.trim()) {
      setError("Slug e obrigatorio.");
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(form.slug)) {
      setError("Slug deve conter apenas letras minusculas, numeros e hifens.");
      return false;
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setError("Preencha os campos obrigatorios do idioma original.");
      setActiveLang(originalLang);
      requestAnimationFrame(() =>
        focusFirstInvalidOriginalField(nextFieldErrors)
      );
      return false;
    }

    setError(null);
    return true;
  };

  const handleGenerateTranslations = async (forceOverwrite = false) => {
    const sourceLang = form.original_language;
    const sourceTitle = getLocalizedValue(form, "title", sourceLang).trim();
    const sourceExcerpt = getLocalizedValue(form, "excerpt", sourceLang).trim();
    const sourceContent = getLocalizedValue(form, "content", sourceLang).trim();

    if (!sourceTitle || !sourceExcerpt || !sourceContent) {
      const missingList = [
        !sourceTitle && "Título",
        !sourceExcerpt && "Resumo",
        !sourceContent && "Conteúdo"
      ]
        .filter(Boolean)
        .join(", ");
      setError(
        `Complete o conteúdo em ${LANG_LABEL_PT[sourceLang]}. Falta: ${missingList}.`
      );
      setActiveLang(sourceLang);
      requestAnimationFrame(() =>
        focusFirstInvalidOriginalField({
          [originalTitleKey]: !sourceTitle ? REQUIRED_MESSAGE.title : undefined,
          [originalExcerptKey]: !sourceExcerpt
            ? REQUIRED_MESSAGE.excerpt
            : undefined,
          [originalContentKey]: !sourceContent
            ? REQUIRED_MESSAGE.content
            : undefined
        })
      );
      return;
    }

    const targets = LANG_TABS.map(item => item.code).filter(
      code => code !== sourceLang
    );

    if (!forceOverwrite) {
      const hasSomethingToGenerate = targets.some(target => {
        return (
          !getLocalizedValue(form, "title", target).trim() ||
          !getLocalizedValue(form, "excerpt", target).trim() ||
          !getLocalizedValue(form, "content", target).trim()
        );
      });

      if (!hasSomethingToGenerate) {
        showToast(
          "Todos os idiomas ja possuem conteudo. Nada para gerar.",
          "success"
        );
        return;
      }
    }

    setTranslating(true);
    setError(null);

    try {
      let generated = 0;
      let preserved = 0;

      const patches = await Promise.all(
        targets.map(async target => {
          const patch: Partial<NewsFormData> = {};

          const currentTitle = getLocalizedValue(form, "title", target);
          const currentExcerpt = getLocalizedValue(form, "excerpt", target);
          const currentContent = getLocalizedValue(form, "content", target);

          if (!currentTitle.trim() || forceOverwrite) {
            patch[fieldKey("title", target)] = await translatePlain(
              sourceTitle,
              sourceLang,
              target
            );
            generated += 1;
          } else {
            preserved += 1;
          }

          if (!currentExcerpt.trim() || forceOverwrite) {
            patch[fieldKey("excerpt", target)] = await translatePlain(
              sourceExcerpt,
              sourceLang,
              target
            );
            generated += 1;
          } else {
            preserved += 1;
          }

          if (!currentContent.trim() || forceOverwrite) {
            patch[fieldKey("content", target)] = await translateHTML(
              sourceContent,
              sourceLang,
              target
            );
            generated += 1;
          } else {
            preserved += 1;
          }

          return patch;
        })
      );

      setForm(prev => {
        let next = { ...prev };
        for (const patch of patches) {
          next = { ...next, ...patch };
        }
        return next;
      });

      if (forceOverwrite) {
        showToast("Traduções atualizadas com sucesso.", "success");
      } else if (generated === 0) {
        showToast("Nenhum campo vazio encontrado para traducao.", "success");
      } else if (preserved > 0) {
        showToast(
          `Traducoes geradas (${generated} campos). ${preserved} campo(s) existente(s) foram mantidos.`,
          "success"
        );
      } else {
        showToast(
          `Traducoes geradas com sucesso (${generated} campos).`,
          "success"
        );
      }
    } catch {
      setError(
        "Falha ao gerar traducoes. Verifique sua conexao e tente novamente."
      );
      showToast("Falha ao gerar traducoes.", "error");
    } finally {
      setTranslating(false);
      setShowUpdateConfirm(false);
    }
  };

  const handleCancel = async () => {
    const toDelete = mergeUnique(
      getNewlyAddedInlineUrls(
        originalContentSnapshotRef.current.es,
        form.content_es
      ),
      getNewlyAddedInlineUrls(
        originalContentSnapshotRef.current.pt,
        form.content_pt
      ),
      getNewlyAddedInlineUrls(
        originalContentSnapshotRef.current.en,
        form.content_en
      )
    );

    if (toDelete.length) {
      await deleteInlineImageUrls(toDelete);
    }

    navigate("/admin/noticias");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    if (!isDirty) return;

    const actionType = isEditing ? "update" : "create";
    if (!profile || !hasPermission(profile.role, "noticias", actionType)) {
      setError(t.admin.rbac.noPermission);
      return;
    }

    setSaving(true);
    setError(null);

    const payload = withLegacyCompatibility(form);

    if (isEditing && id) {
      const { data, error: saveError } = await updateNews(
        id,
        payload,
        previousStatus
      );
      if (saveError) {
        setError(saveError);
        setSaving(false);
        return;
      }

      const action =
        payload.status === "published" && previousStatus !== "published"
          ? "publish_news"
          : payload.status !== "published" && previousStatus === "published"
            ? "unpublish_news"
            : "edit_news";

      await log({
        action,
        entity_type: "news",
        entity_id: data?.id,
        entity_title: payload.title
      });

      const orphaned = mergeUnique(
        getOrphanedInlineUrls(
          originalContentSnapshotRef.current.es,
          payload.content_es
        ),
        getOrphanedInlineUrls(
          originalContentSnapshotRef.current.pt,
          payload.content_pt
        ),
        getOrphanedInlineUrls(
          originalContentSnapshotRef.current.en,
          payload.content_en
        )
      );

      if (orphaned.length) {
        await deleteInlineImageUrls(orphaned, url => {
          log({
            action: "delete_image",
            entity_type: "news",
            entity_id: data?.id,
            entity_title: url
          });
        });
      }

      originalContentSnapshotRef.current = {
        es: payload.content_es,
        pt: payload.content_pt,
        en: payload.content_en
      };
    } else {
      const { data, error: saveError } = await createNews(payload);
      if (saveError) {
        setError(saveError);
        setSaving(false);
        return;
      }

      await log({
        action: payload.status === "published" ? "publish_news" : "create_news",
        entity_type: "news",
        entity_id: data?.id,
        entity_title: payload.title
      });
    }

    navigate("/admin/noticias");
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
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/admin/noticias"
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0057A8] hover:bg-[#0057A8]/5 transition-colors">
          <svg
            className="w-5 h-5"
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
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
            {isEditing ? t.admin.editNews : t.admin.newNews}
          </p>
          <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937] leading-none">
            {originalTitle || (
              <span className="text-gray-300">{t.admin.noTitle}</span>
            )}
          </h1>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="slug" value={form.slug} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 sm:gap-6 items-start">
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-4 sm:px-6 sm:py-5 space-y-4">
              {!isEditing ? (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Em qual idioma você vai escrever esta notícia?{" "}
                    <span className="text-red-400">*</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {LANG_TABS.map(tab => (
                      <button
                        key={tab.code}
                        type="button"
                        onClick={() => handleOriginalLanguageChange(tab.code)}
                        className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                          tab.code === form.original_language
                            ? "bg-[#0057A8] text-white border-[#0057A8]"
                            : "bg-white text-[#374151] border-gray-200 hover:border-[#0057A8]/40 hover:text-[#0057A8]"
                        }`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <label
                    htmlFor="original_language"
                    className="block text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    Idioma original <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="original_language"
                    name="original_language"
                    value={form.original_language}
                    onChange={e =>
                      handleOriginalLanguageChange(e.target.value as Lang)
                    }
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors">
                    {LANG_TABS.map(option => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {LANG_TABS.map(tab => {
                  const isActive = tab.code === activeLang;
                  const isOriginal = tab.code === form.original_language;
                  const hasData = hasTranslationData(tab.code);
                  return (
                    <button
                      key={tab.code}
                      type="button"
                      onClick={() => setActiveLang(tab.code)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#0057A8] text-white border-[#0057A8]"
                          : "bg-white text-[#1F2937] border-gray-200 hover:border-[#0057A8]/40"
                      }`}>
                      {tab.label}
                      {isOriginal ? " (original)" : ""}
                      {hasData ? "" : " *"}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-500">
                    {isUpdateMode
                      ? "Todas as traduções já foram geradas. Você pode forçar a atualização."
                      : "Edite qualquer idioma manualmente. Gerar tradução só preenche campos vazios."}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      isUpdateMode
                        ? setShowUpdateConfirm(true)
                        : handleGenerateTranslations()
                    }
                    disabled={translating}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#0B7A4E] text-white hover:bg-[#096440] disabled:opacity-60 disabled:cursor-not-allowed transition-all w-full sm:w-auto">
                    {translating
                      ? "Gerando..."
                      : isUpdateMode
                        ? "Atualizar traduções"
                        : `Gerar ${LANG_TABS.filter(
                            l => l.code !== form.original_language
                          )
                            .map(l => LANG_LABEL_PT[l.code])
                            .join(" e ")}`}
                  </button>
                </div>
                {showUpdateConfirm && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                    <p className="text-sm text-amber-800">
                      As traduções existentes serão substituídas com base no
                      conteúdo do idioma original. Alterações manuais poderão
                      ser perdidas.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowUpdateConfirm(false)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGenerateTranslations(true)}
                        disabled={translating}
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-60 transition-colors">
                        Substituir traduções
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-4 sm:px-6 sm:py-5">
              <label
                htmlFor={`title_${activeLang}`}
                className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                {t.admin.titleLabel}{" "}
                {activeLang === form.original_language ? (
                  <span className="text-red-400">*</span>
                ) : null}
              </label>
              <input
                id={`title_${activeLang}`}
                name={activeTitleKey}
                type="text"
                required={activeLang === form.original_language}
                value={activeTitle}
                onChange={e =>
                  updateLocalizedField("title", activeLang, e.target.value)
                }
                placeholder={t.admin.titlePlaceholder}
                ref={
                  activeLang === form.original_language
                    ? originalTitleRef
                    : undefined
                }
                aria-invalid={Boolean(fieldErrors[activeTitleKey])}
                className="w-full text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937] bg-transparent border-0 focus:outline-none placeholder:text-gray-300 leading-snug"
              />
              {fieldErrors[activeTitleKey] && (
                <p className="text-xs text-red-600 mt-2">
                  {fieldErrors[activeTitleKey]}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-4 sm:px-6 sm:py-5">
              <label
                htmlFor={`excerpt_${activeLang}`}
                className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Resumo{" "}
                {activeLang === form.original_language ? (
                  <span className="text-red-400">*</span>
                ) : null}
              </label>
              <textarea
                id={`excerpt_${activeLang}`}
                name={activeExcerptKey}
                rows={4}
                required={activeLang === form.original_language}
                value={activeExcerpt}
                onChange={e =>
                  updateLocalizedField("excerpt", activeLang, e.target.value)
                }
                placeholder="Resumo curto da noticia"
                ref={
                  activeLang === form.original_language
                    ? originalExcerptRef
                    : undefined
                }
                aria-invalid={Boolean(fieldErrors[activeExcerptKey])}
                className="w-full text-sm text-[#1F2937] border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] placeholder:text-gray-300"
              />
              {fieldErrors[activeExcerptKey] && (
                <p className="text-xs text-red-600 mt-2">
                  {fieldErrors[activeExcerptKey]}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-50 bg-gray-50/60 sm:px-6 sm:py-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  {t.admin.coverLabel}
                </span>
              </div>
              <div className="p-3 sm:p-6">
                <CoverImageUpload
                  value={form.cover_url}
                  onChange={url =>
                    setForm(prev => ({ ...prev, cover_url: url }))
                  }
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.07)] overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between sm:px-6 sm:py-3.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  {t.admin.contentLabel}{" "}
                  {activeLang === form.original_language ? (
                    <span className="text-red-400">*</span>
                  ) : null}
                </span>
                <span className="text-[10px] text-gray-300 font-medium">
                  Rich Text
                </span>
              </div>
              <div
                className="p-2 sm:p-4"
                ref={
                  activeLang === form.original_language
                    ? originalContentAnchorRef
                    : undefined
                }>
                <RichTextEditor
                  key={activeLang}
                  value={activeContent}
                  onChange={html =>
                    updateLocalizedField("content", activeLang, html)
                  }
                  placeholder={t.admin.contentPlaceholder}
                />
              </div>
              {fieldErrors[activeContentKey] && (
                <p className="text-xs text-red-600 px-3 pb-3 sm:px-6 sm:pb-4">
                  {fieldErrors[activeContentKey]}
                </p>
              )}
            </div>

            <div className="pt-2 pb-8 space-y-3 px-1 sm:px-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400">
                  {t.admin.statusLabel}:
                </span>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleBaseChange}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors">
                  {STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-[#1F2937] hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all w-full sm:w-auto">
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving || !isDirty}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#0057A8] text-white hover:bg-[#004a8f] shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all w-full sm:w-auto">
                  {saving
                    ? "Salvando..."
                    : isEditing
                      ? t.admin.saveChanges
                      : t.admin.publish}
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </form>
    </div>
  );
}
