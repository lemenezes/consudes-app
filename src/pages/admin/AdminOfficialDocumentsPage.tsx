import {
  Search,
  Plus,
  FileText,
  Languages,
  Send,
  Eye,
  Pencil
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

type OfficialDocumentStatus = "draft" | "published" | "sent";

type OfficialDocument = {
  id: string;
  number: string;
  subject: string;
  date: string;
  languages: string[];
  status: OfficialDocumentStatus;
};

const mockDocuments: OfficialDocument[] = [
  {
    id: "1",
    number: "025/2026",
    subject: "Convocação – Interclubes de Futsal",
    date: "25/09/2026",
    languages: ["PT", "ES", "EN"],
    status: "published"
  },
  {
    id: "2",
    number: "024/2026",
    subject: "Designação de sede – Xadrez",
    date: "18/09/2026",
    languages: ["PT", "ES", "EN"],
    status: "sent"
  },
  {
    id: "3",
    number: "023/2026",
    subject: "Informações sobre inscrição",
    date: "12/09/2026",
    languages: ["PT", "ES"],
    status: "published"
  },
  {
    id: "4",
    number: "022/2026",
    subject: "Alteração de datas – Tênis de Mesa",
    date: "05/09/2026",
    languages: ["PT"],
    status: "draft"
  }
];

function StatusBadge({ status }: { status: OfficialDocumentStatus }) {
  const { t } = useLanguage();
  const copy = t.admin.officialDocuments;
  const styles = {
    draft: "bg-amber-100 text-amber-700",
    published: "bg-emerald-100 text-emerald-700",
    sent: "bg-blue-100 text-blue-700"
  };

  const labels: Record<OfficialDocumentStatus, string> = {
    draft: copy.draft,
    published: copy.published,
    sent: copy.sent
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function AdminOfficialDocumentsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const copy = t.admin.officialDocuments;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[#172033]">
            {copy.pageTitle}
          </h1>

          <p className="mt-1 text-sm text-slate-500">{copy.description}</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/oficios/novo")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0067B9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00589F]">
          <Plus size={18} />
          {copy.newDocument}
        </button>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{copy.total}</p>
              <p className="mt-1 text-3xl font-semibold text-slate-800">24</p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-[#0067B9]">
              <FileText size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{copy.publishedCount}</p>
              <p className="mt-1 text-3xl font-semibold text-slate-800">16</p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <Eye size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{copy.sentCount}</p>
              <p className="mt-1 text-3xl font-semibold text-slate-800">12</p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Send size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Filtros */}
        <div className="border-b border-slate-200 p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder={copy.searchPlaceholder}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#0067B9] focus:ring-2 focus:ring-[#0067B9]/10"
              />
            </div>

            <select className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#0067B9]">
              <option>{copy.allStatuses}</option>
              <option>{copy.draft}</option>
              <option>{copy.published}</option>
              <option>{copy.sent}</option>
            </select>

            <select className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#0067B9]">
              <option>{copy.allYears}</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {copy.numberShort}
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {copy.subject}
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {copy.date}
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {copy.languagesLabel}
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {copy.status}
                </th>

                <th className="w-16 px-5 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {mockDocuments.map(document => (
                <tr key={document.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">
                    {document.number}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-50 p-2 text-[#0067B9]">
                        <FileText size={17} />
                      </div>

                      <span className="text-sm text-slate-700">
                        {document.subject}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-500">
                    {document.date}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      {document.languages.map(language => (
                        <span
                          key={language}
                          className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-semibold text-[#0067B9]">
                          {language}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={document.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      to={`/admin/oficios/${document.id}/editar`}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={copy.actions}>
                      <Pencil size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-slate-100 md:hidden">
          {mockDocuments.map(document => (
            <div key={document.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {document.number}
                    </span>

                    <StatusBadge status={document.status} />
                  </div>

                  <p className="mt-2 text-sm text-slate-700">
                    {document.subject}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">{document.date}</p>

                  <div className="mt-3 flex gap-1">
                    {document.languages.map(language => (
                      <span
                        key={language}
                        className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-semibold text-[#0067B9]">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/admin/oficios/${document.id}/editar`}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                  aria-label={copy.actions}>
                  <Pencil size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé da tabela */}
        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">{copy.showingRange}</p>

          <div className="flex items-center gap-1">
            <button className="h-9 min-w-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-500 hover:bg-slate-50">
              1
            </button>

            <button className="h-9 min-w-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-500 hover:bg-slate-50">
              2
            </button>

            <button className="h-9 min-w-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-500 hover:bg-slate-50">
              3
            </button>
          </div>
        </div>
      </div>

      {/* Próximos recursos */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 p-4">
          <Languages size={20} className="text-[#0067B9]" />
          <p className="mt-2 text-sm font-semibold text-slate-700">
            {copy.translations}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {copy.translationsDescription}
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 p-4">
          <FileText size={20} className="text-[#0067B9]" />
          <p className="mt-2 text-sm font-semibold text-slate-700">
            {copy.officialPdf}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {copy.officialPdfDescription}
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 p-4">
          <Pencil size={20} className="text-[#0067B9]" />
          <p className="mt-2 text-sm font-semibold text-slate-700">
            {copy.publicationEmail}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {copy.publicationEmailDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
