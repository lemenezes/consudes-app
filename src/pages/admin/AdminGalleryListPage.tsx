import { useEffect, useState } from "react";
import { LayoutGrid, List, Edit, Trash2, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { listGalleries, deleteGallery } from "../../services/galleryService";
import { hasPermission } from "../../utils/rbac";
import { useAuth } from "../../context/AuthContext";
import { useAuditLog } from "../../hooks/useAuditLog";
import { useLanguage } from "../../context/LanguageContext";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { getPhotoUrl } from "../../data/galleryData";
import type { GalleryAlbum } from "../../data/galleryData";

const TIER_LABELS: Record<string, string> = {
  T1: "Destaque",
  T2: "Galeria",
  T3: "Arquivo"
};

const TIER_COLORS: Record<string, string> = {
  T1: "bg-consudes-gold text-white",
  T2: "bg-blue-500 text-white",
  T3: "bg-gray-500 text-white"
};

export default function AdminGalleryListPage() {
  const { log } = useAuditLog();
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [galleries, setGalleries] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<GalleryAlbum | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "list">("list");

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
  const getCategoryLabel = (category: string): string => {
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
  };

  // ── Card de galeria para admin ──────────────────────────────────────────
  const GalleryCard = ({ album }: { album: GalleryAlbum }) => {
    const [imageFailed, setImageFailed] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const coverUrl = album.coverFile
      ? getPhotoUrl(album.slug, album.coverFile)
      : null;

    return (
      <article className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
        {/* Thumbnail */}
        <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
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

          {/* Overlay com informações */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <div className="w-full text-white space-y-1">
              <p className="text-xs font-semibold truncate">{album.title}</p>
              <p className="text-[10px] text-white/70">
                {album.photoCount} foto{album.photoCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Tier badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${TIER_COLORS[album.tier]}`}>
              {TIER_LABELS[album.tier]}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 space-y-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 truncate mb-0.5">
              {album.title}
            </h3>
            <p className="text-xs text-gray-500">
              {getCategoryLabel(album.category)}
            </p>
          </div>

          {/* Metadados */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {album.year && <span>{album.year}</span>}
            {album.year && (album.city || album.country) && <span>·</span>}
            {album.city ? `${album.city}, ${album.country}` : album.country}
          </div>

          {/* Ações */}
          <div className="pt-2 flex gap-1.5">
            <Link
              to={`/admin/galeria/editar/${album.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-semibold transition-colors">
              <Edit size={12} />
              Editar
            </Link>
            <button
              onClick={() => setToDelete(album)}
              disabled={actionLoading === album.slug}
              className="flex items-center justify-center px-2 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-semibold transition-colors disabled:opacity-50">
              <Trash2 size={12} />
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
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        {/* Thumbnail pequeño */}
        <td className="px-4 py-3">
          {!imageFailed && coverUrl ? (
            <img
              src={coverUrl}
              alt={album.title}
              className={`w-12 h-12 rounded-lg object-cover border border-gray-100 ${
                imageLoaded ? "opacity-100" : "opacity-50"
              }`}
              style={{ objectPosition: album.coverPosition ?? "center" }}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <Image size={16} className="text-gray-300" />
            </div>
          )}
        </td>

        {/* Título */}
        <td className="px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{album.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {getCategoryLabel(album.category)}
            </p>
          </div>
        </td>

        {/* Tier */}
        <td className="px-4 py-3">
          <span
            className={`inline-flex text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${TIER_COLORS[album.tier]}`}>
            {TIER_LABELS[album.tier]}
          </span>
        </td>

        {/* Ano & País */}
        <td className="px-4 py-3 text-sm text-gray-600">
          {album.year || "—"} · {album.city ? `${album.city}, ` : ""}
          {album.country || "—"}
        </td>

        {/* Fotos */}
        <td className="px-4 py-3 text-sm font-medium text-gray-900">
          {album.photoCount}
        </td>

        {/* Ações */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Link
              to={`/admin/galeria/editar/${album.slug}`}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors">
              <Edit size={14} />
              Editar
            </Link>
            <button
              onClick={() => setToDelete(album)}
              disabled={actionLoading === album.slug}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50">
              <Trash2 size={14} />
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
            <div className="grid grid-cols-1 gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {galleries.map(album => (
                <GalleryCard key={album.slug} album={album} />
              ))}
            </div>
          )}

          {/* Lista view (desktop only) */}
          {viewMode === "list" && window.innerWidth >= 768 && (
            <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Capa
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Álbum
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ano / País
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fotos
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {galleries.map(album => (
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
