import { useRef, useState } from 'react';
import { ImagePlus, Link2, Upload, X } from 'lucide-react';
import { uploadImage, validateImageFile } from '../services/storageService';

export const MAX_INLINE_IMAGES = 4;
const BUCKET = 'cms-news';
const FOLDER = 'inline';

interface Props {
  currentCount: number;
  onInsert: (url: string) => void;
  onClose: () => void;
}

type Tab = 'upload' | 'url';

export default function InsertImageModal({ currentCount, onInsert, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('upload');
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const remaining = MAX_INLINE_IMAGES - currentCount;
  const limitReached = remaining <= 0;

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).slice(0, remaining);
    if (files.length) handleFiles(files);
  };

  // ── Múltiplos arquivos ────────────────────────────────────────────────────
  const handleFiles = async (files: File[]) => {
    setUploadError('');

    if (files.length > remaining) {
      setUploadError(
        `Você selecionou ${files.length} imagens, mas esta notícia só permite mais ${remaining === 1 ? '1' : remaining}. Somente as primeiras ${remaining} serão adicionadas.`
      );
    }

    const allowed = files.slice(0, remaining);

    for (const file of allowed) {
      const err = validateImageFile(file);
      if (err) { setUploadError(err); return; }
    }

    setPreview(URL.createObjectURL(allowed[0]));
    setUploading(true);

    for (const file of allowed) {
      const { url: publicUrl, error } = await uploadImage(file, BUCKET, FOLDER);
      if (error || !publicUrl) {
        setUploadError(error ?? 'Erro ao fazer upload.');
        setUploading(false);
        setPreview(null);
        return;
      }
      onInsert(publicUrl);
    }

    setUploading(false);
    setPreview(null);
    setUploadError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  // ── URL ───────────────────────────────────────────────────────────────────
  const handleUrlInsert = () => {
    setUrlError('');
    try {
      new URL(url);
    } catch {
      setUrlError('URL inválida.');
      return;
    }
    onInsert(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]"
        onMouseDown={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ImagePlus className="w-4 h-4 text-[#0057A8]" />
            <h2 className="text-sm font-semibold text-[#1F2937]">Adicionar imagem à notícia</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#1F2937] hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Limite */}
        {limitReached ? (
          <div className="overflow-y-auto px-6 py-8 text-center">
            <ImagePlus className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-[#1F2937] mb-2">Limite de imagens atingido</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Esta notícia já tem o máximo de {MAX_INLINE_IMAGES} imagens no conteúdo.<br />
              Para adicionar uma nova, remova antes uma das imagens existentes no editor.
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto">
            {/* Contador */}
            <div className="px-6 pt-4">
              <p className={`text-xs font-semibold ${
                remaining === 1 ? 'text-amber-600' : 'text-[#0057A8]'
              }`}>
                {remaining === 1 ? 'Resta 1 imagem disponível.' : `Restam ${remaining} imagens disponíveis.`}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-3">
              <button
                onClick={() => setTab('upload')}
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tab === 'upload'
                    ? 'bg-[#0057A8]/10 text-[#0057A8]'
                    : 'text-gray-400 hover:text-[#1F2937] hover:bg-gray-50'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Fazer upload
              </button>
              <button
                onClick={() => setTab('url')}
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tab === 'url'
                    ? 'bg-[#0057A8]/10 text-[#0057A8]'
                    : 'text-gray-400 hover:text-[#1F2937] hover:bg-gray-50'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                Adicionar por link
              </button>
            </div>

            <div className="px-6 py-4">
              {tab === 'upload' ? (
                <>
                  {/* Zona de drop */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 hover:border-[#0057A8]/40 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors"
                  >
                    {preview ? (
                      <img src={preview} alt="preview" className="max-h-36 rounded-lg object-contain" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-300" />
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Arraste ou clique para escolher as imagens</p>
                          <p className="text-xs text-gray-400 mt-0.5">JPG, PNG ou WebP · máx. 5 MB por arquivo</p>
                        </div>
                      </>
                    )}
                    {uploading && (
                      <div className="flex items-center gap-2 text-xs text-[#0057A8]">
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Enviando…
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length) handleFiles(files);
                    }}
                  />
                  {uploadError && (
                    <p className="mt-2 text-xs text-red-500">{uploadError}</p>
                  )}
                </>
              ) : (
                <>
                  <label className="block text-xs font-medium text-[#1F2937] mb-1.5">Link da imagem</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setUrlError(''); }}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors"
                  />
                  {urlError && <p className="mt-1.5 text-xs text-red-500">Por favor, informe um link válido.</p>}
                  <button
                    type="button"
                    onClick={handleUrlInsert}
                    disabled={!url.trim()}
                    className="mt-3 w-full py-2.5 rounded-lg text-sm font-semibold bg-[#0057A8] text-white hover:bg-[#004a8f] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Adicionar imagem
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#0057A8] text-white hover:bg-[#004a8f] transition-colors"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
