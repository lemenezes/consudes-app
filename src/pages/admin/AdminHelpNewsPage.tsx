import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export default function AdminHelpNewsPage() {
  const { lang } = useLanguage();

  const content = {
    pt: {
      back: "Voltar para Ajuda",
      title: "Manual de Notícias",
      description:
        "Aprenda a criar, traduzir, editar, publicar e excluir notícias no painel administrativo da CONSUDES.",

      sections: [
        {
          title: "1. Criar uma nova notícia",
          text: "Acesse Notícias no menu lateral e clique em Nova notícia para começar."
        },
        {
          title: "2. Escolher o idioma original",
          text: "Escolha o idioma em que a notícia será escrita originalmente: Espanhol, Português ou Inglês. Esse idioma será a fonte principal da notícia. O idioma escolhido será marcado como “original”. O símbolo * indica que aquele idioma ainda possui campos que precisam ser preenchidos."
        },
        {
          title: "3. Preencher o conteúdo",
          text: "Preencha Título, Resumo e Conteúdo Editorial no idioma original. Você também pode adicionar uma imagem de portada."
        },
        {
          title: "4. Gerar traduções",
          text: "Depois de preencher o idioma original, clique no botão de tradução. Se a notícia foi escrita em Português, por exemplo, o botão mostrará Gerar Espanhol e Inglês."
        },
        {
          title: "5. Revisar as traduções",
          text: "Após gerar as traduções, abra as abas dos outros idiomas e revise Título, Resumo e Conteúdo Editorial. As traduções podem ser editadas manualmente."
        },
        {
          title: "6. Atualizar traduções",
          text: "Se a notícia já possui traduções e o conteúdo original for alterado, use Atualizar traduções. O sistema mostrará um aviso antes de substituir as versões traduzidas existentes."
        },
        {
          title: "7. Rascunho ou publicação",
          text: "Escolha o status da notícia. Use Rascunho para continuar trabalhando sem publicar no site. Use Publicado quando a notícia estiver pronta."
        },
        {
          title: "8. Editar uma notícia existente",
          text: "Na lista de notícias, clique em Editar. Faça as alterações necessárias e salve. Se o conteúdo original mudou, lembre-se de atualizar as traduções."
        },
        {
          title: "9. Excluir uma notícia",
          text: "Na lista de notícias, use a opção de exclusão. Será necessário informar o motivo da exclusão antes de confirmar."
        }
      ],

      importantTitle: "Importante",
      importantText:
        "As traduções são geradas no painel administrativo e ficam salvas no sistema. O visitante do site não precisa esperar uma tradução acontecer ao trocar o idioma."
    },

    es: {
      back: "Volver a Ayuda",
      title: "Manual de Noticias",
      description:
        "Aprenda a crear, traducir, editar, publicar y eliminar noticias en el panel administrativo de CONSUDES.",

      sections: [
        {
          title: "1. Crear una nueva noticia",
          text: "Acceda a Noticias en el menú lateral y haga clic en Nueva noticia para comenzar."
        },
        {
          title: "2. Elegir el idioma original",
          text: "Elija el idioma en el que la noticia será escrita originalmente: Español, Portugués o Inglés. Este idioma será la fuente principal de la noticia. El idioma elegido aparecerá marcado como “original”. El símbolo * indica que ese idioma todavía tiene campos que deben completarse."
        },
        {
          title: "3. Completar el contenido",
          text: "Complete Título, Resumen y Contenido Editorial en el idioma original. También puede agregar una imagen de portada."
        },
        {
          title: "4. Generar traducciones",
          text: "Después de completar el idioma original, haga clic en el botón de traducción. Si la noticia fue escrita en Portugués, por ejemplo, el botón mostrará Generar Español e Inglés."
        },
        {
          title: "5. Revisar las traducciones",
          text: "Después de generar las traducciones, abra las pestañas de los otros idiomas y revise Título, Resumen y Contenido Editorial. Las traducciones pueden editarse manualmente."
        },
        {
          title: "6. Actualizar traducciones",
          text: "Si la noticia ya tiene traducciones y el contenido original fue modificado, use Actualizar traducciones. El sistema mostrará un aviso antes de sustituir las versiones traducidas existentes."
        },
        {
          title: "7. Borrador o publicación",
          text: "Elija el estado de la noticia. Use Borrador para continuar trabajando sin publicar en el sitio. Use Publicado cuando la noticia esté lista."
        },
        {
          title: "8. Editar una noticia existente",
          text: "En la lista de noticias, haga clic en Editar. Realice los cambios necesarios y guarde. Si cambió el contenido original, recuerde actualizar las traducciones."
        },
        {
          title: "9. Eliminar una noticia",
          text: "En la lista de noticias, use la opción de eliminación. Será necesario informar el motivo de la eliminación antes de confirmar."
        }
      ],

      importantTitle: "Importante",
      importantText:
        "Las traducciones se generan en el panel administrativo y quedan guardadas en el sistema. El visitante del sitio no necesita esperar una traducción al cambiar el idioma."
    },

    en: {
      back: "Back to Help",
      title: "News Management Guide",
      description:
        "Learn how to create, translate, edit, publish and delete news in the CONSUDES administrative panel.",

      sections: [
        {
          title: "1. Create a new news article",
          text: "Open News from the side menu and click New article to begin."
        },
        {
          title: "2. Choose the original language",
          text: "Choose the language in which the article will originally be written: Spanish, Portuguese or English. This language will be the main source for the article. The selected language will be marked as “original”. The * symbol indicates that the language still has fields that need to be completed."
        },
        {
          title: "3. Fill in the content",
          text: "Fill in Title, Summary and Editorial Content in the original language. You can also add a cover image."
        },
        {
          title: "4. Generate translations",
          text: "After completing the original language, click the translation button. If the article was written in Portuguese, for example, the button will show Generate Spanish and English."
        },
        {
          title: "5. Review translations",
          text: "After generating translations, open the other language tabs and review Title, Summary and Editorial Content. Translations can be edited manually."
        },
        {
          title: "6. Update translations",
          text: "If the article already has translations and the original content is changed, use Update translations. The system will show a warning before replacing the existing translated versions."
        },
        {
          title: "7. Draft or publish",
          text: "Choose the article status. Use Draft to keep working without publishing it on the site. Use Published when the article is ready."
        },
        {
          title: "8. Edit an existing article",
          text: "In the news list, click Edit. Make the necessary changes and save. If the original content changed, remember to update the translations."
        },
        {
          title: "9. Delete a news article",
          text: "In the news list, use the delete option. You will need to provide a reason for deletion before confirming."
        }
      ],

      importantTitle: "Important",
      importantText:
        "Translations are generated in the administrative panel and stored in the system. Visitors do not need to wait for translation when switching the site language."
    }
  };

  const text = content[lang];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <Link
        to="/admin/ajuda"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#0057A8] hover:underline">
        ← {text.back}
      </Link>

      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-semibold text-[#1F2937]">{text.title}</h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          {text.description}
        </p>
      </div>

      <div className="space-y-6">
        {/* Criar e publicar */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              {lang === "pt"
                ? "Criar e publicar uma notícia"
                : lang === "es"
                  ? "Crear y publicar una noticia"
                  : "Create and publish a news article"}
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              {lang === "pt"
                ? 'No menu lateral, acesse Notícias e clique em "Nova notícia". Depois, siga as etapas abaixo.'
                : lang === "es"
                  ? 'En el menú lateral, acceda a Noticias y haga clic en "Nueva noticia". Después, siga los pasos a continuación.'
                  : 'From the side menu, open News and click "New article". Then follow the steps below.'}
            </p>
          </div>

          <div className="space-y-5">
            {text.sections.slice(1, 7).map((section, index) => (
              <div
                key={section.title}
                className="flex gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0057A8]/10 text-sm font-semibold text-[#0057A8]">
                  {index + 1}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {section.title.replace(/^\d+\.\s*/, "")}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {section.text}
                  </p>
                  {index === 0 && (
                    <figure className="mt-4">
                      <img
                        src="/admin-help/news/choose-original-language.png"
                        alt={
                          lang === "pt"
                            ? "Seleção do idioma original de uma nova notícia"
                            : lang === "es"
                              ? "Selección del idioma original de una nueva noticia"
                              : "Selecting the original language of a new news article"
                        }
                        className="w-full rounded-xl border border-gray-200"
                      />

                      <figcaption className="mt-2 text-xs text-gray-500">
                        {lang === "pt"
                          ? "Escolha o idioma em que você escreverá o conteúdo original."
                          : lang === "es"
                            ? "Elija el idioma en el que escribirá el contenido original."
                            : "Choose the language in which you will write the original content."}
                      </figcaption>
                    </figure>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Editar */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {lang === "pt"
              ? "Editar uma notícia existente"
              : lang === "es"
                ? "Editar una noticia existente"
                : "Edit an existing news article"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {text.sections[7].text}
          </p>

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <h3 className="text-sm font-semibold text-[#0057A8]">
              {lang === "pt"
                ? "Quando usar “Atualizar traduções”?"
                : lang === "es"
                  ? "¿Cuándo usar “Actualizar traducciones”?"
                  : "When should you use “Update translations”?"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {lang === "pt"
                ? "Se você alterar Título, Resumo ou Conteúdo Editorial no idioma original, use “Atualizar traduções” para gerar novamente as versões nos outros idiomas."
                : lang === "es"
                  ? "Si modifica el Título, Resumen o Contenido Editorial en el idioma original, use “Actualizar traducciones” para generar nuevamente las versiones en los otros idiomas."
                  : "If you change the Title, Summary or Editorial Content in the original language, use “Update translations” to regenerate the other language versions."}
            </p>
          </div>
        </section>

        {/* Excluir */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {lang === "pt"
              ? "Excluir uma notícia"
              : lang === "es"
                ? "Eliminar una noticia"
                : "Delete a news article"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {text.sections[8].text}
          </p>
        </section>

        {/* Importante */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-sm font-semibold text-amber-900">
            {text.importantTitle}
          </h2>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            {lang === "pt"
              ? "As traduções não são atualizadas automaticamente quando você edita o conteúdo original. Depois de alterar o texto original, use “Atualizar traduções” ou revise cada idioma manualmente."
              : lang === "es"
                ? "Las traducciones no se actualizan automáticamente cuando edita el contenido original. Después de modificar el texto original, use “Actualizar traducciones” o revise cada idioma manualmente."
                : "Translations are not updated automatically when you edit the original content. After changing the original text, use “Update translations” or review each language manually."}
          </p>
        </div>
      </div>
    </div>
  );
}
