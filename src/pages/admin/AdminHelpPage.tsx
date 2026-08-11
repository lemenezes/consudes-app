import { useLanguage } from "../../context/LanguageContext";

type HelpModule = {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const IconNews = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.7}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H8.25m0 12.75h7.5m-7.5 3h4.5M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const IconCalendar = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.7}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5m-15 12h13.5a1.5 1.5 0 001.5-1.5V6.75a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5V19.5a1.5 1.5 0 001.5 1.5z"
    />
  </svg>
);

const IconGallery = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.7}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 19.5h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
    />
  </svg>
);

const IconDocument = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.7}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H6.75A2.25 2.25 0 004.5 4.5v15A2.25 2.25 0 006.75 21.75h10.5A2.25 2.25 0 0019.5 19.5v-5.25z"
    />
  </svg>
);

const IconFederation = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.7}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21h16.5M4.5 9.75h15M5.25 21V9.75m4.5 11.25V9.75m4.5 11.25V9.75m4.5 11.25V9.75M3 9.75L12 3l9 6.75"
    />
  </svg>
);

export default function AdminHelpPage() {
  const { lang } = useLanguage();

  const content = {
    pt: {
      title: "Ajuda e Manual",
      description:
        "Encontre instruções para utilizar as principais funções do painel administrativo da CONSUDES.",
      open: "Ver manual",
      modules: {
        news: {
          title: "Notícias",
          description: "Aprenda a criar, traduzir, editar e publicar notícias."
        },
        calendar: {
          title: "Calendário",
          description: "Aprenda a cadastrar, editar e administrar eventos."
        },
        gallery: {
          title: "Galeria",
          description: "Aprenda a criar álbuns e gerenciar fotos da galeria."
        },
        transparency: {
          title: "Transparência",
          description: "Aprenda a publicar e administrar documentos."
        },
        federations: {
          title: "Federações",
          description: "Aprenda a cadastrar e atualizar as federações."
        }
      }
    },

    es: {
      title: "Ayuda y Manual",
      description:
        "Encuentre instrucciones para utilizar las principales funciones del panel administrativo de CONSUDES.",
      open: "Ver manual",
      modules: {
        news: {
          title: "Noticias",
          description: "Aprenda a crear, traducir, editar y publicar noticias."
        },
        calendar: {
          title: "Calendario",
          description: "Aprenda a registrar, editar y administrar eventos."
        },
        gallery: {
          title: "Galería",
          description:
            "Aprenda a crear álbumes y administrar las fotos de la galería."
        },
        transparency: {
          title: "Transparencia",
          description: "Aprenda a publicar y administrar documentos."
        },
        federations: {
          title: "Federaciones",
          description: "Aprenda a registrar y actualizar las federaciones."
        }
      }
    },

    en: {
      title: "Help and Manual",
      description:
        "Find instructions for using the main features of the CONSUDES administrative panel.",
      open: "View manual",
      modules: {
        news: {
          title: "News",
          description: "Learn how to create, translate, edit and publish news."
        },
        calendar: {
          title: "Calendar",
          description: "Learn how to create, edit and manage events."
        },
        gallery: {
          title: "Gallery",
          description: "Learn how to create albums and manage gallery photos."
        },
        transparency: {
          title: "Transparency",
          description: "Learn how to publish and manage documents."
        },
        federations: {
          title: "Federations",
          description: "Learn how to add and update federations."
        }
      }
    }
  };

  const text = content[lang];

  const modules: HelpModule[] = [
    {
      key: "news",
      icon: <IconNews />,
      ...text.modules.news
    },
    {
      key: "calendar",
      icon: <IconCalendar />,
      ...text.modules.calendar
    },
    {
      key: "gallery",
      icon: <IconGallery />,
      ...text.modules.gallery
    },
    {
      key: "transparency",
      icon: <IconDocument />,
      ...text.modules.transparency
    },
    {
      key: "federations",
      icon: <IconFederation />,
      ...text.modules.federations
    }
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1F2937]">{text.title}</h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          {text.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {modules.map(module => (
          <div
            key={module.key}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0057A8]">
                {module.icon}
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold text-gray-900">
                  {module.title}
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  {module.description}
                </p>

                <button
                  type="button"
                  className="mt-4 text-sm font-semibold text-[#0057A8]">
                  {text.open} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
