import { useSyncExternalStore } from 'react';
import { breakpoints, renderConfig, type Breakpoint } from '../config/animation';

function subscribeMedia(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  };
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function getBreakpoint(width = window.innerWidth): Breakpoint {
  if (width < breakpoints.tablet) return 'mobile';
  if (width < breakpoints.desktop) return 'tablet';
  return 'desktop';
}

export function useBreakpoint(): Breakpoint {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.tablet - 0.02}px)`);
  const isTablet = useMediaQuery(`(min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 0.02}px)`);
  return isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
}

let webglCache: boolean | null = null;

/** Verifica se o navegador suporta WebGL (resultado em cache). */
export function supportsWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    webglCache = Boolean(gl);
    const lose = gl?.getExtension('WEBGL_lose_context');
    lose?.loseContext();
  } catch {
    webglCache = false;
  }
  return webglCache;
}

/** Dispositivo com poucos recursos (heurística baseada em núcleos e memória). */
export function isLowEndDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  if (nav.connection?.saveData) return true;
  return cores <= renderConfig.lowEnd.maxCores || memory <= renderConfig.lowEnd.maxMemoryGb;
}
