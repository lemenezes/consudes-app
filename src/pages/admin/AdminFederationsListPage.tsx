import { useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Link } from "react-router-dom";
import {
  listFederations,
  deleteFederation
} from "../../services/federationsService";
import { hasPermission } from "../../utils/rbac";
import { useAuth } from "../../context/AuthContext";
import { useAuditLog } from "../../hooks/useAuditLog";
import { useLanguage } from "../../context/LanguageContext";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import type { FederationRow } from "../../lib/database.aliases";

export default function AdminFederationsListPage() {
  const { log } = useAuditLog();
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [federations, setFederations] = useState<FederationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<FederationRow | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "list">("list");

  const load = async () => {
    setLoading(true);
    const { data, error } = await listFederations();
    if (error) setError(error);
    else setFederations(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // ── Apagar ─────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async (reason: string) => {
    if (!toDelete) return;
    // Proteção RBAC para delete
    if (!profile || !hasPermission(profile.role, "federacoes", "delete")) {
      setError(t.admin.rbac.noPermission);
      setToDelete(null);
      return;
    }
    setActionLoading(toDelete.id);
    const { error } = await deleteFederation(toDelete.id, toDelete.logo_url);
    if (error) {
      setError(error);
      setToDelete(null);
      setActionLoading(null);
      return;
    }

    await log({
      action: "delete_federation",
      entity_type: "federation",
      entity_id: toDelete.id,
      entity_title: toDelete.acronym,
      reason
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
            {federations.length} federação
            {federations.length !== 1 ? "ões" : ""}
          </p>
        </div>
        <Link
          to="/admin/federacoes/nova"
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
          Nova federação
        </Link>
      </div>

      {!loading && federations.length > 0 && (
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

      {/* Lista */}
      {!loading && federations.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">Nenhuma federação registrada.</p>
          <p className="text-sm mt-1">
            Use o botão acima para adicionar a primeira.
          </p>
        </div>
      )}

      {!loading && federations.length > 0 && (
        <div
          className={
            viewMode === "cards"
              ? "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
              : "grid grid-cols-1 gap-3 md:hidden"
          }>
          {federations.map(fed => (
            <article
              key={fed.id}
              className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start gap-3">
                {fed.logo_url && (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-1.5 shadow-sm">
                    <img
                      src={fed.logo_url}
                      alt={`Logo ${fed.acronym}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[22px] leading-none"
                          role="img"
                          aria-label={fed.country_es ?? undefined}>
                          {fed.flag}
                        </span>
                        <p className="truncate text-sm font-semibold text-[#1F2937]">
                          {fed.country_es}
                        </p>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                          {fed.acronym}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] leading-5 text-gray-500">
                        {fed.name_es}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium tabular-nums text-gray-400">
                      #{fed.sort_order}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-2.5">
                <Link
                  to={`/admin/federacoes/${fed.id}/editar`}
                  className="flex-1 rounded-lg bg-[#0057A8]/8 px-3 py-1.5 text-center text-[11px] font-semibold text-[#0057A8] transition-colors hover:bg-[#0057A8]/15">
                  Editar
                </Link>
                <button
                  onClick={() => setToDelete(fed)}
                  disabled={actionLoading === fed.id}
                  className="flex-1 rounded-lg bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-40">
                  Apagar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && federations.length > 0 && viewMode === "list" && (
        <div className="hidden overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-12">
                  #
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Bandeira
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Sigla
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  País
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">
                  Nome oficial
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {federations.map(fed => (
                <tr key={fed.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 tabular-nums">
                    {fed.sort_order}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-2xl"
                      role="img"
                      aria-label={fed.country_es ?? undefined}>
                      {fed.flag}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-[11px] font-bold tracking-widest text-blue-700 uppercase">
                      {fed.acronym}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1F2937]">
                    {fed.country_es}
                  </td>
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
                        className="px-3 py-1.5 rounded-lg bg-[#0057A8]/8 text-[#0057A8] text-xs font-semibold hover:bg-[#0057A8]/15 transition-colors">
                        Editar
                      </Link>
                      <button
                        onClick={() => setToDelete(fed)}
                        disabled={actionLoading === fed.id}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-40">
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
          itemLabel={toDelete.name_es ?? ""}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
