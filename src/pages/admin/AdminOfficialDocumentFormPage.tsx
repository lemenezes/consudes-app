import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Globe2, Languages, Mail } from "lucide-react";
import RichTextEditor from "../../components/RichTextEditor";
import { useLanguage } from "../../context/LanguageContext";
import type { Lang } from "../../i18n/translations";

const LANGUAGES: Lang[] = ["pt", "es", "en"];

const EMPTY_TRANSLATION = {
  subject: "",
  body: ""
};

const EMPTY_TRANSLATIONS: Record<Lang, typeof EMPTY_TRANSLATION> = {
  pt: { ...EMPTY_TRANSLATION },
  es: { ...EMPTY_TRANSLATION },
  en: { ...EMPTY_TRANSLATION }
};

const sectionClassName =
  "space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6";
const sectionTitleClassName =
  "font-serif text-xl font-semibold text-[#172033]";
const textareaClassName =
  "min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0067B9] focus:ring-2 focus:ring-[#0067B9]/15";

const LANGUAGE_LABELS: Record<Lang, "pt" | "es" | "en"> = {
  pt: "pt",
  es: "es",
  en: "en"
};

export default function AdminOfficialDocumentFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const copy = t.admin.officialDocuments;
  const [number, setNumber] = useState("");
  const [date, setDate] = useState("");
  const [originalLanguage, setOriginalLanguage] = useState<Lang>("pt");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [translations, setTranslations] = useState(EMPTY_TRANSLATIONS);
  const [publishOnSite, setPublishOnSite] = useState(false);
  const [destinationSection, setDestinationSection] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailCc, setEmailCc] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [attachPdf, setAttachPdf] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-8">
      <header>
        <h1 className="font-serif text-3xl text-[#172033]">
          {isEditing ? copy.editDocument : copy.newDocument}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className={sectionClassName}>
          <h2 className={sectionTitleClassName}>{copy.documentDetails}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={copy.documentNumber} htmlFor="document-number">
              <input
                id="document-number"
                value={number}
                onChange={event => setNumber(event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field label={copy.date} htmlFor="document-date">
              <input
                id="document-date"
                type="date"
                value={date}
                onChange={event => setDate(event.target.value)}
                className={inputClassName}
              />
            </Field>
          </div>

          <Field label={copy.originalLanguage} htmlFor="original-language">
            <select
              id="original-language"
              value={originalLanguage}
              onChange={event =>
                setOriginalLanguage(event.target.value as Lang)
              }
              className={inputClassName}>
              <option value="pt">{copy.languages.pt}</option>
              <option value="es">{copy.languages.es}</option>
              <option value="en">{copy.languages.en}</option>
            </select>
          </Field>

          <Field label={copy.recipient} htmlFor="document-recipient">
            <input
              id="document-recipient"
              value={recipient}
              onChange={event => setRecipient(event.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label={copy.subject} htmlFor="document-subject">
            <input
              id="document-subject"
              value={subject}
              onChange={event => setSubject(event.target.value)}
              className={inputClassName}
            />
          </Field>
        </section>

        <section className={sectionClassName}>
          <h2 className={sectionTitleClassName}>{copy.content}</h2>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <label className="block border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              {copy.body}
            </label>
            <RichTextEditor
              value={body}
              onChange={setBody}
              labels={copy.editor}
              allowInlineImages={false}
            />
          </div>
        </section>

        <section className={sectionClassName}>
          <div className="flex items-center gap-3">
            <Languages size={20} className="text-[#0067B9]" />
            <div>
              <h2 className={sectionTitleClassName}>{copy.translations}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {copy.translationsHelp}
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {LANGUAGES.map(language => (
              <div
                key={language}
                className="space-y-4 rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {copy.languages[LANGUAGE_LABELS[language]]}
                  </h3>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                    {copy.translationPending}
                  </span>
                </div>
                <Field
                  label={copy.subject}
                  htmlFor={`translation-subject-${language}`}>
                  <input
                    id={`translation-subject-${language}`}
                    value={translations[language].subject}
                    onChange={event =>
                      setTranslations(current => ({
                        ...current,
                        [language]: {
                          ...current[language],
                          subject: event.target.value
                        }
                      }))
                    }
                    className={inputClassName}
                  />
                </Field>
                <Field
                  label={copy.body}
                  htmlFor={`translation-body-${language}`}>
                  <textarea
                    id={`translation-body-${language}`}
                    value={translations[language].body}
                    onChange={event =>
                      setTranslations(current => ({
                        ...current,
                        [language]: {
                          ...current[language],
                          body: event.target.value
                        }
                      }))
                    }
                    className={textareaClassName}
                  />
                </Field>
              </div>
            ))}
          </div>
          <div>
            <button
              type="button"
              disabled
              className="rounded-lg bg-[#0067B9] px-4 py-2.5 text-sm font-semibold text-white opacity-50 disabled:cursor-not-allowed">
              {copy.generateTranslations}
            </button>
            <span className="ml-3 text-sm text-slate-500">
              {copy.comingSoon}
            </span>
          </div>
        </section>

        <section className={sectionClassName}>
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-[#0067B9]" />
            <h2 className={sectionTitleClassName}>{copy.pdf}</h2>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">{copy.pdfHelp}</p>
            <button
              type="button"
              disabled
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-400 disabled:cursor-not-allowed">
              {copy.preparePdf}
            </button>
          </div>
        </section>

        <section className={sectionClassName}>
          <div className="flex items-center gap-3">
            <Globe2 size={20} className="text-[#0067B9]" />
            <h2 className={sectionTitleClassName}>{copy.publication}</h2>
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={publishOnSite}
              onChange={event => setPublishOnSite(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-[#0067B9]"
            />
            {copy.publishOnSite}
          </label>
          <Field label={copy.destinationSection} htmlFor="destination-section">
            <select
              id="destination-section"
              value={destinationSection}
              onChange={event => setDestinationSection(event.target.value)}
              className={inputClassName}>
              <option value="">{copy.selectSection}</option>
              <option value="news">{copy.sections.news}</option>
              <option value="transparency">
                {copy.sections.transparency}
              </option>
              <option value="calendar">{copy.sections.calendar}</option>
            </select>
          </Field>
        </section>

        <section className={sectionClassName}>
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-[#0067B9]" />
            <h2 className={sectionTitleClassName}>{copy.email}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={copy.emailTo} htmlFor="email-to">
              <input
                id="email-to"
                type="email"
                value={emailTo}
                onChange={event => setEmailTo(event.target.value)}
                className={inputClassName}
              />
            </Field>
            <Field label={copy.emailCc} htmlFor="email-cc">
              <input
                id="email-cc"
                type="text"
                value={emailCc}
                onChange={event => setEmailCc(event.target.value)}
                className={inputClassName}
              />
            </Field>
          </div>
          <Field label={copy.emailSubject} htmlFor="email-subject">
            <input
              id="email-subject"
              value={emailSubject}
              onChange={event => setEmailSubject(event.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label={copy.emailMessage} htmlFor="email-message">
            <textarea
              id="email-message"
              value={emailMessage}
              onChange={event => setEmailMessage(event.target.value)}
              className={textareaClassName}
            />
          </Field>
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={attachPdf}
              onChange={event => setAttachPdf(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-[#0067B9]"
            />
            {copy.attachPdf}
          </label>
          <p className="text-sm text-slate-500">{copy.comingSoon}</p>
        </section>

        <footer className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/oficios")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            {copy.cancel}
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#0067B9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00589F]">
            {copy.saveDraft}
          </button>
        </footer>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClassName =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0067B9] focus:ring-2 focus:ring-[#0067B9]/15";
