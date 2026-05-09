import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listNews, setNewsStatus, deleteNews } from '../../services/newsService';
import { useAuditLog } from '../../hooks/useAuditLog';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import type { NewsRow, PublishStatus } from '../../lib/database.types';

const STATUS_LABELS: Record<PublishStatus, string> = {
  draft: 'Rascunho',
  published: 'Publicada',
  archived: 'Arquivada',
};

const STATUS_COLORS: Record<PublishStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-yellow-100 text-yellow-700',
};

export default function AdminNewsListPage() {
  const { log } = useAuditLog();
  const [news, setNews] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<NewsRow | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // id em processamento

  const load = async () => {
    setLoading(true);
    const { data, error } = await listNews();
    if (error) setError(error);
    else setNews(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // ── Publicar / Despublicar ─────────────────────────────────────────────
  const handleTogglePublish = async (item: NewsRow) => {
    const nextStatus: PublishStatus =
      item.status === 'published' ? 'draft' : 'published';
    setActionLoading(item.id);

    const { error } = await setNewsStatus(item.id, nextStatus);
    if (error) { setError(error); setActionLoading(null); return; }

    await log({
      action: nextStatus === 'published' ? 'publish_news' : 'unpublish_news',
      entity_type: 'news',
      entity_id: item.id,
      entity_title: item.title,
    });

    await load();
    setActionLoading(null);
  };

  // ── Apagar ─────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async (reason: string) => {
    if (!toDelete) return;
    const { error } = await deleteNews(toDelete.id);
    if (error) { setError(error); setToDelete(null); return; }

    await log({
      action: 'delete_news',
      entity_type: 'news',
      entity_id: toDelete.id,
      entity_title: toDelete.title,
      reason,
    });

    setToDelete(null);
    await load();
  };

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
            Notícias
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{news.length} registro{news.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          to="/admin/noticias/nova"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D9A441] text-[#1F2937] text-sm font-semibold hover:bg-[#c8942e] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nova notícia
        </Link>
      </div>

      {/* Erro global */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-4 border-[#0057A8] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          Nenhuma notícia cadastrada.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide">Título</th>
                <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">Status</th>
                <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">Idioma</th>
                <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">Criada em</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#1F2937] leading-snug line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.slug}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                      {STATUS_LABELS[item.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-gray-500 uppercase text-xs">
                    {item.lang}
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-gray-400 text-xs">
                    {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Publicar/Despublicar */}
                      <button
                        onClick={() => handleTogglePublish(item)}
                        disabled={actionLoading === item.id}
                        title={item.status === 'published' ? 'Despublicar' : 'Publicar'}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#0057A8] hover:bg-[#0057A8]/5 transition-colors disabled:opacity-40"
                      >
                        {item.status === 'published' ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>

                      {/* Editar */}
                      <Link
                        to={`/admin/noticias/${item.id}/editar`}
                        title="Editar"
                        className="p-2 rounded-lg text-gray-400 hover:text-[#0057A8] hover:bg-[#0057A8]/5 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                        </svg>
                      </Link>

                      {/* Apagar */}
                      <button
                        onClick={() => setToDelete(item)}
                        title="Apagar"
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {toDelete && (
        <DeleteConfirmModal
          title="Apagar notícia"
          itemLabel={toDelete.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
