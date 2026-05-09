import { useAuth } from '../../context/AuthContext';

const CARDS = [
  { label: 'Notícias', note: 'Em breve', color: '#0057A8' },
  { label: 'Galeria', note: 'Em breve', color: '#D9A441' },
  { label: 'Relatórios', note: 'Em breve', color: '#003B73' },
  { label: 'Federações', note: 'Em breve', color: '#7FD6E8' },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
          Painel CONSUDES
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Bem-vindo,{' '}
          <span className="font-medium text-[#0057A8]">{user?.email}</span>
        </p>
      </div>

      {/* Cards de módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {CARDS.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">{card.label}</span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: card.color }}
              />
            </div>
            <p className="text-3xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
              —
            </p>
            <p className="text-xs text-gray-400 mt-1">{card.note}</p>
          </div>
        ))}
      </div>

      {/* Banner informativo */}
      <div className="bg-[#0057A8]/5 border border-[#0057A8]/15 rounded-xl p-6">
        <h2 className="text-base font-semibold text-[#003B73] mb-1">
          CMS em construção
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          A área de gerenciamento de conteúdo está sendo desenvolvida. Em breve será
          possível publicar notícias, gerenciar a galeria, adicionar relatórios de
          transparência e atualizar informações das federações diretamente por aqui.
        </p>
      </div>
    </div>
  );
}
