import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listFederations, deleteFederation } from '../../services/federationsService';
import { useAuditLog } from '../../hooks/useAuditLog';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import type { FederationRow } from '../../lib/database.types';

export default function AdminFederationsListPage() {
  const { log } = useAuditLog();
  const [federations, setFederations] = useState<FederationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<FederationRow | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await listFederations();
    if (error) setError(error);
    else setFederations(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // ── Apagar ─────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async (reason: string) => {
    if (!toDelete) return;
    setActionLoading(toDelete.id);
    const { error } = await deleteFederation(toDelete.id, toDelete.logo_url);
    if (error) { setError(error); setToDelete(null); setActionLoading(null); return; }

    await log({
      action: 'delete_federation',
      entity_type: 'federation',
      entity_id: toDelete.id,
      entity_title: toDelete.acronym,
      reason,
    });

    setToDelete(null);
    setActionLoading(null);
    await load();
  };

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
            Federações Filiadas
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {federations.length} federação{federations.length !== 1 ? 'ões' : ''}
          </p>
        </div>
        <Link
          to="/admin/federacoes/nova"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D9A441] text-[#1F2937] text-sm font-semibold hover:bg-[#c8942e] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nova federação
        </Link>
      </div>

      {/* Erro */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Lista */}
      {!loading && federations.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">Nenhuma federação registrada.</p>
          <p className="text-sm mt-1">Use o botão acima para adicionar a primeira.</p>
        </div>
      )}

      {!loading && federations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-12">#</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Bandeira</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Sigla</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">País</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Nome oficial</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {federations.map((fed) => (
                <tr key={fed.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 tabular-nums">{fed.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className="text-2xl" role="img" aria-label={fed.country_es}>
                      {fed.flag}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-[11px] font-bold tracking-widest text-blue-700 uppercase">
                      {fed.acronym}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1F2937]">{fed.country_es}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-xs truncate">
                    {fed.name_es}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {fed.logo_url && (
                        <img
                          src={fed.logo_url}
                          alt={`Logo ${fed.acronym}`}
                          className="w-8 h-6 object-contain rounded border border-gray-100"
                        />
                      )}
                      <Link
                        to={`/admin/federacoes/${fed.id}/editar`}
                        className="px-3 py-1.5 rounded-lg bg-[#0057A8]/8 text-[#0057A8] text-xs font-semibold hover:bg-[#0057A8]/15 transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => setToDelete(fed)}
                        disabled={actionLoading === fed.id}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-40"
                      >
                        Apagar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal confirmação */}
      {toDelete && (
        <DeleteConfirmModal
          title={`Apagar ${toDelete.acronym}?`}
          itemLabel={toDelete.name_es}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
