import { motion } from 'framer-motion';
import { categories } from '@/data/presets';
import { usePasswords } from '@/context/PasswordContext';
import { Category } from '@/types/password';

interface CategoryGridProps {
  onSelect: (category: Category) => void;
}

export default function CategoryGrid({ onSelect }: CategoryGridProps) {
  const { entries, getByCategory } = usePasswords();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {categories.map((cat, i) => {
        const count = getByCategory(cat.id).length;
        return (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(cat.id)}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.color} p-4 text-left shadow-card transition-all hover:shadow-elevated hover:scale-[1.02]`}
          >
            <span className="text-3xl">{cat.icon}</span>
            <h3 className="mt-2 font-display text-sm font-bold text-white">{cat.label}</h3>
            <p className="text-xs text-white/70">{count} {count === 1 ? 'senha' : 'senhas'}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
