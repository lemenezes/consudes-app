import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'

const AdminLoginPage        = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboard        = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminNewsListPage     = lazy(() => import('./pages/admin/AdminNewsListPage'))
const AdminNewsFormPage     = lazy(() => import('./pages/admin/AdminNewsFormPage'))
const AdminCalendarListPage = lazy(() => import('./pages/admin/AdminCalendarListPage'))
const AdminCalendarFormPage = lazy(() => import('./pages/admin/AdminCalendarFormPage'))
const HomePage              = lazy(() => import('./pages/HomePage'))
const HistoryPage           = lazy(() => import('./pages/HistoryPage'))
const MissionPage           = lazy(() => import('./pages/MissionPage'))
const ValuesPage            = lazy(() => import('./pages/ValuesPage'))
const TeamPage              = lazy(() => import('./pages/TeamPage'))
const FormerPresidentsPage  = lazy(() => import('./pages/FormerPresidentsPage'))
const HeadquartersPage      = lazy(() => import('./pages/HeadquartersPage'))
const FederationsPage       = lazy(() => import('./pages/FederationsPage'))
const SportsPage            = lazy(() => import('./pages/SportsPage'))
const ChampionshipsPage     = lazy(() => import('./pages/ChampionshipsPage'))
const InterclubsPage        = lazy(() => import('./pages/InterclubsPage'))
const SouthAmericanGamesPage = lazy(() => import('./pages/SouthAmericanGamesPage'))
const RankingsPage          = lazy(() => import('./pages/RankingsPage'))
const CalendarPage          = lazy(() => import('./pages/CalendarPage'))
const NewsPage              = lazy(() => import('./pages/NewsPage'))
const NewsDetailPage        = lazy(() => import('./pages/NewsDetailPage'))
const TransparencyPage      = lazy(() => import('./pages/TransparencyPage'))
const ReportsPage           = lazy(() => import('./pages/ReportsPage'))
const GalleryPage           = lazy(() => import('./pages/GalleryPage'))
const ContactPage           = lazy(() => import('./pages/ContactPage'))

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
          <Suspense fallback={null}>
            <RouterProvider router={router} />
          </Suspense>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
