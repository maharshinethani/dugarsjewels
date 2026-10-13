'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';
import { useCurrency } from '@/lib/currency-context';
import { useLocale } from '@/lib/locale-context';

export function CurrencySelector() {
  const { countries, currencies, selectedCountry, selectedCurrency, setCountry, loading } = useCurrency();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (loading || !selectedCountry || !selectedCurrency) return null;

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-800 shadow-sm transition-all duration-200 hover:border-indigo-400 hover:shadow-md active:scale-95"
        aria-label={t('currency.selectCountry')}
      >
        <span className="text-sm leading-none">{selectedCountry.flag_emoji}</span>
        <span className="font-bold text-indigo-600">{selectedCurrency.code}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180 text-indigo-600' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            /* 
              1. Button పైన పొజిషన్ అవ్వడానికి 'bottom-full mb-2'
              2. Right alignment 'right-0'
            */
            className="absolute right-0 bottom-full mb-2 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white shadow-xl z-[100]"
          >
            {/* Search Input Area */}
            <div className="p-2 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('currency.searchCountry')}
                  className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Scrollable Country List */}
            <div className="max-h-56 overflow-y-auto p-1.5 space-y-1">
              {filtered.length === 0 && (
                <p className="py-5 text-center text-xs text-slate-400">{t('currency.noResults')}</p>
              )}
              {filtered.map((country) => {
                const currency = currencies.find((c) => c.code === country.default_currency_code);
                if (!currency) return null;
                const isActive = country.code === selectedCountry.code;

                return (
                  <button
                    key={country.code}
                    onClick={() => {
                      setCountry(country.code);
                      setOpen(false);
                      setSearch('');
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-start transition-all ${
                      isActive
                        /* Active Item: Soft Indigo Background with Emerald Currency Tag */
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 shadow-sm'
                        : 'border border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-base leading-none shrink-0">{country.flag_emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`truncate text-xs ${isActive ? 'font-bold text-indigo-600' : 'font-medium text-slate-800'}`}>
                        {country.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {currency.name} · <span className={`font-semibold ${isActive ? 'text-blue-600' : 'text-slate-600'}`}>{currency.code}</span>
                      </p>
                    </div>
                    {isActive && (
                      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-white shrink-0 shadow-sm">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Border Accent Line */}
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}