import { useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  RemoveFormatting,
  ImagePlus,
} from 'lucide-react';
import InsertImageModal, { MAX_INLINE_IMAGES } from './InsertImageModal';
import { useAuditLog } from '../hooks/useAuditLog';

// ─── Estilos do editor ───────────────────────────────────────────────────────
// Injetados uma vez via <style> para evitar dependência de CSS externo
const EDITOR_STYLES = `
  .tiptap-editor .ProseMirror {
    outline: none;
    min-height: 520px;
    padding: 1.25rem 1.5rem;
    font-size: 1rem;
    line-height: 1.85;
    color: #1F2937;
  }
  .tiptap-editor .ProseMirror img {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 0.75rem;
    margin: 1.5rem 0;
    display: block;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.10);
  }
  .tiptap-editor .ProseMirror img.ProseMirror-selectednode {
    outline: 3px solid #0057A8;
    outline-offset: 3px;
  }
  .tiptap-editor .ProseMirror p { margin: 0 0 0.9em; }
  .tiptap-editor .ProseMirror h2 {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 1.75em 0 0.6em;
    font-family: 'Cormorant Garamond', serif;
    color: #111827;
    border-bottom: 1px solid #F3F4F6;
    padding-bottom: 0.35em;
  }
  .tiptap-editor .ProseMirror h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 1.4em 0 0.5em;
    font-family: 'Cormorant Garamond', serif;
    color: #1F2937;
  }
  .tiptap-editor .ProseMirror ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0.5em 0 0.9em;
  }
  .tiptap-editor .ProseMirror ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin: 0.5em 0 0.9em;
  }
  .tiptap-editor .ProseMirror li { margin-bottom: 0.3em; }
  .tiptap-editor .ProseMirror a {
    color: #0057A8;
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
  }
  .tiptap-editor .ProseMirror strong { font-weight: 700; }
  .tiptap-editor .ProseMirror em { font-style: italic; }
  .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #D1D5DB;
    pointer-events: none;
    height: 0;
    font-style: italic;
  }
`;

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** newsId para audit log — opcional, omitir ao criar nova notícia */
  newsId?: string;
}

// ─── Botão da toolbar ────────────────────────────────────────────────────────
function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`
        p-1.5 rounded-md text-sm transition-all
        ${active
          ? 'bg-[#0057A8] text-white shadow-sm'
          : 'text-gray-400 hover:bg-gray-100 hover:text-[#1F2937]'
        }
      `}
    >
      {children}
    </button>
  );
}

// ─── Separador visual ────────────────────────────────────────────────────────
function Divider() {
  return <span className="w-px h-5 bg-gray-200 mx-0.5 self-center" aria-hidden />;
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function RichTextEditor({ value, onChange, placeholder, newsId }: Props) {
  const [showImageModal, setShowImageModal] = useState(false);
  const { log } = useAuditLog();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // desativar extensões desnecessárias para reduzir bundle
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'tiptap-inline-img' },
      }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      const html = editor.getHTML();
      // Normaliza documento vazio para string vazia
      onChange(html === '<p></p>' ? '' : html);
    },
    editorProps: {
      attributes: {
        'data-placeholder': placeholder ?? 'Escreva o conteúdo da notícia…',
      },
    },
  });

  // ── Link ─────────────────────────────────────────────────────────────────
  const handleLink = useCallback(() => {
    if (!editor) return;
    const current = editor.getAttributes('link').href as string | undefined;

    if (current) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const url = window.prompt('URL do link:', 'https://');
    if (!url) return;

    // Validação básica de URL
    try {
      new URL(url);
    } catch {
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const isLinkActive = editor.isActive('link');

  // Conta imagens internas no conteúdo atual
  const inlineImageCount = (editor.getHTML().match(/<img/g) ?? []).length;
  const atLimit = inlineImageCount >= MAX_INLINE_IMAGES;

  // Inserir imagem no cursor após upload/url
  const handleImageInsert = async (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();

    if (newsId) {
      await log({
        action: 'upload_image',
        entity_type: 'news',
        entity_id: newsId,
        entity_title: `Imagem inline inserida`,
      });
    }
  };

  return (
    <>
      {/* Estilos injetados uma vez */}
      <style>{EDITOR_STYLES}</style>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#0057A8]/20 focus-within:border-[#0057A8]/40 transition-all shadow-sm">

        {/* ── Toolbar ────────────────────────────────────────────────── */}
        <div className="flex items-center flex-wrap gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50/80">
          {/* Títulos */}
          <ToolbarBtn
            title="Título H2"
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            title="Título H3"
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarBtn>

          <Divider />

          {/* Formatação inline */}
          <ToolbarBtn
            title="Negrito (Ctrl+B)"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            title="Itálico (Ctrl+I)"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="w-4 h-4" />
          </ToolbarBtn>

          <Divider />

          {/* Listas */}
          <ToolbarBtn
            title="Lista com marcadores"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            title="Lista numerada"
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarBtn>

          <Divider />

          {/* Link */}
          <ToolbarBtn
            title={isLinkActive ? 'Remover link' : 'Inserir link'}
            active={isLinkActive}
            onClick={handleLink}
          >
            {isLinkActive ? (
              <Link2Off className="w-4 h-4" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}
          </ToolbarBtn>

          <Divider />

          {/* Imagem inline */}
          <ToolbarBtn
            title={atLimit ? `Limite de ${MAX_INLINE_IMAGES} imagens atingido` : 'Inserir imagem no conteúdo'}
            onClick={() => !atLimit && setShowImageModal(true)}
            active={false}
          >
            <ImagePlus className={`w-4 h-4 ${atLimit ? 'opacity-30' : ''}`} />
          </ToolbarBtn>

          <Divider />
          <ToolbarBtn
            title="Limpar formatação"
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
          >
            <RemoveFormatting className="w-4 h-4" />
          </ToolbarBtn>
        </div>

        {/* ── Área de texto ───────────────────────────────────────────── */}
        <div className="tiptap-editor max-h-[560px] overflow-y-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Modal de inserção de imagem */}
      {showImageModal && (
        <InsertImageModal
          currentCount={inlineImageCount}
          onInsert={handleImageInsert}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </>
  );
}
