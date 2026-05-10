import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminNewsListPage from './pages/admin/AdminNewsListPage'
import AdminNewsFormPage from './pages/admin/AdminNewsFormPage'
import AdminCalendarListPage from './pages/admin/AdminCalendarListPage'
import AdminCalendarFormPage from './pages/admin/AdminCalendarFormPage'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import MissionPage from './pages/MissionPage'
import ValuesPage from './pages/ValuesPage'
import TeamPage from './pages/TeamPage'
import FormerPresidentsPage from './pages/FormerPresidentsPage'
import HeadquartersPage from './pages/HeadquartersPage'
import FederationsPage from './pages/FederationsPage'
import SportsPage from './pages/SportsPage'
import ChampionshipsPage from './pages/ChampionshipsPage'
import InterclubsPage from './pages/InterclubsPage'
import SouthAmericanGamesPage from './pages/SouthAmericanGamesPage'
import RankingsPage from './pages/RankingsPage'
import CalendarPage from './pages/CalendarPage'
import NewsPage from './pages/NewsPage'
import NewsDetailPage from './pages/NewsDetailPage'
import TransparencyPage from './pages/TransparencyPage'
import ReportsPage from './pages/ReportsPage'
import GalleryPage from './pages/GalleryPage'
import ContactPage from './pages/ContactPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      // Institucional
      { path: 'historia', element: <HistoryPage /> },
      { path: 'missao', element: <MissionPage /> },
      { path: 'valores', element: <ValuesPage /> },
      { path: 'equipe', element: <TeamPage /> },
      { path: 'ex-presidentes', element: <FormerPresidentsPage /> },
      { path: 'sede', element: <HeadquartersPage /> },
      // Standalone
      { path: 'federacoes', element: <FederationsPage /> },
      { path: 'esportes', element: <SportsPage /> },
      // Campeonatos
      { path: 'campeonatos', element: <ChampionshipsPage /> },
      { path: 'interclubes', element: <InterclubsPage /> },
      { path: 'jogos-sul-americanos', element: <SouthAmericanGamesPage /> },
      { path: 'rankings', element: <RankingsPage /> },
      { path: 'calendario', element: <CalendarPage /> },
      // Outros
      { path: 'noticias', element: <NewsPage /> },
      { path: 'noticias/:slug', element: <NewsDetailPage /> },
      { path: 'transparencia', element: <TransparencyPage /> },
      { path: 'relatorios', element: <ReportsPage /> },
      { path: 'galeria', element: <GalleryPage /> },
      { path: 'contato', element: <ContactPage /> },
    ],
  },
  // ── Área administrativa ──────────────────────────────────────────────────
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <ProtectedAdminRoute />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'noticias', element: <AdminNewsListPage /> },
      { path: 'noticias/nova', element: <AdminNewsFormPage /> },
      { path: 'noticias/:id/editar', element: <AdminNewsFormPage /> },
      { path: 'calendario', element: <AdminCalendarListPage /> },
      { path: 'calendario/novo', element: <AdminCalendarFormPage /> },
      { path: 'calendario/:id/editar', element: <AdminCalendarFormPage /> },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <RouterProvider router={router} />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
