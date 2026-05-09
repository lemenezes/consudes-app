import { useRef, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { uploadImage, deleteImageByUrl, validateImageFile } from '../services/storageService';
import { useAuditLog } from '../hooks/useAuditLog';

interface CoverImageUploadProps {
  /** URL atual da capa (pode ser URL manual ou do Storage) */
  value: string;
  /** Chamado com a nova URL após upload, ou '' ao remover */
  onChange: (url: string) => void;
  /** Bucket do Supabase Storage */
  bucket?: string;
  /** Pasta dentro do bucket */
  folder?: string;
}

export default function CoverImageUpload({
  value,
  onChange,
  bucket = 'cms-news',
  folder = 'covers',
}: CoverImageUploadProps) {
  const { log } = useAuditLog();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) { setError(validationError); return; }

    setError(null);
    setUploading(true);
    setProgress(20);

    // Simula progresso visual enquanto faz upload
    const ticker = setInterval(() => setProgress((p) => Math.min(p + 15, 85)), 300);

    const { url, error: uploadError } = await uploadImage(file, bucket, folder);
    clearInterval(ticker);
    setProgress(100);

    if (uploadError) {
      setError(uploadError);
      setUploading(false);
      setProgress(0);
      return;
    }

    // Remove imagem antiga do Storage (silencioso se for URL manual)
    if (value && value.includes(bucket)) {
      await deleteImageByUrl(bucket, value);
    }

    await log({ action: 'upload_image', entity_type: 'news', entity_title: file.name });

    onChange(url!);
    setUploading(false);
    setTimeout(() => setProgress(0), 600);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ''; // reset para permitir re-selecionar mesmo arquivo
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = async () => {
    if (value && value.includes(bucket)) {
      await deleteImageByUrl(bucket, value);
      await log({ action: 'delete_image', entity_type: 'news' });
    }
    onChange('');
  };

  // ── Com imagem ────────────────────────────────────────────────────────────
  if (value) {
    return (
      <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
        <img
          src={value}
          alt="Capa"
          className="w-full h-48 object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Overlay de ações */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-sm font-medium text-[#1F2937] shadow hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
            Substituir
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-sm font-medium text-white shadow hover:bg-red-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Remover
          </button>
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleInputChange} />
      </div>
    );
  }

  // ── Sem imagem — zona de upload ───────────────────────────────────────────
  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed h-44 cursor-pointer transition-colors
          ${dragging ? 'border-[#0057A8] bg-[#0057A8]/5' : 'border-gray-200 bg-[#F5F7FA] hover:border-[#0057A8]/50 hover:bg-[#0057A8]/3'}
          ${uploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        {uploading ? (
          <>
            <div className="w-8 h-8 border-4 border-[#0057A8] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Enviando…</p>
            {/* Barra de progresso */}
            <div className="absolute bottom-0 left-0 h-1 bg-[#0057A8] rounded-b-xl transition-all duration-300" style={{ width: `${progress}%` }} />
          </>
        ) : (
          <>
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-[#0057A8]">Clique ou arraste a imagem</p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG ou WebP · máx. 5 MB</p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
