import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose, issue = null, isKiosk = false }) {
  if (!isOpen) return null;

  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const baseUrl = window.location.origin;
  const targetUrl = isKiosk
    ? `${baseUrl}?report=quick&ward=Ward151`
    : `${baseUrl}?issue=${issue?.id || 'ISS-1001'}`;

  const title = isKiosk
    ? 'Ward Quick-Report Kiosk QR Poster'
    : `Quick QR for ${issue?.id || 'Civic Ticket'}`;

  const subtitle = isKiosk
    ? 'Citizens can scan this QR poster in bus stops, colleges, and parks to instantly file reports.'
    : `Citizens can scan to view live progress, inspect photos, and endorse this report.`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        targetUrl,
        {
          width: 220,
          margin: 2,
          color: {
            dark: '#070d19',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error('QR Code error:', error);
        }
      );
    }
  }, [targetUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `fixlocal-qr-${isKiosk ? 'kiosk' : issue?.id || 'ticket'}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0c1427] rounded-3xl shadow-[0_0_40px_rgba(0,240,255,0.25)] border border-cyan-500/40 text-center p-6 space-y-4 animate-in fade-in zoom-in duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <QrCode className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-black text-white leading-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {subtitle}
          </p>
        </div>

        {/* QR Code Canvas */}
        <div className="p-4 bg-white rounded-2xl inline-block shadow-[0_0_25px_rgba(0,240,255,0.2)] mx-auto">
          <canvas ref={canvasRef} className="rounded-xl mx-auto" />
          <div className="mt-2 text-[10px] font-mono font-bold text-slate-900 flex items-center justify-center space-x-1">
            <Sparkles className="w-3 h-3 text-cyan-600" />
            <span>FixLocal Fast-Track Scan</span>
          </div>
        </div>

        {/* Target URL */}
        <div className="flex items-center space-x-1.5 p-2 bg-[#070d19] rounded-xl border border-slate-700 text-xs text-left">
          <span className="font-mono text-cyan-400 truncate flex-1 pl-2 text-[11px]">
            {targetUrl}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white border border-slate-700 flex items-center space-x-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-bold">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Actions */}
        <div className="pt-2">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res PNG Poster</span>
          </button>
        </div>

      </div>
    </div>
  );
}
