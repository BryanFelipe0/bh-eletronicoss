import { Component, type ReactNode } from 'react';

/**
 * Alternativa visual leve para quando o 3D não está disponível
 * (sem WebGL, dispositivo com poucos recursos ou falha ao carregar o modelo).
 * Uma silhueta técnica desenhada em SVG — sem dependências externas.
 */
export function SceneFallback() {
  return (
    <div className="scene-fallback" aria-hidden="true">
      <svg viewBox="0 0 400 520" className="scene-fallback__svg">
        <defs>
          <linearGradient id="fb-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-red)" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="var(--color-red)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g fill="none" strokeWidth="1">
          <line x1="0" y1="470" x2="400" y2="470" stroke="var(--color-line)" />
          <line x1="200" y1="0" x2="200" y2="520" stroke="var(--color-line)" strokeDasharray="2 6" />
          <rect x="110" y="40" width="180" height="400" rx="26" stroke="url(#fb-edge)" strokeWidth="2" />
          <rect x="118" y="48" width="164" height="384" rx="20" stroke="var(--color-line)" />
          <rect x="132" y="62" width="58" height="58" rx="14" stroke="var(--color-gray-dim)" />
          <circle cx="150" cy="80" r="9" stroke="var(--color-gray-dim)" />
          <circle cx="172" cy="102" r="9" stroke="var(--color-gray-dim)" />
          <line x1="290" y1="140" x2="290" y2="190" stroke="var(--color-gray)" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

interface BoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: () => void;
}

export class ThreeErrorBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) console.warn('[3D] Falha ao carregar a cena. Exibindo alternativa leve.', error);
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
