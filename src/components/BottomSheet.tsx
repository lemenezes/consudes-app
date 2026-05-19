import React, { useEffect, useRef } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function BottomSheet({ open, onClose, children, className = '', ariaLabel }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Fechar ao pressionar ESC
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Foco inicial no painel
  useEffect(() => {
    if (open && sheetRef.current) {
      sheetRef.current.focus();
    }
  }, [open]);

  // Fechar ao clicar fora
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-end justify-center transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
      style={{ background: open ? 'rgba(30,32,38,0.32)' : 'transparent', transition: 'background 0.2s' }}
      onClick={handleBackdrop}
    >
      <div
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={`w-full max-w-md mx-auto bg-[#F8F9FB] dark:bg-consudes-dark-body rounded-t-2xl shadow-2xl border-t border-slate-200 dark:border-white/10 p-4 pb-6 outline-none transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'} ${className}`}
        style={{ minHeight: 80, boxShadow: '0 -8px 32px rgba(0,0,0,0.10)' }}
      >
        <div className="w-10 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-3" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
