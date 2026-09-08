import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, RotateCcw, PenTool, Check } from 'lucide-react';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({
  isOpen,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#6b38d4');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw light grid for math paper feel
    ctx.strokeStyle = '#e7eeff';
    ctx.lineWidth = 1;
    const step = 24;
    for (let x = 0; x < rect.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? 16 : lineWidth;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Redraw grid
    ctx.strokeStyle = '#e7eeff';
    ctx.lineWidth = 1;
    const step = 24;
    for (let x = 0; x < rect.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-2xl w-full p-5 border border-surface-container flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-display font-bold text-base text-on-surface">
                Formula Scratchpad (Papan Corat-Coret)
              </h3>
              <p className="text-xs text-on-surface-variant">
                Hitung cepat rumus diferensial, aljabar, atau eliminasi pilihan jawaban
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCanvas}
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tools Palette */}
        <div className="flex items-center justify-between gap-2 flex-wrap bg-surface-container-low p-2 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">Pena:</span>
            {[
              { label: 'Ungu', val: '#6b38d4' },
              { label: 'Teal', val: '#006c4e' },
              { label: 'Merah', val: '#ba1a1a' },
              { label: 'Hitam', val: '#111c2d' }
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => {
                  setColor(p.val);
                  setIsEraser(false);
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  !isEraser && color === p.val ? 'scale-125 border-primary shadow-sm' : 'border-transparent'
                }`}
                style={{ backgroundColor: p.val }}
                title={p.label}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEraser(!isEraser)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                isEraser
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Penghapus</span>
            </button>

            <div className="flex items-center gap-1.5 pl-2 border-l border-surface-container">
              <span className="text-[11px] text-on-surface-variant">Tebal:</span>
              <button
                type="button"
                onClick={() => setLineWidth(2)}
                className={`px-2 py-0.5 rounded text-xs ${lineWidth === 2 ? 'bg-primary-fixed text-primary font-bold' : 'text-on-surface-variant'}`}
              >
                2px
              </button>
              <button
                type="button"
                onClick={() => setLineWidth(4)}
                className={`px-2 py-0.5 rounded text-xs ${lineWidth === 4 ? 'bg-primary-fixed text-primary font-bold' : 'text-on-surface-variant'}`}
              >
                4px
              </button>
            </div>
          </div>
        </div>

        {/* Drawing Canvas Area */}
        <div className="relative w-full h-80 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-surface-container shadow-inner">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair touch-none"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1">
          <span>Corat-coret hanya tersimpan selama sesi ini. Tekan "Selesai" jika sudah selesai.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-primary text-on-primary font-semibold text-xs shadow hover:bg-primary-container"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
