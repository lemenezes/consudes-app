export type Lang = "es" | "pt" | "en";

export const translations = {
  es: {
    topbar: "Confederación Sudamericana Deportiva de Sordos",
    nav: {
      institutional: "Institucional",
      history: "Historia",
      mission: "Misión",
      values: "Valores",
      team: "Equipo Actual",
      formerPresidents: "Ex Presidentes",
      headquarters: "Sede",
      federations: "Federaciones",
      sports: "Deportes",
      championships: "Campeonatos",
      interclubs: "Interclubes",
      southAmericanGames: "Juegos Sudamericanos",
      rankings: "Rankings",
      calendar: "Calendario",
      news: "Noticias",
      transparency: "Transparencia",
      reports: "Informes",
      gallery: "Galería",
      contact: "Contacto",
      cta: "Contáctenos"
    },
    common: {
      contentUnderConstruction: "Contenido en construcción"
    },
    hero: {
      badge: "CONSUDES",
      fullName: "Confederación Sudamericana Deportiva de Sordos",
      headline1: "El deporte sordo",
      headline2: "une a Sudamérica",
      subtitle:
        "Desde 1985, CONSUDES representa las diez federaciones nacionales de Sudamérica y coordina la participación del continente en los Deaflympics y la PANAMDES.",
      cta1: "Conoce CONSUDES",
      cta2: "Calendario deportivo"
    },
    stats: [
      { value: "10", label: "Federaciones afiliadas" },
      { value: "1985", label: "Fundación" },
      { value: "+40 años", label: "Historia institucional" }
    ],
    about: {
      label: "Quiénes somos",
      title: "La confederación oficial del deporte sordo en Sudamérica",
      p1: "CONSUDES es el organismo rector del deporte sordo en América del Sur. Agrupa las diez federaciones nacionales del continente, organiza campeonatos continentales e interclubes, y representa a Sudamérica ante los Deaflympics y la PANAMDES.",
      p2: "Fundada en 1985 en Santiago de Chile, lleva más de cuatro décadas impulsando el deporte sordo desde Argentina hasta Venezuela, con competencias de alto nivel que preparan a los surdoatletas del continente para la escena mundial.",
      link: "Conoce nuestra actividad"
    },
    programs: {
      label: "Lo que hacemos",
      title: "Nuestra actividad deportiva",
      subtitle:
        "Lo que organiza, representa y fomenta la CONSUDES cada año en América del Sur.",
      items: [
        {
          title: "Competiciones Continentales",
          description:
            "Organización y supervisión de campeonatos y torneos interclubes que reúnen surdoatletas de toda Sudamérica."
        },
        {
          title: "Desarrollo Deportivo",
          description:
            "Fomento del deporte sordo en todos los países afiliados, impulsando el crecimiento de atletas y disciplinas a nivel continental."
        },
        {
          title: "Representación Internacional",
          description:
            "Articulación con Deaflympics y PANAMDES para garantizar la presencia sudamericana en el movimiento deportivo sordo mundial."
        },
        {
          title: "Apoyo a Federaciones",
          description:
            "Asistencia técnica e institucional a las diez federaciones nacionales afiliadas para el fortalecimiento del deporte sordo en cada país."
        }
      ]
    },
    news: {
      label: "Últimas noticias",
      title: "Noticias y eventos",
      subtitle:
        "Resultados, convocatorias y comunicados oficiales del deporte sordo sudamericano.",
      emptyState: "Aún no hay noticias publicadas.",
      viewAll: "Ver todas las noticias",
      loadError: "No se pudieron cargar las noticias. Inténtelo más tarde."
    },
    newsDetail: {
      home: "Inicio",
      heroSubtitle: "Comunicados, eventos y novedades oficiales de la CONSUDES",
      backLink: "Volver a noticias",
      separator: "Noticia",
      noContent: "Sin contenido disponible.",
      notFound: "Noticia no encontrada o no disponible.",
      readMore: "Leer más"
    },
    contact: {
      title: "Habla con CONSUDES",
      subtitle:
        "Consultas sobre afiliación, calendario de competencias, sede de torneos o representación ante los Deaflympics y la PANAMDES.",
      phoneLabel: "Teléfono",
      phoneSoon: "Próximamente"
    },
    historyPage: {
      label: "Nuestra historia",
      heroSubtitle:
        "Cuatro décadas de historia, desde la fundación en Santiago en 1985 hasta los campeonatos continentales de hoy.",
      foundingTitle: "Fundación",
      foundingDate: "23 de agosto de 1985",
      foundingText:
        "CONSUDES fue fundada en 1985 como la primera confederación continental dedicada al deporte de la comunidad sorda en Sudamérica, reuniendo las federaciones nacionales del continente bajo un único organismo rector.",
      timelineLabel: "Trayectoria institucional",
      timeline: [
        {
          year: "1985",
          title: "Fundación de CONSUDES",
          text: "La Confederación Sudamericana Deportiva de Sordos es constituida en Chile, con los países fundadores del continente, consolidando el primer organismo oficial del deporte sordo sudamericano."
        },
        {
          year: "Década de 1990",
          title: "Expansión continental",
          text: "Adhesión progresiva de nuevas federaciones nacionales, consolidando la presencia de CONSUDES en todos los países de Sudamérica."
        },
        {
          year: "Años 2000",
          title: "Integración internacional",
          text: "Filiación formal con Deaflympics y PANAMDES, integrando CONSUDES al movimiento deportivo sordo panamericano y mundial."
        },
        {
          year: "Hoy",
          title: "10 federaciones afiliadas",
          text: "Argentina, Bolivia, Brasil, Chile, Colombia, Ecuador, Paraguay, Perú, Uruguay y Venezuela componen una confederación consolidada y reconocida internacionalmente."
        }
      ],
      quoteText:
        "Cuatro décadas de campeonatos continentales demuestran que el deporte sordo sudamericano tiene identidad propia y presencia en la escena mundial.",
      countriesLabel: "Países afiliados"
    },
    missionPage: {
      label: "Identidad institucional",
      heroSubtitle:
        "El marco que define la acción de la CONSUDES ante las federaciones afiliadas y el movimiento deportivo sordo mundial.",
      missionTitle: "Misión",
      missionText:
        "La CONSUDES existe para que el deporte sordo en Sudamérica tenga organización, representación y visibilidad. Coordina campeonatos continentales, representa a las federaciones afiliadas ante los Deaflympics y la PANAMDES, y trabaja para que cada surdoatleta del continente acceda a la competencia de alto nivel.",
      visionTitle: "Visión",
      visionText:
        "Una Sudamérica donde el deporte sordo de alto rendimiento sea una realidad en los diez países afiliados, con federaciones activas, competencias regulares y delegaciones preparadas para los Deaflympics.",
      purposeTitle: "Propósito",
      purposeText:
        "Ser el vínculo entre las diez federaciones nacionales y el movimiento deportivo sordo mundial, organizando competencias, representando al continente y promoviendo el reconocimiento del deporte sordo sudamericano en el ámbito internacional."
    },
    valuesPage: {
      label: "Nuestros valores",
      heroSubtitle:
        "Los principios que orientan la gestión de la CONSUDES y sus relaciones con las federaciones afiliadas.",
      intro:
        "Los valores de la CONSUDES definen la manera en que la confederación conduce sus competencias, se relaciona con las federaciones afiliadas y representa al continente ante los organismos deportivos internacionales.",
      values: [
        {
          title: "Excelencia",
          text: "Compromiso con los más altos estándares deportivos e institucionales en cada acción que emprendemos."
        },
        {
          title: "Inclusión",
          text: "Garantizamos espacios donde cada surdoatleta, independientemente de su origen, tenga igualdad de oportunidades."
        },
        {
          title: "Integridad",
          text: "Actuamos con transparencia, honestidad y responsabilidad en todos los ámbitos de la gestión confederal."
        },
        {
          title: "Comunidad",
          text: "Fomentamos el sentido de pertenencia y la construcción colectiva de la identidad sorda sudamericana."
        },
        {
          title: "Solidaridad",
          text: "Nos apoyamos mutuamente, fortaleciendo lazos entre federaciones y promoviendo el bienestar común."
        },
        {
          title: "Innovación",
          text: "Buscamos constantemente nuevas formas de mejorar nuestra gestión, comunicación y servicios a los afiliados."
        }
      ]
    },
    interclubsPage: {
      label: "Torneo Sudamericano",
      heroSubtitle:
        "Histórico de clasificación de los torneos interclubes de la CONSUDES, desde 2005 hasta la actualidad.",
      championsTab: "Campeones",
      masculino: "Masculino",
      femenino: "Femenino",
      edition: "Edición",
      year: "Año",
      champion: "1° Lugar",
      runnerUp: "2° Lugar",
      thirdPlace: "3° Lugar",
      club: "Club",
      country: "País",
      teams: "Equipos participantes",
      noData: "Sin datos completos de clasificación.",
      pendingNote: "Espacio reservado para resultados oficiales del torneo.",
      relatorBy: "Relato",
      openPdf: "Abrir PDF",
      relato: "Relato",
      fixture: "Fixture",
      sourceNote: "Datos consolidados del sitio anterior."
    },
    footer: {
      rights: "Todos los derechos reservados",
      colInstitutional: "Institucional",
      colContent: "Contenido",
      colContact: "Contacto",
      colRecognized: "Afiliada a",
      adminArea: "Área administrativa"
    },
    admin: {
      panelTitle: "Panel Administrativo",
      nav: { dashboard: "Panel", news: "Noticias", calendar: "Calendario" },
      logout: "Salir",
      newNews: "Nueva noticia",
      editNews: "Editar noticia",
      saveChanges: "Guardar cambios",
      publish: "Publicar noticia",
      saving: "Guardando…",
      cancel: "Cancelar",
      edit: "Editar",
      deleteNews: "Eliminar noticia",
      titleLabel: "Título",
      contentLabel: "Contenido editorial",
      coverLabel: "Imagen de portada",
      statusLabel: "Estado",
      statusSection: "Publicación",
      titlePlaceholder: "Escribe el título de la noticia…",
      contentPlaceholder: "Escribe el contenido de la noticia…",
      status: {
        draft: "Borrador",
        published: "Publicada",
        archived: "Archivada"
      },
      visibility: { visible: "Visible", hidden: "Oculto" },
      noTitle: "Sin título",
      createdAt: "Creada el",
      visibleOnSite: "Visible en el sitio",
      dashboard: {
        active: "Activo",
        comingSoon: "Próximamente",
        inDevelopment: "En desarrollo",
        manage: "Gestionar noticias",
        manageCalendar: "Gestionar calendario",
        latest: "Último",
        published: "publicada",
        publishedPlural: "publicadas",
        total: "en total",
        upcomingModules: "Próximos módulos",
        upcomingDesc:
          "Galería, Informes y Federaciones están en desarrollo y estarán disponibles pronto."
      },
      calendar: {
        new: "Nuevo evento",
        edit: "Editar evento",
        delete: "Eliminar evento",
        titlePlaceholder: "Escribe el título del evento…",
        descriptionLabel: "Descripción corta",
        fullDescLabel: "Descripción completa (opcional)",
        startDateLabel: "Fecha de inicio",
        endDateLabel: "Fecha de fin (opcional)",
        datePrecisionLabel: "Precisión de fecha",
        datePrecision: {
          full: "Fechas exactas",
          month: "Solo mes/año",
          year: "Solo año"
        },
        countryLabel: "País",
        cityLabel: "Ciudad",
        venueLabel: "Sede/Local",
        locationOpenLabel: "Sede abierta a candidaturas",
        sportLabel: "Deporte/Modalidad",
        categoryLabel: "Categoría",
        categories: {
          interclubes: "Interclubes",
          sub21: "Sub-21",
          adulto: "Adulto",
          institucional: "Institucional",
          outro: "Otro"
        },
        eventTypeLabel: "Tipo de evento",
        eventTypes: {
          championship: "Campeonato",
          interclubs: "Interclubes",
          congress: "Congreso",
          assembly: "Asamblea",
          institutional: "Institucional"
        },
        eventStatusLabel: "Estado del evento",
        eventStatuses: {
          upcoming: "Próximamente",
          registrations_open: "Inscripciones abiertas",
          confirmed: "Confirmado",
          finished: "Finalizado"
        },
        federationLabel: "Federación responsable",
        linkLabel: "Enlace relacionado",
        coverLabel: "Imagen/Banner",
        featuredLabel: "Evento destacado",
        sortOrderLabel: "Orden",
        noEvents: "Ningún evento registrado.",
        filterAll: "Todos",
        clearFilters: "Limpiar filtros",
        noEventsFiltered: "Ningún evento para los filtros aplicados.",
        confirmDelete:
          "¿Eliminar este evento? Esta acción no se puede deshacer."
      },
      reports: {
        pageTitle: "Transparencia",
        newDoc: "Nuevo documento",
        emptyTitle: "Ningún documento registrado",
        emptyDesc: "Crea el primer documento usando el botón de arriba.",
        colDoc: "Documento",
        colCategory: "Categoría",
        colYear: "Año",
        colStatus: "Estado",
        statusLabels: {
          draft: "Borrador",
          published: "Publicado",
          archived: "Archivado"
        },
        tooltipView: "Ver PDF",
        tooltipPublish: "Publicar",
        tooltipUnpublish: "Despublicar",
        tooltipEdit: "Editar",
        tooltipDelete: "Eliminar",
        deleteTitle: "Eliminar documento",
        formTitleNew: "Nuevo documento",
        formTitleEdit: "Editar documento",
        sectionIdentification: "Identificación",
        sectionClassification: "Clasificación",
        sectionFile: "Archivo PDF",
        sectionPublication: "Publicación",
        labelTitle: "Título",
        labelDesc: "Descripción corta",
        labelCategory: "Categoría",
        labelYear: "Año",
        labelDocDate: "Fecha del documento",
        labelStatus: "Estado",
        labelOrder: "Orden",
        labelFeatured: "Destacado",
        placeholderTitle: "Ej: Informe Anual 2024",
        placeholderDesc: "Breve descripción del documento (opcional)",
        placeholderUrl: "https://…",
        pdfLinked: "PDF vinculado",
        pdfClickUpload: "Haz clic para seleccionar un PDF",
        pdfMaxSize: "Máximo 20 MB",
        pdfUploading: "Subiendo archivo…",
        pdfPasteUrl: "O pega la URL del archivo",
        pdfRemove: "Quitar archivo",
        validTitle: "El título es obligatorio.",
        validSlug: "El slug es obligatorio.",
        validSlugFormat:
          "El slug debe contener solo letras minúsculas, números y guiones.",
        validYear: "Año inválido.",
        btnPublish: "Publicar documento",
        btnSave: "Guardar cambios",
        btnSaving: "Guardando…",
        btnCancel: "Cancelar"
      },
      login: {
        adminArea: "Área administrativa",
        restricted: "Acceso restringido al equipo autorizado de la CONSUDES",
        email: "Correo electrónico",
        password: "Contraseña",
        signIn: "Ingresar",
        signingIn: "Ingresando…",
        internalAccess: "Uso interno CONSUDES",
        errorUnauthorized: "Acceso no autorizado para este correo.",
        errorInvalid: "Credenciales inválidas. Verifique correo y contraseña."
      }
    },
    federationsPage: {
      subtitle:
        "Federaciones afiliadas a la Confederación Sudamericana Deportiva de Sordos",
      affiliatedCount: "federaciones afiliadas",
      introHeadline: "Representando el deporte sordo sudamericano",
      viewCards: "Cards",
      viewList: "Compacto"
    },
    teamPage: {
      subtitle:
        "Directorio oficial de la Confederación Sudamericana Deportiva de Sordos",
      mandate: "Directorio Oficial 2022–2026",
      introHeadline: "Directorio 2022–2026",
      groupPresidency: "Presidencia",
      groupVicePresidency: "Vicepresidencia",
      groupBoard: "Directorio",
      groupAdvisors: "Asesoría",
      membersLabel: "integrantes",
      countriesLabel: "países representados",
      roles: {
        president: "Presidente",
        vicePresident1: "Vicepresidente 1°",
        vicePresident2: "Vicepresidenta 2°",
        treasurer: "Director Tesorero",
        legal: "Director Legal",
        institutional: "Director de Relaciones Institucionales",
        technical: "Director Técnico",
        secretary: "Directora Secretaria",
        adminAdvisor: "Asesora Administrativa",
        technicalAdvisor: "Asesor Técnico",
        itSupport: "Soporte de TI y Sistemas"
      },
      countries: {
        BR: "Brasil",
        AR: "Argentina",
        CO: "Colombia",
        PY: "Paraguay",
        UY: "Uruguay"
      }
    },
    calendarPage: {
      subtitle:
        "Campeonatos continentales, interclubes, asambleas y eventos del movimiento deportivo sordo sudamericano.",
      introHeadline: "Competencias del deporte sordo sudamericano",
      all: "Todos",
      eventsLabel: "eventos",
      filterCategory: "Categoría",
      filterStatus: "Estado",
      locationOpen: "Sede abierta · Enviar propuesta",
      noEvents: "Sin eventos",
      noEventsDesc:
        "No hay eventos que coincidan con los filtros seleccionados.",
      searchPlaceholder: "Buscar evento, país, deporte…",
      clearFilters: "Limpiar filtros",
      monthEvents: "evento",
      monthEventsPlural: "eventos",
      statuses: {
        upcoming: "Próximamente",
        registrationsOpen: "Inscripciones abiertas",
        confirmed: "Confirmado",
        finished: "Finalizado"
      }
    },
    transparencyPage: {
      heroSubtitle:
        "Estatutos, informes, actas de asamblea y documentos oficiales de la CONSUDES.",
      introLabel: "Acceso a la información",
      introDesc:
        "Documentos institucionales publicados por la CONSUDES en cumplimiento de los principios de transparencia y acceso público a la información.",
      searchPlaceholder: "Buscar documento…",
      filterAllCategories: "Todas las categorías",
      filterAllYears: "Todos los años",
      filterCategoryLabel: "Filtrar por categoría",
      filterYearLabel: "Filtrar por año",
      loadError: "Error al cargar documentos:",
      viewBtn: "Visualizar",
      downloadBtn: "Descargar",
      emptyTitle: "Ningún documento encontrado",
      emptyDesc: "Intente ajustar los filtros o consulte nuevamente más tarde.",
      pdfCloseLabel: "Cerrar visualizador",
      pdfLoading: "Cargando el documento…",
      pdfLoadingNote: "La primera apertura puede tardar algunos segundos.",
      pdfTimeout: "El documento está tardando",
      pdfTimeoutDesc:
        "El visualizador no pudo cargar a tiempo. Puede descargar el archivo directamente.",
      pdfDownload: "Descargar documento",
      comingSoon: "Próximamente",
      categories: {
        relatorio: "Informe",
        estatuto: "Estatuto",
        regulamento: "Reglamento",
        ata: "Acta",
        prestacao_contas: "Rendición de Cuentas",
        documento_oficial: "Documento Oficial"
      }
    },
    formerPresidentsPage: {
      subtitle:
        "Registro histórico de las presidencias de la CONSUDES desde su fundación en 1985",
      historyTitle: "Registro Histórico de las Gestiones",
      historySubtitle: "Presidencias de la CONSUDES desde su fundación en 1985",
      mandatesLabel: "gestiones",
      countriesLabel: "países representados",
      yearsLabel: "años de historia",
      mandate: "Presidencia",
      countries: {
        BR: "Brasil",
        AR: "Argentina",
        UY: "Uruguay",
        PY: "Paraguay",
        CL: "Chile"
      }
    },
    championshipsPage: {
      subtitle:
        "Histórico y próximas ediciones de los campeonatos sudamericanos organizados por la CONSUDES."
    },
    galleryPage: {
      subtitle:
        "Imágenes de campeonatos, interclubes, asambleas y momentos del deporte sordo sudamericano.",
      allAlbums: "Todos",
      photos: "fotos",
      viewAlbum: "Ver álbum",
      backToGallery: "Volver a la galería",
      albumNotFound: "Álbum no encontrado.",
      albumPhotosComingSoon:
        "Las fotografías de este álbum estarán disponibles próximamente.",
      featured: "Destacado",
      openPhoto: "Abrir foto",
      allYears: "Todos los años",
      allCountries: "Todos los países",
      filterCategory: "Categoría",
      filterYear: "Año",
      filterCountry: "País",
      clearFilters: "Limpiar filtros",
      albumSingular: "álbum",
      albumPlural: "álbumes",
      catInterclubes: "Interclubes",
      catJuegos: "Juegos Sudamericanos",
      catAsambleas: "Asambleas",
      catPanamdes: "PANAMDES",
      catCapacitacion: "Capacitación",
      catFutsal: "Futsal Femenino",
      catHistorico: "Histórico",
      noAlbumsFound: "Ningún álbum encontrado para los filtros seleccionados.",
      filters: "Filtros"
    },
    notFound: {
      title: "Página no encontrada",
      subtitle: "La página que buscas no existe o fue eliminada.",
      back: "Volver al inicio"
    }
  },

  pt: {
    topbar: "Confederação Sul-Americana Desportiva de Surdos",
    nav: {
      institutional: "Institucional",
      history: "História",
      mission: "Missão",
      values: "Valores",
      team: "Equipe Atual",
      formerPresidents: "Ex-Presidentes",
      headquarters: "Sede",
      federations: "Federações",
      sports: "Esportes",
      championships: "Campeonatos",
      interclubs: "Interclubes",
      southAmericanGames: "Jogos Sul-Americanos",
      rankings: "Rankings",
      calendar: "Calendário",
      news: "Notícias",
      transparency: "Transparência",
      reports: "Relatórios",
      gallery: "Galeria",
      contact: "Contato",
      cta: "Fale conosco"
    },
    common: {
      contentUnderConstruction: "Conteúdo em construção"
    },
    hero: {
      badge: "CONSUDES",
      fullName: "Confederação Sul-Americana Desportiva de Surdos",
      headline1: "O esporte surdo",
      headline2: "une a América do Sul",
      subtitle:
        "Desde 1985, a CONSUDES representa as dez federações nacionais da América do Sul e coordena a participação do continente nos Deaflympics e na PANAMDES.",
      cta1: "Conheça a CONSUDES",
      cta2: "Calendário esportivo"
    },
    stats: [
      { value: "10", label: "Federações filiadas" },
      { value: "1985", label: "Fundação" },
      { value: "+40 anos", label: "História institucional" }
    ],
    about: {
      label: "Quem somos",
      title: "A confederação oficial do esporte surdo na América do Sul",
      p1: "A CONSUDES é o organismo gestor do esporte surdo na América do Sul. Agrupa as dez federações nacionais do continente, organiza campeonatos continentais e interclubes, e representa a América do Sul nos Deaflympics e na PANAMDES.",
      p2: "Fundada em 1985 em Santiago do Chile, há mais de quatro décadas impulsiona o esporte surdo da Argentina à Venezuela, com competições de alto nível que preparam os surdoatletas do continente para o cenário mundial.",
      link: "Conheça nossa atividade"
    },
    programs: {
      label: "O que fazemos",
      title: "Nossa atividade esportiva",
      subtitle:
        "O que organiza, representa e fomenta a CONSUDES a cada ano na América do Sul.",
      items: [
        {
          title: "Competições Continentais",
          description:
            "Organização e supervisão de campeonatos e torneios interclubes que reúnem surdoatletas de toda a América do Sul."
        },
        {
          title: "Desenvolvimento Esportivo",
          description:
            "Fomento do esporte surdo em todos os países filiados, impulsionando o crescimento de atletas e modalidades no âmbito continental."
        },
        {
          title: "Representação Internacional",
          description:
            "Articulação com Deaflympics e PANAMDES para garantir a presença sul-americana no movimento esportivo surdo mundial."
        },
        {
          title: "Apoio às Federações",
          description:
            "Assistência técnica e institucional às dez federações nacionais filiadas para o fortalecimento do esporte surdo em cada país."
        }
      ]
    },
    news: {
      label: "Últimas notícias",
      title: "Notícias e eventos",
      subtitle:
        "Resultados, convocatórias e comunicados oficiais do esporte surdo sul-americano.",
      emptyState: "Nenhuma notícia publicada ainda.",
      viewAll: "Ver todas as notícias",
      loadError:
        "Não foi possível carregar as notícias. Tente novamente mais tarde."
    },
    newsDetail: {
      home: "Início",
      heroSubtitle: "Comunicados, eventos e novidades oficiais da CONSUDES",
      backLink: "Voltar para notícias",
      separator: "Notícia",
      noContent: "Sem conteúdo disponível.",
      notFound: "Notícia não encontrada ou não disponível.",
      readMore: "Leia mais"
    },
    contact: {
      title: "Fale com a CONSUDES",
      subtitle:
        "Consultas sobre filiação, calendário de competições, sede de torneios ou representação nos Deaflympics e na PANAMDES.",
      phoneLabel: "Telefone",
      phoneSoon: "Em breve"
    },
    historyPage: {
      label: "Nossa história",
      heroSubtitle:
        "Quatro décadas de história, desde a fundação em Santiago em 1985 até os campeonatos continentais de hoje.",
      foundingTitle: "Fundação",
      foundingDate: "23 de agosto de 1985",
      foundingText:
        "A CONSUDES foi fundada em 1985 como a primeira confederação continental dedicada ao esporte da comunidade surda na América do Sul, reunindo as federações nacionais do continente sob um único organismo gestor.",
      timelineLabel: "Trajetória institucional",
      timeline: [
        {
          year: "1985",
          title: "Fundação da CONSUDES",
          text: "A Confederação Sul-Americana Esportiva de Surdos é constituída no Chile, com os países fundadores do continente, consolidando o primeiro organismo oficial do esporte surdo sul-americano."
        },
        {
          year: "Década de 1990",
          title: "Expansão continental",
          text: "Adesão progressiva de novas federações nacionais, consolidando a presença da CONSUDES em todos os países da América do Sul."
        },
        {
          year: "Anos 2000",
          title: "Integração internacional",
          text: "Filiação formal com Deaflympics e PANAMDES, integrando a CONSUDES ao movimento esportivo surdo pan-americano e mundial."
        },
        {
          year: "Hoje",
          title: "10 federações filiadas",
          text: "Argentina, Bolívia, Brasil, Chile, Colômbia, Equador, Paraguai, Peru, Uruguai e Venezuela compõem uma confederação consolidada e reconhecida internacionalmente."
        }
      ],
      quoteText:
        "Quatro décadas de campeonatos continentais demonstram que o esporte surdo sul-americano tem identidade própria e presença no cenário mundial.",
      countriesLabel: "Países filiados"
    },
    missionPage: {
      label: "Identidade institucional",
      heroSubtitle:
        "O marco que define a atuação da CONSUDES perante as federações filiadas e o movimento esportivo surdo mundial.",
      missionTitle: "Missão",
      missionText:
        "A CONSUDES existe para que o esporte surdo na América do Sul tenha organização, representação e visibilidade. Coordena campeonatos continentais, representa as federações filiadas nos Deaflympics e na PANAMDES, e trabalha para que cada surdoatleta do continente acesse a competição de alto nível.",
      visionTitle: "Visão",
      visionText:
        "Uma América do Sul onde o esporte surdo de alto rendimento seja uma realidade nos dez países filiados, com federações ativas, competições regulares e delegações preparadas para os Deaflympics.",
      purposeTitle: "Propósito",
      purposeText:
        "Ser o elo entre as dez federações nacionais e o movimento esportivo surdo mundial, organizando competições, representando o continente e promovendo o reconhecimento do esporte surdo sul-americano no âmbito internacional."
    },
    valuesPage: {
      label: "Nossos valores",
      heroSubtitle:
        "Os princípios que orientam a gestão da CONSUDES e suas relações com as federações filiadas.",
      intro:
        "Os valores da CONSUDES definem a maneira como a confederação conduz suas competições, se relaciona com as federações filiadas e representa o continente perante os organismos esportivos internacionais.",
      values: [
        {
          title: "Excelência",
          text: "Compromisso com os mais altos padrões esportivos e institucionais em cada ação que empreendemos."
        },
        {
          title: "Inclusão",
          text: "Garantimos espaços onde cada surdoatleta, independentemente de sua origem, tenha igualdade de oportunidades."
        },
        {
          title: "Integridade",
          text: "Atuamos com transparência, honestidade e responsabilidade em todos os âmbitos da gestão confederal."
        },
        {
          title: "Comunidade",
          text: "Fomentamos o sentido de pertencimento e a construção coletiva da identidade surda sul-americana."
        },
        {
          title: "Solidariedade",
          text: "Apoiamo-nos mutuamente, fortalecendo laços entre federações e promovendo o bem-estar comum."
        },
        {
          title: "Inovação",
          text: "Buscamos constantemente novas formas de melhorar nossa gestão, comunicação e serviços aos filiados."
        }
      ]
    },
    interclubsPage: {
      label: "Torneio Sul-Americano",
      heroSubtitle:
        "Histórico de classificação dos torneios interclubes da CONSUDES, de 2005 até os dias atuais.",
      championsTab: "Campeões",
      masculino: "Masculino",
      femenino: "Feminino",
      edition: "Edição",
      year: "Ano",
      champion: "1° Lugar",
      runnerUp: "2° Lugar",
      thirdPlace: "3° Lugar",
      club: "Clube",
      country: "País",
      teams: "Equipes participantes",
      noData: "Dados de classificação incompletos.",
      pendingNote: "Espaço reservado para os resultados oficiais do torneio.",
      relatorBy: "Relato",
      openPdf: "Abrir PDF",
      relato: "Relato",
      fixture: "Fixture",
      sourceNote: "Dados consolidados do site anterior."
    },
    footer: {
      rights: "Todos os direitos reservados",
      colInstitutional: "Institucional",
      colContent: "Conteúdo",
      colContact: "Contato",
      colRecognized: "Filiada a",
      adminArea: "Área administrativa"
    },
    admin: {
      panelTitle: "Painel Administrativo",
      nav: { dashboard: "Dashboard", news: "Notícias", calendar: "Calendário" },
      logout: "Sair",
      newNews: "Nova notícia",
      editNews: "Editar notícia",
      saveChanges: "Salvar alterações",
      publish: "Publicar notícia",
      saving: "Salvando…",
      cancel: "Cancelar",
      edit: "Editar",
      deleteNews: "Apagar notícia",
      titleLabel: "Título",
      contentLabel: "Conteúdo editorial",
      coverLabel: "Imagem de capa",
      statusLabel: "Status",
      statusSection: "Publicação",
      titlePlaceholder: "Escreva o título da notícia…",
      contentPlaceholder: "Escreva o conteúdo da notícia…",
      status: {
        draft: "Rascunho",
        published: "Publicada",
        archived: "Arquivada"
      },
      visibility: { visible: "Visível", hidden: "Oculto" },
      noTitle: "Sem título",
      createdAt: "Criada em",
      visibleOnSite: "Visível no site",
      dashboard: {
        active: "Ativo",
        comingSoon: "Em breve",
        inDevelopment: "Em desenvolvimento",
        manage: "Gerenciar notícias",
        manageCalendar: "Gerenciar calendário",
        latest: "Último",
        published: "publicada",
        publishedPlural: "publicadas",
        total: "no total",
        upcomingModules: "Próximos módulos",
        upcomingDesc:
          "Galeria, Relatórios de Transparência e Federações estão em desenvolvimento e serão ativados em breve."
      },
      calendar: {
        new: "Novo evento",
        edit: "Editar evento",
        delete: "Apagar evento",
        titlePlaceholder: "Escreva o título do evento…",
        descriptionLabel: "Descrição curta",
        fullDescLabel: "Descrição completa (opcional)",
        startDateLabel: "Data de início",
        endDateLabel: "Data de fim (opcional)",
        datePrecisionLabel: "Precisão da data",
        datePrecision: {
          full: "Datas exatas",
          month: "Só mês/ano",
          year: "Só ano"
        },
        countryLabel: "País",
        cityLabel: "Cidade",
        venueLabel: "Sede/Local",
        locationOpenLabel: "Sede aberta a candidaturas",
        sportLabel: "Esporte/Modalidade",
        categoryLabel: "Categoria",
        categories: {
          interclubes: "Interclubes",
          sub21: "Sub-21",
          adulto: "Adulto",
          institucional: "Institucional",
          outro: "Outro"
        },
        eventTypeLabel: "Tipo de evento",
        eventTypes: {
          championship: "Campeonato",
          interclubs: "Interclubes",
          congress: "Congresso",
          assembly: "Assembleia",
          institutional: "Institucional"
        },
        eventStatusLabel: "Status do evento",
        eventStatuses: {
          upcoming: "Em breve",
          registrations_open: "Inscrições abertas",
          confirmed: "Confirmado",
          finished: "Finalizado"
        },
        federationLabel: "Federação responsável",
        linkLabel: "Link relacionado",
        coverLabel: "Imagem/Banner",
        featuredLabel: "Evento em destaque",
        sortOrderLabel: "Ordem",
        noEvents: "Nenhum evento cadastrado.",
        filterAll: "Todos",
        clearFilters: "Limpar filtros",
        noEventsFiltered: "Nenhum evento para os filtros aplicados.",
        confirmDelete: "Apagar este evento? Esta ação não pode ser desfeita."
      },
      reports: {
        pageTitle: "Transparência",
        newDoc: "Novo documento",
        emptyTitle: "Nenhum documento cadastrado",
        emptyDesc: "Crie o primeiro documento usando o botão acima.",
        colDoc: "Documento",
        colCategory: "Categoria",
        colYear: "Ano",
        colStatus: "Status",
        statusLabels: {
          draft: "Rascunho",
          published: "Publicado",
          archived: "Arquivado"
        },
        tooltipView: "Visualizar PDF",
        tooltipPublish: "Publicar",
        tooltipUnpublish: "Despublicar",
        tooltipEdit: "Editar",
        tooltipDelete: "Excluir",
        deleteTitle: "Apagar documento",
        formTitleNew: "Novo documento",
        formTitleEdit: "Editar documento",
        sectionIdentification: "Identificação",
        sectionClassification: "Classificação",
        sectionFile: "Arquivo PDF",
        sectionPublication: "Publicação",
        labelTitle: "Título",
        labelDesc: "Descrição curta",
        labelCategory: "Categoria",
        labelYear: "Ano",
        labelDocDate: "Data do documento",
        labelStatus: "Status",
        labelOrder: "Ordem",
        labelFeatured: "Destaque",
        placeholderTitle: "Ex: Relatório Anual 2024",
        placeholderDesc: "Breve descrição do documento (opcional)",
        placeholderUrl: "https://…",
        pdfLinked: "PDF vinculado",
        pdfClickUpload: "Clique para selecionar um PDF",
        pdfMaxSize: "Máximo 20 MB",
        pdfUploading: "Enviando arquivo…",
        pdfPasteUrl: "Ou cole a URL do arquivo",
        pdfRemove: "Remover arquivo",
        validTitle: "Título é obrigatório.",
        validSlug: "Slug é obrigatório.",
        validSlugFormat:
          "Slug deve conter apenas letras minúsculas, números e hífens.",
        validYear: "Ano inválido.",
        btnPublish: "Publicar documento",
        btnSave: "Salvar alterações",
        btnSaving: "Salvando…",
        btnCancel: "Cancelar"
      },
      login: {
        adminArea: "Área Administrativa",
        restricted: "Acesso restrito à equipe autorizada da CONSUDES",
        email: "E-mail",
        password: "Senha",
        signIn: "Entrar",
        signingIn: "Entrando…",
        internalAccess: "Uso interno CONSUDES",
        errorUnauthorized: "Acesso não autorizado para este e-mail.",
        errorInvalid: "Credenciais inválidas. Verifique e-mail e senha."
      }
    },
    federationsPage: {
      subtitle:
        "Federações filiadas à Confederação Sul-Americana Desportiva de Surdos",
      affiliatedCount: "federações afiliadas",
      introHeadline: "Representando o esporte surdo sul-americano",
      viewCards: "Cards",
      viewList: "Compacto"
    },
    teamPage: {
      subtitle:
        "Diretoria oficial da Confederação Sul-Americana Desportiva de Surdos",
      mandate: "Diretoria Oficial 2022–2026",
      introHeadline: "Diretoria 2022–2026",
      groupPresidency: "Presidência",
      groupVicePresidency: "Vice-presidência",
      groupBoard: "Diretoria",
      groupAdvisors: "Assessoria",
      membersLabel: "integrantes",
      countriesLabel: "países representados",
      roles: {
        president: "Presidente",
        vicePresident1: "Vice-presidente 1°",
        vicePresident2: "Vice-presidente 2°",
        treasurer: "Diretor Tesoureiro",
        legal: "Diretor Jurídico",
        institutional: "Diretor de Relações Institucionais",
        technical: "Diretor Técnico",
        secretary: "Diretora Secretária",
        adminAdvisor: "Assessora Administrativa",
        technicalAdvisor: "Assessor Técnico",
        itSupport: "Suporte de TI e Sistemas"
      },
      countries: {
        BR: "Brasil",
        AR: "Argentina",
        CO: "Colômbia",
        PY: "Paraguai",
        UY: "Uruguai"
      }
    },
    formerPresidentsPage: {
      subtitle:
        "Registro histórico das presidências da CONSUDES desde sua fundação em 1985",
      historyTitle: "Registro Histórico das Gestões",
      historySubtitle: "Presidências da CONSUDES desde sua fundação em 1985",
      mandatesLabel: "gestões",
      countriesLabel: "países representados",
      yearsLabel: "anos de história",
      mandate: "Presidência",
      countries: {
        BR: "Brasil",
        AR: "Argentina",
        UY: "Uruguai",
        PY: "Paraguai",
        CL: "Chile"
      }
    },
    notFound: {
      title: "Página não encontrada",
      subtitle: "A página que você procura não existe ou foi removida.",
      back: "Voltar ao início"
    },
    calendarPage: {
      subtitle:
        "Campeonatos continentais, interclubes, assembleias e eventos do movimento esportivo surdo sul-americano.",
      introHeadline: "Competições do esporte surdo sul-americano",
      all: "Todos",
      eventsLabel: "eventos",
      filterCategory: "Categoria",
      filterStatus: "Status",
      locationOpen: "Sede aberta · Enviar proposta",
      noEvents: "Sem eventos",
      noEventsDesc: "Nenhum evento corresponde aos filtros selecionados.",
      searchPlaceholder: "Buscar evento, país, esporte…",
      clearFilters: "Limpar filtros",
      monthEvents: "evento",
      monthEventsPlural: "eventos",
      statuses: {
        upcoming: "Em breve",
        registrationsOpen: "Inscrições abertas",
        confirmed: "Confirmado",
        finished: "Finalizado"
      }
    },
    transparencyPage: {
      heroSubtitle:
        "Estatutos, relatórios, atas de assembleia e documentos oficiais da CONSUDES.",
      introLabel: "Acesso à informação",
      introDesc:
        "Documentos institucionais disponibilizados pela CONSUDES em cumprimento aos princípios de transparência e acesso público à informação.",
      searchPlaceholder: "Buscar documento…",
      filterAllCategories: "Todas as categorias",
      filterAllYears: "Todos os anos",
      filterCategoryLabel: "Filtrar por categoria",
      filterYearLabel: "Filtrar por ano",
      loadError: "Erro ao carregar documentos:",
      viewBtn: "Visualizar",
      downloadBtn: "Baixar",
      emptyTitle: "Nenhum documento encontrado",
      emptyDesc: "Tente ajustar os filtros ou consulte novamente em breve.",
      pdfCloseLabel: "Fechar visualizador",
      pdfLoading: "A carregar o documento…",
      pdfLoadingNote: "A primeira abertura pode levar alguns segundos.",
      pdfTimeout: "O documento está a demorar",
      pdfTimeoutDesc:
        "O visualizador não conseguiu carregar a tempo. Pode baixar o arquivo diretamente.",
      pdfDownload: "Baixar documento",
      comingSoon: "Em breve",
      categories: {
        relatorio: "Relatório",
        estatuto: "Estatuto",
        regulamento: "Regulamento",
        ata: "Ata",
        prestacao_contas: "Prestação de Contas",
        documento_oficial: "Documento Oficial"
      }
    },
    championshipsPage: {
      subtitle:
        "Histórico e próximas edições dos campeonatos sul-americanos organizados pela CONSUDES."
    },
    galleryPage: {
      subtitle:
        "Imagens de campeonatos, interclubes, assembleias e momentos do esporte surdo sul-americano.",
      allAlbums: "Todos",
      photos: "fotos",
      viewAlbum: "Ver álbum",
      backToGallery: "Voltar à galeria",
      albumNotFound: "Álbum não encontrado.",
      albumPhotosComingSoon:
        "As fotografias deste álbum estarão disponíveis em breve.",
      featured: "Destaque",
      openPhoto: "Abrir foto",
      allYears: "Todos os anos",
      allCountries: "Todos os países",
      filterCategory: "Categoria",
      filterYear: "Ano",
      filterCountry: "País",
      clearFilters: "Limpar filtros",
      albumSingular: "álbum",
      albumPlural: "álbuns",
      catInterclubes: "Interclubes",
      catJuegos: "Jogos Sul-Americanos",
      catAsambleas: "Assembleias",
      catPanamdes: "PANAMDES",
      catCapacitacion: "Capacitação",
      catFutsal: "Futsal Feminino",
      catHistorico: "Histórico",
      noAlbumsFound: "Nenhum álbum encontrado para os filtros selecionados.",
      filters: "Filtros"
    }
  },

  en: {
    topbar: "South American Sports Confederation of the Deaf",
    nav: {
      institutional: "Institutional",
      history: "History",
      mission: "Mission",
      values: "Values",
      team: "Current Team",
      formerPresidents: "Former Presidents",
      headquarters: "Headquarters",
      federations: "Federations",
      sports: "Sports",
      championships: "Championships",
      interclubs: "Interclubs",
      southAmericanGames: "South American Games",
      rankings: "Rankings",
      calendar: "Calendar",
      news: "News",
      transparency: "Transparency",
      reports: "Reports",
      gallery: "Gallery",
      contact: "Contact",
      cta: "Contact us"
    },
    common: {
      contentUnderConstruction: "Content under construction"
    },
    hero: {
      badge: "CONSUDES",
      fullName: "South American Sports Confederation of the Deaf",
      headline1: "Deaf sport",
      headline2: "unites South America",
      subtitle:
        "Since 1985, CONSUDES has represented ten national federations across South America and coordinated the continent's participation in the Deaflympics and PANAMDES.",
      cta1: "Discover CONSUDES",
      cta2: "Sports calendar"
    },
    stats: [
      { value: "10", label: "Affiliated federations" },
      { value: "1985", label: "Founded" },
      { value: "+40 years", label: "Institutional history" }
    ],
    about: {
      label: "About us",
      title: "The official confederation of South American deaf sport",
      p1: "CONSUDES is the governing body for deaf sport in South America. It brings together ten national federations, organises continental championships and interclub tournaments, and represents South America at the Deaflympics and PANAMDES.",
      p2: "Founded in 1985 in Santiago, Chile, it has spent more than four decades advancing deaf sport from Argentina to Venezuela, with high-level competitions that prepare the continent's deaf athletes for the world stage.",
      link: "Discover our activities"
    },
    programs: {
      label: "What we do",
      title: "Our sporting mission",
      subtitle:
        "What CONSUDES organises, represents and promotes year after year across South America.",
      items: [
        {
          title: "Continental Competitions",
          description:
            "Organisation and oversight of championships and interclub tournaments bringing together deaf athletes from across South America."
        },
        {
          title: "Sports Development",
          description:
            "Promoting deaf sport in all affiliated countries, driving the growth of athletes and disciplines at continental level."
        },
        {
          title: "International Representation",
          description:
            "Coordination with Deaflympics and PANAMDES to ensure South American participation in the global deaf sports movement."
        },
        {
          title: "Federation Support",
          description:
            "Technical and institutional assistance to the ten affiliated national federations to strengthen deaf sport in each country."
        }
      ]
    },
    news: {
      label: "Latest news",
      title: "News and events",
      subtitle:
        "Results, competition calls and official announcements from South American deaf sport.",
      emptyState: "No news published yet.",
      viewAll: "View all news",
      loadError: "News could not be loaded. Please try again later."
    },
    newsDetail: {
      home: "Home",
      heroSubtitle: "Official announcements, events and news from CONSUDES",
      backLink: "Back to news",
      separator: "News",
      noContent: "No content available.",
      notFound: "News article not found or unavailable.",
      readMore: "Read more"
    },
    contact: {
      title: "Contact CONSUDES",
      subtitle:
        "Enquiries about membership, competition schedules, tournament hosting or representation at the Deaflympics and PANAMDES.",
      phoneLabel: "Phone",
      phoneSoon: "Coming soon"
    },
    historyPage: {
      label: "Our history",
      heroSubtitle:
        "Four decades of history, from the founding in Santiago in 1985 to today's continental championships.",
      foundingTitle: "Founding",
      foundingDate: "August 23, 1985",
      foundingText:
        "CONSUDES was founded in 1985 as the first continental confederation dedicated to deaf community sport in South America, bringing together national federations under a single governing body.",
      timelineLabel: "Institutional journey",
      timeline: [
        {
          year: "1985",
          title: "CONSUDES Founded",
          text: "The South American Deaf Sports Confederation is established in Chile with the founding member countries, consolidating the first official body of South American deaf sport."
        },
        {
          year: "1990s",
          title: "Continental expansion",
          text: "Progressive admission of new national federations, consolidating CONSUDES presence across all countries of South America."
        },
        {
          year: "2000s",
          title: "International integration",
          text: "Formal affiliation with Deaflympics and PANAMDES, integrating CONSUDES into the Pan-American and global deaf sports movement."
        },
        {
          year: "Today",
          title: "10 affiliated federations",
          text: "Argentina, Bolivia, Brazil, Chile, Colombia, Ecuador, Paraguay, Peru, Uruguay and Venezuela make up a consolidated and internationally recognised confederation."
        }
      ],
      quoteText:
        "Four decades of continental championships show that South American deaf sport has its own identity and a recognised place on the world stage.",
      countriesLabel: "Affiliated countries"
    },
    missionPage: {
      label: "Institutional identity",
      heroSubtitle:
        "The framework that defines CONSUDES action towards its affiliated federations and the global deaf sports movement.",
      missionTitle: "Mission",
      missionText:
        "CONSUDES exists so that deaf sport in South America has structure, representation and visibility. It coordinates continental championships, represents affiliated federations at the Deaflympics and PANAMDES, and works to ensure every deaf athlete on the continent has access to high-level competition.",
      visionTitle: "Vision",
      visionText:
        "A South America where high-performance deaf sport is a reality in all ten affiliated countries, with active federations, regular competitions and well-prepared delegations at the Deaflympics.",
      purposeTitle: "Purpose",
      purposeText:
        "To be the link between the ten national federations and the global deaf sports movement, organising competitions, representing the continent and promoting the recognition of South American deaf sport internationally."
    },
    valuesPage: {
      label: "Our values",
      heroSubtitle:
        "The principles that guide CONSUDES management and its relations with affiliated federations.",
      intro:
        "CONSUDES values define how the confederation runs its competitions, relates to affiliated federations and represents the continent before international sports bodies.",
      values: [
        {
          title: "Excellence",
          text: "Commitment to the highest sporting and institutional standards in every action we undertake."
        },
        {
          title: "Inclusion",
          text: "We guarantee spaces where every deaf athlete, regardless of origin, has equal opportunities."
        },
        {
          title: "Integrity",
          text: "We act with transparency, honesty and accountability in all aspects of confederation management."
        },
        {
          title: "Community",
          text: "We foster a sense of belonging and the collective construction of South American deaf identity."
        },
        {
          title: "Solidarity",
          text: "We support each other, strengthening ties between federations and promoting the common good."
        },
        {
          title: "Innovation",
          text: "We constantly seek new ways to improve our management, communication and services to affiliates."
        }
      ]
    },
    interclubsPage: {
      label: "South American Tournament",
      heroSubtitle:
        "Historical standings of CONSUDES interclub tournaments, from 2005 to the present.",
      championsTab: "Champions",
      masculino: "Men's",
      femenino: "Women's",
      edition: "Edition",
      year: "Year",
      champion: "1st Place",
      runnerUp: "2nd Place",
      thirdPlace: "3rd Place",
      club: "Club",
      country: "Country",
      teams: "Participating teams",
      noData: "No complete classification data available.",
      pendingNote: "Space reserved for official tournament results.",
      relatorBy: "Report",
      openPdf: "Open PDF",
      relato: "Report",
      fixture: "Fixture",
      sourceNote: "Data consolidated from the previous site."
    },
    footer: {
      rights: "All rights reserved",
      colInstitutional: "Institutional",
      colContent: "Content",
      colContact: "Contact",
      colRecognized: "Member of",
      adminArea: "Admin area"
    },
    admin: {
      panelTitle: "Admin Panel",
      nav: { dashboard: "Dashboard", news: "News", calendar: "Calendar" },
      logout: "Sign out",
      newNews: "New article",
      editNews: "Edit article",
      saveChanges: "Save changes",
      publish: "Publish article",
      saving: "Saving…",
      cancel: "Cancel",
      edit: "Edit",
      deleteNews: "Delete article",
      titleLabel: "Title",
      contentLabel: "Editorial content",
      coverLabel: "Cover image",
      statusLabel: "Status",
      statusSection: "Publication",
      titlePlaceholder: "Write the article title…",
      contentPlaceholder: "Write the article content…",
      status: { draft: "Draft", published: "Published", archived: "Archived" },
      visibility: { visible: "Visible", hidden: "Hidden" },
      noTitle: "Untitled",
      createdAt: "Created at",
      visibleOnSite: "Visible on site",
      dashboard: {
        active: "Active",
        comingSoon: "Coming soon",
        inDevelopment: "In development",
        manage: "Manage news",
        manageCalendar: "Manage calendar",
        latest: "Latest",
        published: "published",
        publishedPlural: "published",
        total: "total",
        upcomingModules: "Upcoming modules",
        upcomingDesc:
          "Gallery, Reports and Federations are in development and will be available soon."
      },
      login: {
        adminArea: "Administrative Area",
        restricted: "Restricted to the authorized CONSUDES team",
        email: "E-mail",
        password: "Password",
        signIn: "Sign in",
        signingIn: "Signing in…",
        internalAccess: "Internal use — CONSUDES",
        errorUnauthorized: "Access not authorized for this email.",
        errorInvalid: "Invalid credentials. Check email and password."
      },
      calendar: {
        new: "New event",
        edit: "Edit event",
        delete: "Delete event",
        titlePlaceholder: "Write the event title…",
        descriptionLabel: "Short description",
        fullDescLabel: "Full description (optional)",
        startDateLabel: "Start date",
        endDateLabel: "End date (optional)",
        datePrecisionLabel: "Date precision",
        datePrecision: {
          full: "Exact dates",
          month: "Month/year only",
          year: "Year only"
        },
        countryLabel: "Country",
        cityLabel: "City",
        venueLabel: "Venue",
        locationOpenLabel: "Open venue (accepting proposals)",
        sportLabel: "Sport/Discipline",
        categoryLabel: "Category",
        categories: {
          interclubes: "Interclubs",
          sub21: "Under-21",
          adulto: "Adult",
          institucional: "Institutional",
          outro: "Other"
        },
        eventTypeLabel: "Event type",
        eventTypes: {
          championship: "Championship",
          interclubs: "Interclubs",
          congress: "Congress",
          assembly: "Assembly",
          institutional: "Institutional"
        },
        eventStatusLabel: "Event status",
        eventStatuses: {
          upcoming: "Coming soon",
          registrations_open: "Registrations open",
          confirmed: "Confirmed",
          finished: "Finished"
        },
        federationLabel: "Responsible federation",
        linkLabel: "Related link",
        coverLabel: "Image/Banner",
        featuredLabel: "Featured event",
        sortOrderLabel: "Sort order",
        noEvents: "No events registered.",
        filterAll: "All",
        clearFilters: "Clear filters",
        noEventsFiltered: "No events match the applied filters.",
        confirmDelete: "Delete this event? This action cannot be undone."
      },
      reports: {
        pageTitle: "Transparency",
        newDoc: "New document",
        emptyTitle: "No documents registered",
        emptyDesc: "Create the first document using the button above.",
        colDoc: "Document",
        colCategory: "Category",
        colYear: "Year",
        colStatus: "Status",
        statusLabels: {
          draft: "Draft",
          published: "Published",
          archived: "Archived"
        },
        tooltipView: "View PDF",
        tooltipPublish: "Publish",
        tooltipUnpublish: "Unpublish",
        tooltipEdit: "Edit",
        tooltipDelete: "Delete",
        deleteTitle: "Delete document",
        formTitleNew: "New document",
        formTitleEdit: "Edit document",
        sectionIdentification: "Identification",
        sectionClassification: "Classification",
        sectionFile: "PDF File",
        sectionPublication: "Publication",
        labelTitle: "Title",
        labelDesc: "Short description",
        labelCategory: "Category",
        labelYear: "Year",
        labelDocDate: "Document date",
        labelStatus: "Status",
        labelOrder: "Order",
        labelFeatured: "Featured",
        placeholderTitle: "E.g.: Annual Report 2024",
        placeholderDesc: "Brief description of the document (optional)",
        placeholderUrl: "https://…",
        pdfLinked: "PDF linked",
        pdfClickUpload: "Click to select a PDF",
        pdfMaxSize: "Maximum 20 MB",
        pdfUploading: "Uploading file…",
        pdfPasteUrl: "Or paste the file URL",
        pdfRemove: "Remove file",
        validTitle: "Title is required.",
        validSlug: "Slug is required.",
        validSlugFormat:
          "Slug must contain only lowercase letters, numbers and hyphens.",
        validYear: "Invalid year.",
        btnPublish: "Publish document",
        btnSave: "Save changes",
        btnSaving: "Saving…",
        btnCancel: "Cancel"
      }
    },
    federationsPage: {
      subtitle:
        "Federations affiliated with the South American Sports Confederation of the Deaf",
      affiliatedCount: "affiliated federations",
      introHeadline: "Representing deaf sport across South America",
      viewCards: "Cards",
      viewList: "Compact"
    },
    teamPage: {
      subtitle:
        "Official board of the South American Sports Confederation of the Deaf",
      mandate: "Official Board 2022–2026",
      introHeadline: "Board 2022–2026",
      groupPresidency: "Presidency",
      groupVicePresidency: "Vice-Presidency",
      groupBoard: "Board of Directors",
      groupAdvisors: "Advisory Council",
      membersLabel: "members",
      countriesLabel: "countries represented",
      roles: {
        president: "President",
        vicePresident1: "1st Vice-President",
        vicePresident2: "2nd Vice-President",
        treasurer: "Treasurer Director",
        legal: "Legal Director",
        institutional: "Director of Institutional Relations",
        technical: "Technical Director",
        secretary: "Secretary Director",
        adminAdvisor: "Administrative Advisor",
        technicalAdvisor: "Technical Advisor",
        itSupport: "IT & Systems Support"
      },
      countries: {
        BR: "Brazil",
        AR: "Argentina",
        CO: "Colombia",
        PY: "Paraguay",
        UY: "Uruguay"
      }
    },
    formerPresidentsPage: {
      subtitle:
        "Historical record of CONSUDES presidencies since its foundation in 1985",
      historyTitle: "Historical Record of Terms",
      historySubtitle: "CONSUDES Presidencies since its foundation in 1985",
      mandatesLabel: "terms",
      countriesLabel: "countries represented",
      yearsLabel: "years of history",
      mandate: "Presidency",
      countries: {
        BR: "Brazil",
        AR: "Argentina",
        UY: "Uruguay",
        PY: "Paraguay",
        CL: "Chile"
      }
    },
    notFound: {
      title: "Page not found",
      subtitle:
        "The page you are looking for does not exist or has been removed.",
      back: "Back to home"
    },
    calendarPage: {
      subtitle:
        "Continental championships, interclubs, assemblies and events of the South American deaf sports movement.",
      introHeadline: "Competitions of South American deaf sport",
      all: "All",
      eventsLabel: "events",
      filterCategory: "Category",
      filterStatus: "Status",
      locationOpen: "Open venue · Send proposal",
      noEvents: "No events",
      noEventsDesc: "No events match the selected filters.",
      searchPlaceholder: "Search event, country, sport…",
      clearFilters: "Clear filters",
      monthEvents: "event",
      monthEventsPlural: "events",
      statuses: {
        upcoming: "Coming soon",
        registrationsOpen: "Registrations open",
        confirmed: "Confirmed",
        finished: "Finished"
      }
    },
    transparencyPage: {
      heroSubtitle:
        "Statutes, reports, assembly minutes and official documents of CONSUDES.",
      introLabel: "Access to information",
      introDesc:
        "Institutional documents published by CONSUDES in accordance with the principles of transparency and public access to information.",
      searchPlaceholder: "Search document…",
      filterAllCategories: "All categories",
      filterAllYears: "All years",
      filterCategoryLabel: "Filter by category",
      filterYearLabel: "Filter by year",
      loadError: "Error loading documents:",
      viewBtn: "View",
      downloadBtn: "Download",
      emptyTitle: "No documents found",
      emptyDesc: "Try adjusting the filters or check back later.",
      pdfCloseLabel: "Close viewer",
      pdfLoading: "Loading document…",
      pdfLoadingNote: "The first load may take a few seconds.",
      pdfTimeout: "The document is taking too long",
      pdfTimeoutDesc:
        "The viewer could not load in time. You can download the file directly.",
      pdfDownload: "Download document",
      comingSoon: "Coming soon",
      categories: {
        relatorio: "Report",
        estatuto: "Statute",
        regulamento: "Regulation",
        ata: "Minutes",
        prestacao_contas: "Financial Report",
        documento_oficial: "Official Document"
      }
    },
    championshipsPage: {
      subtitle:
        "Past and upcoming editions of the South American championships organised by CONSUDES."
    },
    galleryPage: {
      subtitle:
        "Images from championships, interclubs, assemblies and moments of South American deaf sport.",
      allAlbums: "All",
      photos: "photos",
      viewAlbum: "View album",
      backToGallery: "Back to gallery",
      albumNotFound: "Album not found.",
      albumPhotosComingSoon: "Photos for this album will be available soon.",
      featured: "Featured",
      openPhoto: "Open photo",
      allYears: "All years",
      allCountries: "All countries",
      filterCategory: "Category",
      filterYear: "Year",
      filterCountry: "Country",
      clearFilters: "Clear filters",
      albumSingular: "album",
      albumPlural: "albums",
      catInterclubes: "Interclubs",
      catJuegos: "South American Games",
      catAsambleas: "Assemblies",
      catPanamdes: "PANAMDES",
      catCapacitacion: "Training",
      catFutsal: "Women's Futsal",
      catHistorico: "Historical",
      noAlbumsFound: "No albums found for the selected filters.",
      filters: "Filters"
    }
  }
} satisfies Record<Lang, unknown>;

export type Translations = (typeof translations)["es"];
