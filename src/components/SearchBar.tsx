import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { presetServices, guessDomain } from '@/data/presets';
import ServiceLogo from './ServiceLogo';
import { AnimatePresence, motion } from 'framer-motion';

interface ServiceSuggestion {
  name: string;
  domain: string;
  category: string;
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSelectService?: (service: ServiceSuggestion) => void;
}

export default function SearchBar({ value, onChange, onSelectService }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const suggestions: ServiceSuggestion[] = value.trim().length >= 1
    ? [
        ...presetServices.filter(s =>
          s.name.toLowerCase().includes(value.toLowerCase())
        ),
        // If no exact match, suggest a custom entry
        ...(presetServices.some(s => s.name.toLowerCase() === value.toLowerCase())
          ? []
          : [{ name: value, domain: guessDomain(value), category: 'other' }]
        ),
      ].slice(0, 6)
    : [];

  const showSuggestions = focused && suggestions.length > 0 && onSelectService;

  return (
    <div ref={wrapperRef} className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder="Buscar ou adicionar serviço..."
        className="w-full rounded-2xl border bg-card py-3 pl-10 pr-4 text-sm text-card-foreground shadow-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border bg-card shadow-elevated"
          >
            {suggestions.map((s, i) => (
              <button
                key={`${s.domain}-${i}`}
                type="button"
                onClick={() => {
                  onSelectService(s);
                  setFocused(false);
                  onChange('');
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary"
              >
                <ServiceLogo domain={s.domain} name={s.name} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-card-foreground">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.domain}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  + Criar
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
