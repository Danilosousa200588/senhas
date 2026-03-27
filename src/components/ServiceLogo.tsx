import { useState } from 'react';
import { Shield } from 'lucide-react';
import { getLogoUrl } from '@/data/presets';

interface ServiceLogoProps {
  domain: string;
  name: string;
  size?: number;
}

export default function ServiceLogo({ domain, name, size = 40 }: ServiceLogoProps) {
  const [error, setError] = useState(false);

  if (error || !domain) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-secondary"
        style={{ width: size, height: size }}
      >
        <Shield className="text-muted-foreground" size={size * 0.5} />
      </div>
    );
  }

  return (
    <img
      src={getLogoUrl(domain)}
      alt={`${name} logo`}
      width={size}
      height={size}
      className="rounded-xl object-contain bg-secondary"
      onError={() => setError(true)}
    />
  );
}
