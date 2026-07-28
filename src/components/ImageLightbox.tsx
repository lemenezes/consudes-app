import { useEffect, useRef, useState } from "react";
import { X, Plus, Minus, RotateCcw } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const MIN_ZOOM = 50;
const MAX_ZOOM = 300;
const ZOOM_STEP = 25;

/**
 * Lightbox com controles de zoom avançados.
 * Inclui:
 * - Zoom (+, −, reset)
 * - Arrastar quando zoom > 100%
 * - Zoom com roda do mouse
 * - Pinch-to-zoom no mobile
 * - Controles na parte inferior
 */
export default function ImageLightbox({
  src,
  alt,
  onClose
}: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const [zoom, setZoom] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);

  // Reset ao desmontar
  useEffect(() => {
    return () => {
      setZoom(100);
      setPosition({ x: 0, y: 0 });
    };
  }, []);

  // Fechar com Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Bloquear scroll do body
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  const handleZoom = (newZoom: number) => {
    const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    setZoom(clampedZoom);
    // Reset posição ao mudar zoom
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    handleZoom(zoom + ZOOM_STEP);
  };

  const handleZoomOut = () => {
    handleZoom(zoom - ZOOM_STEP);
  };

  const handleReset = () => {
    setZoom(100);
    setPosition({ x: 0, y: 0 });
  };

  // Zoom com roda do mouse
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (zoom <= 100 && e.deltaY > 0) return; // Não fazer scroll se zoom <= 100%
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    handleZoom(zoom + delta);
  };

  // Mousedown para iniciar drag
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom <= 100) return;
    if (e.target !== imageContainerRef.current && e.target !== imageRef.current)
      return;

    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    setIsDragging(true);
  };

  // Mousemove para dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;

    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;

    // Limitar movimento para não sair muito do viewport
    const maxMove = (imageContainerRef.current?.offsetWidth || 0) * 0.3;
    setPosition({
      x: Math.max(-maxMove, Math.min(maxMove, newX)),
      y: Math.max(-maxMove, Math.min(maxMove, newY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Touch events para pinch-to-zoom (mobile)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && initialDistance) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = distance / initialDistance;
      const newZoom = zoom * scale;
      handleZoom(newZoom);
      setInitialDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setInitialDistance(null);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Fechar apenas se clicar no overlay, não na imagem nem nos controles
    if (
      e.target === dialogRef.current &&
      !(e.target as HTMLElement).closest("button")
    ) {
      onClose();
    }
  };

  const canZoomIn = zoom < MAX_ZOOM;
  const canZoomOut = zoom > MIN_ZOOM;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} - lightbox com zoom`}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleOverlayClick}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      {/* Botão X */}
      <button
        onClick={onClose}
        aria-label="Fechar lightbox"
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors z-10"
        title="Fechar (Esc)">
        <X className="w-6 h-6" />
      </button>

      {/* Container da imagem */}
      <div
        ref={imageContainerRef}
        className="flex-1 w-full h-full flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        style={{
          cursor: zoom > 100 ? (isDragging ? "grabbing" : "grab") : "default"
        }}>
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="max-w-[90vw] max-h-[80vh] object-contain select-none transition-transform"
          style={{
            transform: `scale(${zoom / 100}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: "center",
            userSelect: "none"
          }}
        />
      </div>

      {/* Controles na parte inferior */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-3 rounded-full border border-white/10">
        {/* Botão de reduzir */}
        <button
          onClick={handleZoomOut}
          disabled={!canZoomOut}
          aria-label="Reduzir zoom"
          title="Reduzir zoom (−)"
          className="p-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 text-white rounded-lg transition-colors disabled:cursor-not-allowed">
          <Minus className="w-5 h-5" />
        </button>

        {/* Indicador de zoom */}
        <div className="px-4 py-2 text-white text-sm font-semibold min-w-[60px] text-center">
          {zoom}%
        </div>

        {/* Botão de ampliar */}
        <button
          onClick={handleZoomIn}
          disabled={!canZoomIn}
          aria-label="Ampliar zoom"
          title="Ampliar zoom (+)"
          className="p-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 text-white rounded-lg transition-colors disabled:cursor-not-allowed">
          <Plus className="w-5 h-5" />
        </button>

        {/* Botão de reset */}
        <button
          onClick={handleReset}
          disabled={zoom === 100}
          aria-label="Resetar zoom para 100%"
          title="Resetar zoom (100%)"
          className="p-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 text-white rounded-lg transition-colors disabled:cursor-not-allowed">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
