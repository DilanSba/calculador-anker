import React from 'react';
import { Plus } from 'lucide-react';
import type { Product } from '../constants';

interface ProductCardProps {
  product: Product;
  onAdd: (id: string) => void;
}

const categoryClass = (cat: string) => {
  switch (cat) {
    case 'Anker Battery':      return 'bg-anker-blue/10 text-anker-blue dark:bg-anker-blue/20';
    case 'Expansion':          return 'bg-windmar-blue/10 text-windmar-blue dark:bg-windmar-blue/20 dark:text-windmar-blue-light';
    case 'Solar Panels':       return 'bg-windmar-gold/10 text-windmar-gold';
    case 'Transfer Switches':  return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
    case 'Coolers':            return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300';
    case 'Accessories':        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    default:                   return 'bg-slate-50 text-slate-700';
  }
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <button
      type="button"
      onClick={() => onAdd(product.id)}
      className="group w-full text-left bg-white dark:bg-[#161b22] border border-windmar-blue-light/30 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col
        hover:shadow-lg hover:scale-[1.02] hover:border-anker-blue/40"
    >
      {/* Top: categoría */}
      <div className="p-3 pb-0 flex items-center justify-start">
        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${categoryClass(product.category)}`}>
          {product.category}
        </span>
      </div>

      {/* Imagen — pill blanco en dark mode para camuflar fondos blancos */}
      <div className="h-28 sm:h-36 flex items-center justify-center p-3">
        <div className="w-full h-full flex items-center justify-center rounded-xl bg-transparent dark:bg-white/95 dark:p-2">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-bold text-lg">A</div>
          )}
        </div>
      </div>

      {/* Footer: nombre + botón agregar */}
      <div className="p-3 pt-1 flex items-center justify-between gap-2 border-t border-windmar-blue-light/20 dark:border-white/5">
        <h3 className="text-[12px] sm:text-[13px] font-bold text-slate-900 dark:text-[#e8eaed] leading-tight">
          {product.name}
        </h3>

        <span className="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center bg-anker-blue text-white shadow-md shadow-anker-blue/25 transition-transform group-hover:scale-105">
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </span>
      </div>
    </button>
  );
};
