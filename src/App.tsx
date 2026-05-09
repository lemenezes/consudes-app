import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProgramsPage from './pages/ProgramsPage'
import FederationsPage from './pages/FederationsPage'
import NewsPage from './pages/NewsPage'
import EventsPage from './pages/EventsPage'
import TransparencyPage from './pages/TransparencyPage'
import GalleryPage from './pages/GalleryPage'
import ContactPage from './pages/ContactPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'sobre', element: <AboutPage /> },
      { path: 'programas', element: <ProgramsPage /> },
      { path: 'federacoes', element: <FederationsPage /> },
      { path: 'noticias', element: <NewsPage /> },
      { path: 'eventos', element: <EventsPage /> },
      { path: 'transparencia', element: <TransparencyPage /> },
      { path: 'galeria', element: <GalleryPage /> },
      { path: 'contato', element: <ContactPage /> },
    ],
  },
])

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>
  )
}
