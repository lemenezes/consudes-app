import { useCallback, useRef, useState } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

// ─── Opções de tamanho ────────────────────────────────────────────────────────
const SIZES = [
  { label: 'P', title: 'Pequena (25%)',  pct: 25 },
  { label: 'M', title: 'Média (50%)',    pct: 50 },
  { label: 'G', title: 'Grande (75%)',   pct: 75 },
  { label: '⟷', title: 'Largura total', pct: 100 },
] as const;

type Align = 'left' | 'center' | 'right';

const ALIGNS: { value: Align; title: string; icon: typeof AlignLeft }[] = [
  { value: 'left',   title: 'Alinhar à esquerda', icon: AlignLeft },
  { value: 'center', title: 'Centralizar',         icon: AlignCenter },
  { value: 'right',  title: 'Alinhar à direita',   icon: AlignRight },
];

// margin CSS por alinhamento
function alignStyle(align: Align): string {
  if (align === 'left')   return 'margin-left: 0; margin-right: auto;';
  if (align === 'right')  return 'margin-left: auto; margin-right: 0;';
  return 'margin-left: auto; margin-right: auto;';
}

// ─── React NodeView ───────────────────────────────────────────────────────────
function ResizableImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [hovered, setHovered] = useState(false);

  const widthPct = (node.attrs.widthPct as number | null) ?? 100;
  const align    = (node.attrs.align as Align | null) ?? 'center';
  const showToolbar = hovered || selected || isResizing;

  // ── Drag resize ────────────────────────────────────────────────────────
  const startResize = useCallback(
    (e: React.MouseEvent, side: 'left' | 'right') => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const parentWidth = containerRef.current?.parentElement?.offsetWidth ?? 600;
      const startPct = widthPct;

      setIsResizing(true);

      const onMove = (ev: MouseEvent) => {
        const deltaPx = side === 'right' ? ev.clientX - startX : startX - ev.clientX;
        const deltaPct = (deltaPx / parentWidth) * 100;
        const newPct = Math.round(Math.max(10, Math.min(100, startPct + deltaPct)));
        updateAttributes({ widthPct: newPct });
      };

      const onUp = () => {
        setIsResizing(false);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [widthPct, updateAttributes],
  );

  return (
    <NodeViewWrapper style={{ display: 'block' }}>
      {/* Wrapper de alinhamento — margem controla posição horizontal */}
      <div
        className="relative my-6 group/img"
        style={{
          width: `${widthPct}%`,
          maxWidth: '100%',
          marginLeft: align === 'center' ? 'auto' : align === 'right' ? 'auto' : '0',
          marginRight: align === 'center' ? 'auto' : align === 'right' ? '0' : 'auto',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => !isResizing && setHovered(false)}
      >
        {/* ── Toolbar flutuante ── */}
        <div
          className={`absolute -top-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-0.5 px-1.5 py-1 bg-[#1F2937]/90 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-150 whitespace-nowrap ${
            showToolbar ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none'
          }`}
        >
          {/* Tamanho */}
          {SIZES.map((s) => (
            <button
              key={s.pct}
              type="button"
              title={s.title}
              onClick={() => updateAttributes({ widthPct: s.pct })}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                widthPct === s.pct
                  ? 'bg-[#0057A8] text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}

          <span className="w-px h-3 bg-white/20 mx-0.5" />

          {/* Alinhamento */}
          {ALIGNS.map(({ value, title, icon: Icon }) => (
            <button
              key={value}
              type="button"
              title={title}
              onClick={() => updateAttributes({ align: value })}
              className={`p-1 rounded transition-colors ${
                align === value
                  ? 'bg-[#0057A8] text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}

          <span className="w-px h-3 bg-white/20 mx-0.5" />
          <span className="text-[10px] text-gray-400 font-mono pr-0.5">{widthPct}%</span>
        </div>

        {/* ── Imagem — drag handle ── */}
        <div
          ref={containerRef}
          data-drag-handle
          className={`relative cursor-grab active:cursor-grabbing ${isResizing ? 'cursor-ew-resize' : ''}`}
        >
          <img
            src={node.attrs.src as string}
            alt={(node.attrs.alt as string) ?? ''}
            draggable
            className={`block w-full h-auto rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.10)] select-none transition-all ${
              selected || isResizing ? 'outline outline-[3px] outline-[#0057A8] outline-offset-[2px]' : ''
            }`}
          />

          {/* Handles de resize */}
          {showToolbar && (
            <>
              <div
                onMouseDown={(e) => { e.stopPropagation(); startResize(e, 'left'); }}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 cursor-ew-resize z-10 p-1"
                title="Arrastar para redimensionar"
              >
                <div className="w-1.5 h-10 bg-white/80 rounded-full shadow border border-gray-300/50 hover:bg-[#0057A8] hover:border-[#0057A8] transition-all" />
              </div>
              <div
                onMouseDown={(e) => { e.stopPropagation(); startResize(e, 'right'); }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-ew-resize z-10 p-1"
                title="Arrastar para redimensionar"
              >
                <div className="w-1.5 h-10 bg-white/80 rounded-full shadow border border-gray-300/50 hover:bg-[#0057A8] hover:border-[#0057A8] transition-all" />
              </div>
            </>
          )}

          {isResizing && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[11px] font-mono px-2 py-0.5 rounded-md pointer-events-none">
              {widthPct}%
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}

// ─── Extensão Tiptap ──────────────────────────────────────────────────────────
export const ResizableImage = Node.create({
  name: 'image',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src:      { default: null },
      alt:      { default: null },
      title:    { default: null },
      widthPct: {
        default: 100,
        parseHTML: (el) => {
          const img = el as HTMLImageElement;
          const dataPct = img.getAttribute('data-width-pct');
          if (dataPct) return parseInt(dataPct, 10);
          const styleMatch = img.style.width?.match(/^(\d+)%$/);
          if (styleMatch) return parseInt(styleMatch[1], 10);
          return 100;
        },
        renderHTML: (attrs) => ({
          'data-width-pct': String(attrs.widthPct ?? 100),
        }),
      },
      align: {
        default: 'center' as Align,
        parseHTML: (el) => {
          return (el as HTMLElement).getAttribute('data-align') ?? 'center';
        },
        renderHTML: (attrs) => ({
          'data-align': attrs.align ?? 'center',
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'img[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const widthPct = HTMLAttributes['data-width-pct'] ?? 100;
    const align = (HTMLAttributes['data-align'] ?? 'center') as Align;
    return [
      'img',
      mergeAttributes(HTMLAttributes, {
        draggable: 'false',
        style: [
          `width: ${widthPct}%`,
          'max-width: 100%',
          'height: auto',
          'border-radius: 0.75rem',
          'display: block',
          alignStyle(align),
        ].join('; '),
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});
