import React from 'react';
import { Battery, CreditCard, Wrench } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <>
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-white/[0.08]">
        <div className="flex gap-4">
          <div className="bg-anker-blue/10 p-3 rounded-xl h-fit">
            <Battery className="text-anker-blue" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-[#e8eaed] text-sm mb-1">
              Tecnología Anker Solix
            </h4>
            <p className="text-slate-600 dark:text-[#a0a4ad] text-xs leading-relaxed">
              Power Stations LiFePO4 con hasta 6,000 ciclos de carga y garantía de fábrica.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-windmar-blue/10 p-3 rounded-xl h-fit">
            <CreditCard className="text-windmar-blue" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-[#e8eaed] text-sm mb-1">
              Financiamiento Flexible
            </h4>
            <p className="text-slate-600 dark:text-[#a0a4ad] text-xs leading-relaxed">
              Cash, Home Depot Credit y Synchrony 12 / 24 / 48 meses. Sujeto a aprobación de crédito.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-windmar-gold/10 p-3 rounded-xl h-fit">
            <Wrench className="text-windmar-gold" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-[#e8eaed] text-sm mb-1">
              Soporte Local Windmar
            </h4>
            <p className="text-slate-600 dark:text-[#a0a4ad] text-xs leading-relaxed">
              Instalación y soporte técnico en Puerto Rico · ventas@windmarhome.com · (787) 395-7766.
            </p>
          </div>
        </div>
      </footer>

      <div className="text-center pt-8 pb-4">
        <p className="text-[10px] font-black text-slate-400 dark:text-[#6b7280] uppercase tracking-[0.3em]">
          © 2026 Windmar Home × Anker · Todos los derechos reservados
        </p>
      </div>
    </>
  );
};
