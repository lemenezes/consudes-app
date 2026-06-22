import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, List, Edit, Trash2, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { listGalleries, deleteGallery } from "../../services/galleryService";
import { hasPermission } from "../../utils/rbac";
import { useAuth } from "../../context/AuthContext";
import { useAuditLog } from "../../hooks/useAuditLog";
import { useLanguage } from "../../context/LanguageContext";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { galleryAlbums, getPhotoUrl } from "../../data/galleryData";
import type { GalleryAlbum } from "../../data/galleryData";

const VIEW_MODE_STORAGE_KEY = "admin-gallery-view-mode";

function getInitialViewMode(): "cards" | "list" {
  if (typeof window === "undefined") return "cards";
  const stored = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY);
  return stored === "list" ? "list" : "cards";
}

type SortKey = "album" | "category" | "year" | "country" | "photos";
type SortDirection = "asc" | "desc";

export default function AdminGalleryListPage() {
  const { log } = useAuditLog();
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [galleries, setGalleries] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<GalleryAlbum | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [sortState, setSortState] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "list">(
    getInitialViewMode
  );

  const originalOrderBySlug = useMemo(() => {
    return new Map(galleryAlbums.map((album, index) => [album.slug, index]));
  }, []);

  const originalAlbumBySlug = useMemo(() => {
    return new Map(galleryAlbums.map(album => [album.slug, album]));
  }, []);

  const isEditedOrNewAlbum = (album: GalleryAlbum): boolean => {
    const original = originalAlbumBySlug.get(album.slug);
    if (!original) return true;
    if (typeof album.adminTouchedAt === "number") return true;

    const { adminTouchedAt: _currentTouchedAt, ...currentComparable } = album;
    const originalComparable = original;

    return (
      JSON.stringify(currentComparable) !== JSON.stringify(originalComparable)
    );
  };

  const displayGalleries = useMemo(() => {
    const indexBySlug = new Map(
      galleries.map((album, index) => [album.slug, index])
    );

    const recentAlbums = galleries.filter(isEditedOrNewAlbum).sort((a, b) => {
      const touchedA = a.adminTouchedAt ?? -1;
      const touchedB = b.adminTouchedAt ?? -1;
      if (touchedA !== touchedB) return touchedB - touchedA;

      // Fallback para dados antigos sem timestamp: mantém novos mais recentes no topo.
      return (indexBySlug.get(b.slug) ?? -1) - (indexBySlug.get(a.slug) ?? -1);
    });

    const originalAlbums = galleries
      .filter(album => !isEditedOrNewAlbum(album))
      .sort((a, b) => {
        const orderA = originalOrderBySlug.get(a.slug);
        const orderB = originalOrderBySlug.get(b.slug);

        if (orderA != null && orderB != null) return orderA - orderB;
        if (orderA != null) return -1;
        if (orderB != null) return 1;
        return (indexBySlug.get(a.slug) ?? 0) - (indexBySlug.get(b.slug) ?? 0);
      });

    return [...recentAlbums, ...originalAlbums];
  }, [galleries, originalOrderBySlug, originalAlbumBySlug]);

  const sortedListGalleries = useMemo(() => {
    if (!sortState) return displayGalleries;

    const directionMultiplier = sortState.direction === "asc" ? 1 : -1;
    const indexBySlug = new Map(
      displayGalleries.map((album, index) => [album.slug, index])
    );

    const sorted = [...displayGalleries].sort((a, b) => {
      let comparison = 0;

      if (sortState.key === "album") {
        comparison = a.title.localeCompare(b.title, "pt-BR", {
          sensitivity: "base"
        });
      }

      if (sortState.key === "category") {
        comparison = getCategoryLabel(a.category).localeCompare(
          getCategoryLabel(b.category),
          "pt-BR",
          { sensitivity: "base" }
        );
      }

      if (sortState.key === "year") {
        const yearA = a.year ?? Number.NEGATIVE_INFINITY;
        const yearB = b.year ?? Number.NEGATIVE_INFINITY;
        comparison = yearA - yearB;
      }

      if (sortState.key === "country") {
        comparison = (a.country ?? "").localeCompare(b.country ?? "", "pt-BR", {
          sensitivity: "base"
        });
      }

      if (sortState.key === "photos") {
        comparison = a.photoCount - b.photoCount;
      }

      if (comparison !== 0) {
        return comparison * directionMultiplier;
      }

      return (indexBySlug.get(a.slug) ?? 0) - (indexBySlug.get(b.slug) ?? 0);
    });

    return sorted;
  }, [displayGalleries, sortState]);

  const toggleSort = (key: SortKey) => {
    setSortState(current => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }

      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }

      return null;
    });
  };

  const getSortIndicator = (key: SortKey): string => {
    if (!sortState || sortState.key !== key) return "↑↓";
    return sortState.direction === "asc" ? "↑" : "↓";
  };

  const getSortButtonClass = (key: SortKey): string => {
    const isActive = sortState?.key === key;
    return `inline-flex items-center gap-1 transition-colors ${
      isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
    }`;
  };

  const getSortIndicatorClass = (key: SortKey): string => {
    const isActive = sortState?.key === key;
    return isActive ? "text-[10px] text-blue-600" : "text-[10px] text-gray-400";
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await listGalleries();
    if (error) {
      setError(error);
    } else {
      setGalleries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
  }, [viewMode]);

  // ── Apagar ─────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async (reason: string) => {
    if (!toDelete) return;
    // Proteção RBAC para delete
    if (!profile || !hasPermission(profile.role, "galeria", "delete")) {
      setError(t.admin.rbac.noPermission);
      setToDelete(null);
      return;
    }
    setActionLoading(toDelete.slug);
    const { error } = await deleteGallery(toDelete.slug);
    if (error) {
      setError(error);
      setToDelete(null);
      setActionLoading(null);
      return;
    }

    await log({
      action: "delete_gallery_album" as const,
      entity_type: "gallery_album",
      entity_id: toDelete.slug,
      entity_title: toDelete.title,
      reason
    });

    setToDelete(null);
    setActionLoading(null);
    await load();
  };

  // ── Helpers para categorias ────────────────────────────────────────────
  function getCategoryLabel(category: string): string {
    const map: Record<string, string> = {
      interclubes: "Interclubes",
      "juegos-sudamericanos": "Juegos Sudamericanos",
      assembleias: "Assembleias",
      panamdes: "PANAMDES",
      capacitacao: "Capacitación",
      "futsal-feminino": "Futsal Feminino",
      historico: "Histórico"
    };
    return map[category] || category;
  }

  // ── Card de galeria para admin ──────────────────────────────────────────
  const GalleryCard = ({ album }: { album: GalleryAlbum }) => {
    const [imageFailed, setImageFailed] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const coverUrl = album.coverFile
      ? getPhotoUrl(album.slug, album.coverFile)
      : null;

    return (
      <article className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative overflow-hidden bg-gray-100 aspect-[3/2]">
          {!imageFailed && coverUrl ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />
              )}
              <img
                src={coverUrl}
                alt={album.title}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{ objectPosition: album.coverPosition ?? "center" }}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageFailed(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
              <Image className="w-8 h-8 text-gray-300 mb-2" />
              <span className="text-[10px] font-medium text-gray-400 uppercase">
                Sem thumbnail
              </span>
            </div>
          )}

          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center justify-center rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-gray-800 shadow-sm">
              {album.photoCount} foto{album.photoCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-2 min-h-[2.5rem]">
              {album.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {getCategoryLabel(album.category)}
            </p>
          </div>

          {/* Metadados estruturados */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-gray-500">Ano / País</span>
              <span className="text-gray-700 font-medium text-right">
                {album.year || "—"} · {album.city ? `${album.city}, ` : ""}
                {album.country || "—"}
              </span>
            </div>
          </div>

          {/* Ações */}
          <div className="pt-1 flex gap-2">
            <Link
              to={`/admin/galeria/editar/${album.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors">
              <Edit size={12} />
              Editar
            </Link>
            <button
              onClick={() => setToDelete(album)}
              disabled={actionLoading === album.slug}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition-colors disabled:opacity-50">
              <Trash2 size={12} />
              Apagar
            </button>
          </div>
        </div>
      </article>
    );
  };

  // ── Linha de tabela para modo lista ────────────────────────────────────
  const GalleryListRow = ({ album }: { album: GalleryAlbum }) => {
    const [imageFailed, setImageFailed] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const coverUrl = album.coverFile
      ? getPhotoUrl(album.slug, album.coverFile)
      : null;

    return (
      <tr className="group border-b border-gray-100 hover:bg-amber-100/70 transition-colors duration-150">
        {/* Capa */}
        <td className="px-2 py-2 align-middle">
          {!imageFailed && coverUrl ? (
            <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
              <img
                src={coverUrl}
                alt={album.title}
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{ objectPosition: album.coverPosition ?? "center" }}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageFailed(true)}
              />
            </div>
          ) : (
            <div className="w-16 h-12 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-0.5">
              <Image size={13} className="text-gray-400" />
              <span className="text-[9px] text-gray-400 leading-none">
                sem capa
              </span>
            </div>
          )}
        </td>

        {/* Título */}
        <td className="px-4 py-2 align-middle max-w-0">
          <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-950 truncate leading-snug transition-colors duration-150">
            {album.title}
          </p>
        </td>

        {/* Categoria */}
        <td className="px-4 py-2 text-xs text-gray-500 align-middle">
          {getCategoryLabel(album.category)}
        </td>

        {/* Ano */}
        <td className="px-4 py-3 text-sm text-gray-600 align-middle">
          {album.year || "—"}
        </td>

        {/* País */}
        <td className="px-4 py-3 text-sm text-gray-600 align-middle">
          {album.city ? `${album.city}, ` : ""}
          {album.country || "—"}
        </td>

        {/* Fotos */}
        <td className="pl-4 pr-2 py-3 text-center align-middle">
          <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-800 whitespace-nowrap">
            {album.photoCount} foto{album.photoCount !== 1 ? "s" : ""}
          </span>
        </td>

        {/* Ações */}
        <td className="pl-2 pr-4 py-2 align-middle">
          <div className="flex items-center justify-center gap-3">
            <Link
              to={`/admin/galeria/editar/${album.slug}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap">
              <Edit size={12} />
              Editar
            </Link>
            <span className="text-gray-200 select-none">|</span>
            <button
              onClick={() => setToDelete(album)}
              disabled={actionLoading === album.slug}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40 whitespace-nowrap">
              <Trash2 size={12} />
              Apagar
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
            Galeria de Fotos
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {galleries.length} álbum{galleries.length !== 1 ? "ns" : ""}
          </p>
        </div>
        <Link
          to="/admin/galeria/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D9A441] text-[#1F2937] text-sm font-semibold hover:bg-[#c8942e] transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Novo álbum
        </Link>
      </div>

      {/* Toggle de visualização (desktop only) */}
      {!loading && galleries.length > 0 && (
        <div className="mb-4 hidden justify-end md:flex">
          <div
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm"
            role="group"
            aria-label="Alternar visualização">
            <button
              onClick={() => setViewMode("cards")}
              aria-label="Visualização em cards"
              aria-pressed={viewMode === "cards"}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                viewMode === "cards"
                  ? "bg-[#1F2937] text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#1F2937]"
              }`}>
              <LayoutGrid size={13} aria-hidden="true" />
              Cards
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="Visualização em lista"
              aria-pressed={viewMode === "list"}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                viewMode === "list"
                  ? "bg-[#1F2937] text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#1F2937]"
              }`}>
              <List size={13} aria-hidden="true" />
              Lista
            </button>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Vazio */}
      {!loading && galleries.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">Nenhum álbum registrado.</p>
          <p className="text-sm mt-1">
            Use o botão acima para adicionar o primeiro.
          </p>
        </div>
      )}

      {/* Grid de cards (mobile sempre, desktop com toggle) */}
      {!loading && galleries.length > 0 && (
        <>
          {/* Cards view */}
          {(viewMode === "cards" || window.innerWidth < 768) && (
            <div className="grid grid-cols-1 gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {displayGalleries.map(album => (
                <GalleryCard key={album.slug} album={album} />
              ))}
            </div>
          )}

          {/* Lista view (desktop only) */}
          {viewMode === "list" && window.innerWidth >= 768 && (
            <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "76px" }} />
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "170px" }} />
                  <col style={{ width: "120px" }} />
                  <col style={{ width: "190px" }} />
                  <col style={{ width: "100px" }} />
                  <col style={{ width: "180px" }} />
                </colgroup>
                <thead className="border-b border-gray-200 bg-gray-50/80">
                  <tr>
                    <th className="px-2 py-2.5 text-left text-xs font-medium text-gray-500">
                      Capa
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
                      <button
                        type="button"
                        onClick={() => toggleSort("album")}
                        className={getSortButtonClass("album")}>
                        Álbum
                        <span className={getSortIndicatorClass("album")}>
                          {getSortIndicator("album")}
                        </span>
                      </button>
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
                      <button
                        type="button"
                        onClick={() => toggleSort("category")}
                        className={getSortButtonClass("category")}>
                        Categoria
                        <span className={getSortIndicatorClass("category")}>
                          {getSortIndicator("category")}
                        </span>
                      </button>
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
                      <button
                        type="button"
                        onClick={() => toggleSort("year")}
                        className={getSortButtonClass("year")}>
                        Ano
                        <span className={getSortIndicatorClass("year")}>
                          {getSortIndicator("year")}
                        </span>
                      </button>
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
                      <button
                        type="button"
                        onClick={() => toggleSort("country")}
                        className={getSortButtonClass("country")}>
                        País
                        <span className={getSortIndicatorClass("country")}>
                          {getSortIndicator("country")}
                        </span>
                      </button>
                    </th>
                    <th className="pl-4 pr-2 py-2.5 text-center text-xs font-medium text-gray-500">
                      <button
                        type="button"
                        onClick={() => toggleSort("photos")}
                        className={getSortButtonClass("photos")}>
                        Fotos
                        <span className={getSortIndicatorClass("photos")}>
                          {getSortIndicator("photos")}
                        </span>
                      </button>
                    </th>
                    <th className="pl-2 pr-4 py-2.5 text-center text-xs font-medium text-gray-500">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedListGalleries.map(album => (
                    <GalleryListRow key={album.slug} album={album} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal de confirmação de delete */}
      {toDelete && (
        <DeleteConfirmModal
          title="Deletar álbum?"
          itemLabel={toDelete.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
