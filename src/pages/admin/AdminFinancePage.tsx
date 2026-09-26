import { useEffect, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Eye,
  FileText,
  List,
  Plus,
  Search,
  Wallet
} from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useLanguage } from "../../context/LanguageContext";
import { getUsdToBrlRate } from "../../services/exchangeRateService";
import {
  Info
  // ...
} from "lucide-react";

type Transaction = {
  id: string;
  date: string;
  type: "income" | "expense";
  category: "registration" | "lodging" | "donation";
  description: "registration" | "lodging" | "donation";
  amount: number;
  method: "pix" | "transfer";
  responsible: string;
};

const transactions: Transaction[] = [
  {
    id: "1",
    date: "2026-09-25",
    type: "income",
    category: "registration",
    description: "registration",
    amount: 2500,
    method: "pix",
    responsible: "Ana Silva"
  },
  {
    id: "2",
    date: "2026-09-23",
    type: "expense",
    category: "lodging",
    description: "lodging",
    amount: 1850,
    method: "transfer",
    responsible: "Carlos Lima"
  },
  {
    id: "3",
    date: "2026-09-18",
    type: "income",
    category: "donation",
    description: "donation",
    amount: 3200,
    method: "transfer",
    responsible: "Ana Silva"
  },
  {
    id: "4",
    date: "2026-08-29",
    type: "income",
    category: "registration",
    description: "registration",
    amount: 1200,
    method: "pix",
    responsible: "Carlos Lima"
  }
];

const locales = { pt: "pt-BR", es: "es-ES", en: "en-US" };
const financialFlow = [
  { month: "2026-04-01", income: 8500, expenses: 5500 },
  { month: "2026-05-01", income: 12000, expenses: 7200 },
  { month: "2026-06-01", income: 10500, expenses: 4800 },
  { month: "2026-07-01", income: 13000, expenses: 6300 },
  { month: "2026-08-01", income: 17500, expenses: 9000 },
  { month: "2026-09-01", income: 12800, expenses: 7350 }
];

export default function AdminFinancePage() {
  const { t, lang } = useLanguage();
  const copy = t.admin.finance;
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [exchangeUpdatedAt, setExchangeUpdatedAt] = useState<string | null>(
    null
  );

  useEffect(() => {
    let active = true;
    getUsdToBrlRate()
      .then(({ rate, updatedAt }) => {
        if (!active) return;
        setExchangeRate(rate);
        setExchangeUpdatedAt(updatedAt);
      })
      .catch(() => {
        if (!active) return;
        setExchangeRate(null);
        setExchangeUpdatedAt(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const locale = lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US";

  const money = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD"
    }).format(value);
  const brlMoney = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "BRL"
    }).format(value);
  const exchangeUnit = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(1);
  const date = (value: string) =>
    new Intl.DateTimeFormat(locales[lang], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(new Date(`${value}T12:00:00`));
  const monthLabel = (value: string) => {
    const month = new Intl.DateTimeFormat(locales[lang], { month: "short" })
      .format(new Date(`${value}T12:00:00`))
      .replace(".", "");
    return `${month.charAt(0).toLocaleUpperCase(locales[lang])}${month.slice(1)}/2026`;
  };
  const axisMoney = (value: number) =>
    new Intl.NumberFormat(locales[lang], {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);

  const filtered = transactions.filter(item => {
    const query = search.trim().toLocaleLowerCase(locales[lang]);
    return (
      (!period || item.date.startsWith(period)) &&
      (!type || item.type === type) &&
      (!category || item.category === category) &&
      (!query ||
        [
          copy.categories[item.category],
          copy.examples[item.description],
          copy.methods[item.method],
          item.responsible,
          date(item.date)
        ].some(value => value.toLocaleLowerCase(locales[lang]).includes(query)))
    );
  });

  const summaries = [
    {
      label: copy.currentBalance,
      value: money(18450),
      reference: exchangeRate === null ? null : brlMoney(18450 * exchangeRate),
      icon: Wallet,
      color: "bg-blue-50 text-[#0067B9]"
    },
    {
      label: copy.monthlyIncome,
      value: money(12800),
      reference: exchangeRate === null ? null : brlMoney(12800 * exchangeRate),
      icon: ArrowDownLeft,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      label: copy.monthlyExpenses,
      value: money(7350),
      reference: exchangeRate === null ? null : brlMoney(7350 * exchangeRate),
      icon: ArrowUpRight,
      color: "bg-red-50 text-red-600"
    },
    {
      label: copy.monthlyTransactions,
      value: "18",
      reference: null,
      icon: List,
      color: "bg-slate-100 text-slate-600"
    }
  ];
  const periodTotals = [
    {
      label: copy.totalIncome,
      value: money(72450),
      icon: ArrowDownLeft,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      label: copy.totalExpenses,
      value: money(38200),
      icon: ArrowUpRight,
      color: "bg-red-50 text-red-600"
    },
    {
      label: copy.periodBalance,
      value: money(34250),
      icon: Wallet,
      color: "bg-blue-50 text-[#0067B9]"
    },
    {
      label: copy.totalTransactions,
      value: "96",
      icon: List,
      color: "bg-slate-100 text-slate-600"
    }
  ];
  const filterClass =
    "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#0067B9] focus:ring-2 focus:ring-[#0067B9]/10";
  const badge = (transactionType: Transaction["type"]) => (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${transactionType === "income" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
      {copy[transactionType]}
    </span>
  );

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[#172033]">
            {copy.pageTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{copy.description}</p>
          {exchangeRate !== null && exchangeUpdatedAt !== null && (
            <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-xs text-slate-500">
              <ArrowLeftRight
                size={14}
                aria-hidden="true"
                className="shrink-0"
              />

              <span>
                {copy.exchangeReference}: {exchangeUnit} ={" "}
                {brlMoney(exchangeRate ?? 0)}
              </span>

              {exchangeUpdatedAt && (
                <>
                  <span aria-hidden="true">·</span>

                  <span>
                    {copy.exchangeUpdatedAt}{" "}
                    {new Intl.DateTimeFormat(locales[lang], {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    }).format(new Date(`${exchangeUpdatedAt}T12:00:00`))}
                  </span>
                </>
              )}

              <span className="group relative inline-flex items-center">
                <Info
                  size={13}
                  className="cursor-help text-slate-400"
                  aria-label={copy.exchangeSource}
                />

                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg group-hover:block">
                  {copy.exchangeSource}
                </span>
              </span>
            </p>
          )}
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0067B9] px-4 py-2.5 text-sm font-semibold text-white opacity-70 cursor-not-allowed">
          <Plus size={18} />
          {copy.newTransaction}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaries.map(summary => (
          <div
            key={summary.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <div
                className={`shrink-0 rounded-full p-3.5 shadow-sm ring-1 ring-inset ring-white/70 ${summary.color}`}>
                <summary.icon size={24} strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-slate-500">{summary.label}</p>
                <p className="mt-1 break-words text-2xl font-bold leading-tight text-[#172033]">
                  {summary.value}
                </p>
                {summary.reference && (
                  <p className="mt-1 text-xs text-slate-500">
                    ≈ {summary.reference}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-amber-50 p-2.5 text-amber-600 ring-1 ring-inset ring-amber-100">
              <Activity size={22} />
            </span>
            <div>
              <h2 className="font-serif text-[22px] font-semibold leading-tight text-[#172033]">
                {copy.financialFlow}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {copy.flowDescription}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 opacity-80 cursor-not-allowed">
            <CalendarDays size={16} /> {copy.flowPeriod}{" "}
            <ChevronDown size={14} />
          </button>
        </div>
        <div
          className="h-[260px] w-full sm:h-[290px]"
          role="img"
          aria-label={`${copy.financialFlow}: ${copy.flowDescription}`}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={financialFlow}
              margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              accessibilityLayer>
              <defs>
                <linearGradient
                  id="finance-income-fill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.23} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="finance-expenses-fill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.19} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="#e2e8f0"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="month"
                tickFormatter={monthLabel}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                minTickGap={12}
              />
              <YAxis
                domain={[0, 20000]}
                ticks={[0, 5000, 10000, 15000, 20000]}
                tickFormatter={axisMoney}
                width={88}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;

                  const income = payload.find(
                    item => item.dataKey === "income"
                  );
                  const expenses = payload.find(
                    item => item.dataKey === "expenses"
                  );

                  return (
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
                      <p className="mb-2 text-sm font-semibold text-slate-700">
                        {monthLabel(String(label))}
                      </p>

                      {income && (
                        <p className="text-sm font-semibold text-green-700">
                          {copy.flowIncome}: {money(Number(income.value))}
                        </p>
                      )}

                      {expenses && (
                        <p className="mt-1 text-sm font-semibold text-red-600">
                          {copy.flowExpenses}: {money(Number(expenses.value))}
                        </p>
                      )}
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                height={32}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="income"
                fill="url(#finance-income-fill)"
                stroke="none"
                tooltipType="none"
                legendType="none"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                fill="url(#finance-expenses-fill)"
                stroke="none"
                tooltipType="none"
                legendType="none"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="income"
                name={copy.flowIncome}
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#16a34a", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name={copy.flowExpenses}
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-blue-50 p-2.5 text-[#0067B9] ring-1 ring-inset ring-blue-100">
            <List size={22} />
          </span>
          <h2 className="font-serif text-xl font-semibold text-[#172033]">
            {copy.periodSummary}
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
          {periodTotals.map(total => (
            <div
              key={total.label}
              className="flex items-center gap-4 py-2 xl:border-l xl:border-slate-300 xl:pl-5 xl:pr-3 xl:first:border-l-0 xl:first:pl-0">
              <span className={`shrink-0 rounded-lg p-3 ${total.color}`}>
                <total.icon size={22} strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">{total.label}</p>
                <p className="mt-1 break-words text-xl font-semibold leading-tight text-[#172033]">
                  {total.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-xl bg-blue-50 p-2 text-[#0067B9] ring-1 ring-inset ring-blue-100">
              <FileText size={18} />
            </span>
            <h2 className="font-serif text-xl text-[#172033]">
              {copy.latestTransactions}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_160px_160px_190px]">
            <div className="relative sm:col-span-2 xl:col-span-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                aria-label={copy.searchPlaceholder}
                placeholder={copy.searchPlaceholder}
                className={`${filterClass} pl-10`}
              />
            </div>
            <select
              value={period}
              onChange={event => setPeriod(event.target.value)}
              aria-label={copy.period}
              className={filterClass}>
              <option value="">
                {copy.period}: {copy.allPeriods}
              </option>
              <option value="2026-09">09/2026</option>
              <option value="2026-08">08/2026</option>
            </select>
            <select
              value={type}
              onChange={event => setType(event.target.value)}
              aria-label={copy.type}
              className={filterClass}>
              <option value="">{copy.allTypes}</option>
              <option value="income">{copy.income}</option>
              <option value="expense">{copy.expense}</option>
            </select>
            <select
              value={category}
              onChange={event => setCategory(event.target.value)}
              aria-label={copy.category}
              className={filterClass}>
              <option value="">{copy.allCategories}</option>
              {Object.entries(copy.categories).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-100/80">
              <tr>
                {[
                  copy.date,
                  copy.type,
                  copy.category,
                  copy.descriptionColumn,
                  copy.amount,
                  copy.paymentMethod,
                  copy.responsible,
                  copy.receipt,
                  copy.actions
                ].map(label => (
                  <th
                    key={label}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                    {date(item.date)}
                  </td>
                  <td className="px-4 py-4">{badge(item.type)}</td>
                  <td className="px-4 py-4 text-slate-600">
                    {copy.categories[item.category]}
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-700">
                    {copy.examples[item.description]}
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-4 font-semibold ${item.type === "income" ? "text-emerald-700" : "text-red-700"}`}>
                    {item.type === "income" ? "+" : "−"}
                    {money(item.amount)}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {copy.methods[item.method]}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {item.responsible}
                  </td>
                  <td className="px-4 py-4 text-slate-400">{copy.noReceipt}</td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      disabled
                      aria-label={copy.details}
                      title={copy.details}
                      className="rounded-lg p-2 text-slate-400 opacity-50 cursor-not-allowed">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-100 lg:hidden">
          {filtered.map(item => (
            <article key={item.id} className="space-y-3 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-700">
                    {copy.examples[item.description]}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {date(item.date)} · {copy.categories[item.category]}
                  </p>
                </div>
                {badge(item.type)}
              </div>
              <p
                className={`text-lg font-semibold ${item.type === "income" ? "text-emerald-700" : "text-red-700"}`}>
                {item.type === "income" ? "+" : "−"}
                {money(item.amount)}
              </p>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:grid-cols-4">
                <div>
                  <dt className="text-slate-500">{copy.paymentMethod}</dt>
                  <dd className="mt-0.5 text-slate-700">
                    {copy.methods[item.method]}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">{copy.responsible}</dt>
                  <dd className="mt-0.5 text-slate-700">{item.responsible}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{copy.receipt}</dt>
                  <dd className="mt-0.5 text-slate-700">{copy.noReceipt}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{copy.actions}</dt>
                  <dd>
                    <button
                      type="button"
                      disabled
                      aria-label={copy.details}
                      title={copy.details}
                      className="mt-0.5 text-slate-400 opacity-50 cursor-not-allowed">
                      <Eye size={18} />
                    </button>
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="px-4 py-12 text-center text-sm text-slate-500">
            {copy.empty}
          </p>
        )}
      </section>
    </div>
  );
}
