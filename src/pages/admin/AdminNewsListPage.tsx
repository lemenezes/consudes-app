import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listNews, setNewsStatus, deleteNews } from '../../services/newsService';
import { hasPermission } from '../../utils/rbac';
import { useAuth } from '../../context/AuthContext';
import { useAuditLog } from '../../hooks/useAuditLog';
import { useLanguage } from '../../context/LanguageContext';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import type { NewsRow, PublishStatus } from '../../lib/database.aliases';

const STATUS_COLORS: Record<PublishStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-yellow-100 text-yellow-700',
};

export default function AdminNewsListPage() {
  const { log } = useAuditLog();
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [news, setNews] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<NewsRow | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
    // Proteção RBAC para delete
    if (!profile || !hasPermission(profile.role, 'noticias', 'delete')) {
      setError(t.admin.rbac.noPermission);
      setToDelete(null);
      return;
    }
    const { error } = await deleteNews(toDelete.id, toDelete.cover_url);
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
            {t.admin.nav.news}
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
          {t.admin.newNews}
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
        <>
          {/* ── Mobile: cards ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 sm:hidden">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-4">
                {/* Título + status */}
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-[#1F2937] leading-snug line-clamp-2 flex-1">{item.title}</p>
                  <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                    {t.admin.status[item.status]}
                  </span>
                </div>

                {/* Data */}
                <p className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>

                {/* Toggle + ações */}
                <div className="flex items-center justify-between gap-3 pt-1 border-t border-gray-50">
                  {/* Toggle visibilidade */}
                  <button
                    role="switch"
                    aria-checked={item.status === 'published'}
                    onClick={() => handleTogglePublish(item)}
                    disabled={actionLoading === item.id}
                    className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className={`relative inline-flex items-center h-6 w-11 rounded-full border-2 border-transparent transition-colors duration-200 ${item.status === 'published' ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`inline-block w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${item.status === 'published' ? 'translate-x-5' : 'translate-x-0.5'} ${actionLoading === item.id ? 'animate-pulse' : ''}`} />
                    </span>
                    <span className={`text-xs font-medium ${item.status === 'published' ? 'text-green-600' : 'text-gray-400'}`}>
                      {actionLoading === item.id ? '…' : item.status === 'published' ? t.admin.visibility.visible : t.admin.visibility.hidden}
                    </span>
                  </button>

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/noticias/${item.id}/editar`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#0057A8] bg-[#0057A8]/5 hover:bg-[#0057A8]/10 border border-[#0057A8]/15 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                      </svg>
                      {t.admin.edit}
                    </Link>
                    <button
                      onClick={() => setToDelete(item)}
                      title={t.admin.deleteNews}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      {t.admin.deleteNews}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop: tabela ─────────────────────────────────────────────── */}
          <div className="hidden sm:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide">{t.admin.titleLabel}</th>
                  <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide">{t.admin.statusLabel}</th>
                  <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">{t.admin.createdAt}</th>
                  <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide">{t.admin.visibleOnSite}</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#1F2937] leading-snug line-clamp-1">{item.title}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                        {t.admin.status[item.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-gray-400 text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        role="switch"
                        aria-checked={item.status === 'published'}
                        onClick={() => handleTogglePublish(item)}
                        disabled={actionLoading === item.id}
                        className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className={`relative inline-flex items-center h-6 w-11 rounded-full border-2 border-transparent transition-colors duration-200 ${item.status === 'published' ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <span className={`inline-block w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${item.status === 'published' ? 'translate-x-5' : 'translate-x-0.5'} ${actionLoading === item.id ? 'animate-pulse' : ''}`} />
                        </span>
                        <span className={`text-xs font-medium ${item.status === 'published' ? 'text-green-600' : 'text-gray-400'}`}>
                          {actionLoading === item.id ? '…' : item.status === 'published' ? t.admin.visibility.visible : t.admin.visibility.hidden}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/noticias/${item.id}/editar`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#0057A8] bg-[#0057A8]/5 hover:bg-[#0057A8]/10 border border-[#0057A8]/15 hover:border-[#0057A8]/30 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                          {t.admin.edit}
                        </Link>
                        <button
                          onClick={() => setToDelete(item)}
                          title={t.admin.deleteNews}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          {t.admin.deleteNews}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal de confirmação de exclusão */}
      {toDelete && (
        <DeleteConfirmModal
          title={t.admin.deleteNews}
          itemLabel={toDelete.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
