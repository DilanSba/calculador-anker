import React, { useState } from 'react';
import { X, User, Briefcase, Loader2 } from 'lucide-react';

export interface FormData {
  consultor: { nombre: string; correo: string; telefono: string; };
  cliente: { nombre: string; correo: string; telefono: string; direccion: string; };
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
};

export default function CotizacionModal({ isOpen, onClose, onConfirm, isGenerating }: CotizacionModalProps) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<{ consultor?: string; cliente?: string }>({});

  if (!isOpen) return null;

  const setConsultor = (key: keyof FormData['consultor'], value: string) => {
    setForm(prev => ({ ...prev, consultor: { ...prev.consultor, [key]: value } }));
    if (key === 'nombre' && value.trim()) setErrors(prev => ({ ...prev, consultor: undefined }));
  };

  const setCliente = (key: keyof FormData['cliente'], value: string) => {
    setForm(prev => ({ ...prev, cliente: { ...prev.cliente, [key]: value } }));
    if (key === 'nombre' && value.trim()) setErrors(prev => ({ ...prev, cliente: undefined }));
  };

  const handleConfirm = () => {
    const newErrors: typeof errors = {};
    if (!form.consultor.nombre.trim()) newErrors.consultor = 'Nombre del consultor requerido';
    if (!form.cliente.nombre.trim()) newErrors.cliente = 'Nombre del cliente requerido';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onConfirm(form);
  };

  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1";
  const inputClass = "bg-slate-800 border border-slate-700 focus:border-[#00AEEF] rounded-xl px-3 py-2.5 text-white text-sm w-full outline-none transition-all";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
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
