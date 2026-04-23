import React, { useState } from 'react';
import { X, User, Briefcase, Loader2, FileText } from 'lucide-react';

export type PdfMode = 'cash' | 'homedepot' | 'sync';

export interface FormData {
  consultor: { nombre: string; correo: string; telefono: string; };
  cliente: { nombre: string; correo: string; telefono: string; direccion: string; };
  pdfModes: PdfMode[];
  pdfSyncTerms: ('12' | '24' | '48')[];
}

interface CotizacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: FormData) => void;
  isGenerating: boolean;
}

const emptyForm: FormData = {
  consultor: { nombre: '', correo: '', telefono: '' },
  cliente: { nombre: '', correo: '', telefono: '', direccion: '' },
  pdfModes: ['cash'],
  pdfSyncTerms: ['12'],
};

const MODE_OPTIONS: { id: PdfMode; label: string; color: string; border: string }[] = [
  { id: 'cash',      label: 'CASH',       color: 'bg-[#00AEEF]/30 text-white', border: 'border-[#00AEEF]' },
  { id: 'homedepot', label: 'HOME DEPOT', color: 'bg-orange-500/30 text-white', border: 'border-orange-500' },
  { id: 'sync',      label: 'SYNCHRONY',  color: 'bg-emerald-500/30 text-white', border: 'border-emerald-500' },
];

export default function CotizacionModal({ isOpen, onClose, onConfirm, isGenerating }: CotizacionModalProps) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<{ consultor?: string; cliente?: string; pdfModes?: string }>({});

  if (!isOpen) return null;

  const setConsultor = (key: keyof FormData['consultor'], value: string) => {
    setForm(prev => ({ ...prev, consultor: { ...prev.consultor, [key]: value } }));
    if (key === 'nombre' && value.trim()) setErrors(prev => ({ ...prev, consultor: undefined }));
  };

  const setCliente = (key: keyof FormData['cliente'], value: string) => {
    setForm(prev => ({ ...prev, cliente: { ...prev.cliente, [key]: value } }));
    if (key === 'nombre' && value.trim()) setErrors(prev => ({ ...prev, cliente: undefined }));
  };

  const toggleMode = (mode: PdfMode) => {
    setForm(prev => {
      const has = prev.pdfModes.includes(mode);
      if (has && prev.pdfModes.length === 1) return prev; // at least one required
      const next = has ? prev.pdfModes.filter(m => m !== mode) : [...prev.pdfModes, mode];
      return { ...prev, pdfModes: next };
    });
    setErrors(prev => ({ ...prev, pdfModes: undefined }));
  };

  const handleConfirm = () => {
    const newErrors: typeof errors = {};
    if (!form.consultor.nombre.trim()) newErrors.consultor = 'Nombre del consultor requerido';
    if (!form.cliente.nombre.trim()) newErrors.cliente = 'Nombre del cliente requerido';
    if (form.pdfModes.length === 0) newErrors.pdfModes = 'Selecciona al menos un modo de pago';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onConfirm(form);
  };

  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1";
  const inputClass = "bg-slate-800 border border-slate-700 focus:border-[#00AEEF] rounded-xl px-3 py-2.5 text-white text-sm w-full outline-none transition-all";

  const syncSelected = form.pdfModes.includes('sync');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto py-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-black text-lg">📋 Datos de Cotización</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Two-column form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: Consultor */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
              <Briefcase size={14} className="text-[#00AEEF]" />
              <span className="text-[11px] font-black text-[#00AEEF] uppercase tracking-widest">Consultor</span>
            </div>

            <div>
              <label className={labelClass}>Nombre *</label>
              <input
                type="text"
                value={form.consultor.nombre}
                onChange={e => setConsultor('nombre', e.target.value)}
                placeholder="Tu nombre completo"
                className={inputClass}
              />
              {errors.consultor && (
                <p className="text-red-400 text-[10px] mt-1 font-bold">{errors.consultor}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Correo</label>
              <input
                type="email"
                value={form.consultor.correo}
                onChange={e => setConsultor('correo', e.target.value)}
                placeholder="correo@windmar.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Teléfono</label>
              <input
                type="tel"
                value={form.consultor.telefono}
                onChange={e => setConsultor('telefono', e.target.value)}
                placeholder="787-000-0000"
                className={inputClass}
              />
            </div>
          </div>

          {/* RIGHT: Cliente */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
              <User size={14} className="text-[#00AEEF]" />
              <span className="text-[11px] font-black text-[#00AEEF] uppercase tracking-widest">Cliente</span>
            </div>

            <div>
              <label className={labelClass}>Nombre *</label>
              <input
                type="text"
                value={form.cliente.nombre}
                onChange={e => setCliente('nombre', e.target.value)}
                placeholder="Nombre del cliente"
                className={inputClass}
              />
              {errors.cliente && (
                <p className="text-red-400 text-[10px] mt-1 font-bold">{errors.cliente}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Correo</label>
              <input
                type="email"
                value={form.cliente.correo}
                onChange={e => setCliente('correo', e.target.value)}
                placeholder="cliente@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Teléfono</label>
              <input
                type="tel"
                value={form.cliente.telefono}
                onChange={e => setCliente('telefono', e.target.value)}
                placeholder="787-000-0000"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Dirección</label>
              <input
                type="text"
                value={form.cliente.direccion}
                onChange={e => setCliente('direccion', e.target.value)}
                placeholder="Ciudad, Puerto Rico"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* PDF Modes Section */}
        <div className="mt-6 pt-5 border-t border-slate-700 space-y-3">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-[#00AEEF]" />
            <span className="text-[11px] font-black text-[#00AEEF] uppercase tracking-widest">Modos de Pago en el PDF</span>
          </div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
            Selecciona uno o más modos — el PDF mostrará los precios de cada uno
          </p>

          <div className="flex gap-3 flex-wrap">
            {MODE_OPTIONS.map(opt => {
              const active = form.pdfModes.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleMode(opt.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    active
                      ? `${opt.color} ${opt.border}`
                      : 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span className={`w-3 h-3 rounded border-2 flex items-center justify-center flex-shrink-0 ${active ? opt.border : 'border-slate-600'}`}>
                    {active && <span className="w-1.5 h-1.5 rounded-sm bg-current" />}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>

          {errors.pdfModes && (
            <p className="text-red-400 text-[10px] font-bold">{errors.pdfModes}</p>
          )}

          {/* Sync term selector — only when SYNCHRONY is checked */}
          {syncSelected && (
            <div className="mt-2 space-y-1">
              <label className={labelClass}>Plazo Synchrony en PDF</label>
              <div className="flex gap-2">
                {(['12', '24', '48'] as const).map(term => {
                  const active = form.pdfSyncTerms.includes(term);
                  return (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setForm(prev => {
                        const has = prev.pdfSyncTerms.includes(term);
                        if (has && prev.pdfSyncTerms.length === 1) return prev;
                        const next = has
                          ? prev.pdfSyncTerms.filter(t => t !== term)
                          : [...prev.pdfSyncTerms, term];
                        return { ...prev, pdfSyncTerms: next };
                      })}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-1.5 ${
                        active
                          ? 'bg-emerald-500/30 text-white border-emerald-500'
                          : 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded border flex items-center justify-center flex-shrink-0 ${active ? 'border-emerald-400' : 'border-slate-600'}`}>
                        {active && <span className="w-1.5 h-1.5 rounded-sm bg-emerald-400" />}
                      </span>
                      {term}M {term === '12' ? '(0%)' : term === '24' ? 'Est.' : 'Mín.'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 text-slate-400 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#00AEEF] hover:bg-blue-500 text-white disabled:opacity-60 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generando...
              </>
            ) : (
              'Generar y Descargar PDF'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
