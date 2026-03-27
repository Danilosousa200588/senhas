import { getPasswordStrength } from '@/lib/passwordUtils';

export default function PasswordStrengthBar({ password }: { password: string }) {
  const { score, label, color } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i <= score - 1 ? color : 'bg-secondary'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
