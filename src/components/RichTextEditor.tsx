import { useCallback, useEffect, useRef, useState } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { ResizableImage } from './ResizableImage';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  RemoveFormatting,
  ImagePlus,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
} from 'lucide-react';
import InsertImageModal, { MAX_INLINE_IMAGES } from './InsertImageModal';
import { useAuditLog } from '../hooks/useAuditLog';

// ─── Parágrafo com suporte a variantes semânticas ──────────────────────────────
const VariantParagraph = Node.create({
  name: 'paragraph',
  priority: 1000,
  group: 'block',
  content: 'inline*',
  addAttributes() {
    return {
      textSize: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).getAttribute('data-size') || null,
        renderHTML: (attrs) => attrs.textSize ? { 'data-size': attrs.textSize } : {},
      },
    };
  },
  parseHTML() { return [{ tag: 'p' }]; },
  renderHTML({ HTMLAttributes }) {
    const size = HTMLAttributes['data-size'];
    return ['p', mergeAttributes(HTMLAttributes, size ? { class: `para-${size}` } : {}), 0];
  },
});

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
  /* imagens: controladas via ResizableImage NodeView */
  .tiptap-editor .ProseMirror p { margin: 0 0 0.9em; }
  .tiptap-editor .ProseMirror p.para-small { font-size: 0.825rem; color: #6B7280; }
  .tiptap-editor .ProseMirror p.para-lead  { font-size: 1.175rem; color: #1F2937; font-weight: 500; }
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
  .tiptap-editor .ProseMirror u { text-decoration: underline; text-underline-offset: 2px; }
  .tiptap-editor .ProseMirror blockquote {
    border-left: 3px solid #0057A8;
    padding: 0.6em 1.2em;
    margin: 1.2em 0;
    background: #F0F6FF;
    border-radius: 0 0.5rem 0.5rem 0;
    color: #374151;
    font-style: italic;
  }
  .tiptap-editor .ProseMirror blockquote p { margin: 0; }
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
  // Controla se o conteúdo inicial já foi injetado (evita loop com onUpdate)
  const initializedRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false, // substituído por VariantParagraph
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
      }),
      VariantParagraph,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ResizableImage,
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

  // ── Sincroniza conteúdo quando carregado de forma assíncrona ─────────────
  // O Tiptap só usa `content` na montagem — se os dados chegam depois (ex: fetch
  // de edição), o editor precisa ser atualizado manualmente uma única vez.
  useEffect(() => {
    if (!editor || initializedRef.current) return;
    if (!value) return;
    // Só injeta se o editor ainda estiver vazio
    const current = editor.getHTML();
    if (current === '' || current === '<p></p>') {
      // emitUpdate: false evita disparar onUpdate e causar loop
      editor.commands.setContent(value, { emitUpdate: false });
      initializedRef.current = true;
    } else {
      initializedRef.current = true;
    }
  }, [editor, value]);

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
    editor.chain().focus().insertContent({ type: 'image', attrs: { src: url } }).run();

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

          {/* Tipo de texto — dropdown semântico */}
          <select
            value={
              editor.isActive('heading', { level: 2 }) ? 'h2'
              : editor.isActive('heading', { level: 3 }) ? 'h3'
              : editor.getAttributes('paragraph').textSize === 'lead' ? 'lead'
              : editor.getAttributes('paragraph').textSize === 'small' ? 'small'
              : 'normal'
            }
            onChange={(e) => {
              const v = e.target.value;
              if (v === 'h2') {
                editor.chain().focus().setHeading({ level: 2 }).run();
              } else if (v === 'h3') {
                editor.chain().focus().setHeading({ level: 3 }).run();
              } else {
                editor.chain().focus().setParagraph().run();
                editor.commands.updateAttributes('paragraph', {
                  textSize: v === 'normal' ? null : v,
                });
              }
            }}
            className="h-7 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-md px-2 pr-6 focus:outline-none focus:ring-1 focus:ring-[#0057A8]/50 cursor-pointer appearance-auto"
          >
            <option value="normal">Texto normal</option>
            <option value="small">Pequeno</option>
            <option value="lead">Destaque</option>
            <option value="h2">Título H2</option>
            <option value="h3">Título H3</option>
          </select>

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
          <ToolbarBtn
            title="Sublinhado (Ctrl+U)"
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarBtn>

          <Divider />

          {/* Alinhamento */}
          <ToolbarBtn
            title="Alinhar à esquerda"
            active={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            title="Centralizar"
            active={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            title="Alinhar à direita"
            active={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight className="w-4 h-4" />
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

          {/* Citação */}
          <ToolbarBtn
            title="Citação / destaque"
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="w-4 h-4" />
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

          {/* Imagem inline */}
          <ToolbarBtn
            title={atLimit ? `Limite de ${MAX_INLINE_IMAGES} imagens atingido` : 'Inserir imagem no conteúdo'}
            onClick={() => !atLimit && setShowImageModal(true)}
            active={false}
          >
            <ImagePlus className={`w-4 h-4 ${atLimit ? 'opacity-30' : ''}`} />
          </ToolbarBtn>

          <Divider />

          {/* Desfazer / Refazer */}
          <ToolbarBtn
            title="Desfazer (Ctrl+Z)"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            title="Refazer (Ctrl+Shift+Z)"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 className="w-4 h-4" />
          </ToolbarBtn>

          <Divider />

          {/* Limpar formatação */}
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
        <div className="tiptap-editor max-h-[560px] overflow-y-auto overflow-x-visible">
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
