import { scenes, type Breakpoint, type Pose, type PoseOverride, type SceneConfig } from '../../config/animation';

/**
 * Estado "achatado" da cena 3D. O GSAP interpola estes números diretamente
 * (sem passar pelo React), e o loop de renderização do Three.js lê os valores
 * a cada quadro. Isso evita re-renderizações e conflitos entre GSAP e React.
 */
export interface FlatPose {
  mx: number; my: number; mz: number;
  rx: number; ry: number; rz: number;
  s: number;
  cx: number; cy: number; cz: number;
  tx: number; ty: number; tz: number;
  fov: number;
  key: number; fill: number; rim: number; rimColor: string;
  accent: number; accentAngle: number; env: number;
  open: number;
}

export interface SequenceState extends FlatPose {
  /** 0 → 1: revelação inicial ao carregar (cena 01) */
  intro: number;
  /** 0 → 1: visibilidade das linhas técnicas (cena 04) */
  callouts: number;
  /** Ponteiro normalizado (-1 a 1) para o movimento ambiente */
  pointerX: number;
  pointerY: number;
  /** 1 = movimento ambiente ligado, 0 = desligado (prefers-reduced-motion) */
  ambient: number;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function merge<T>(base: T, override?: PoseOverride | Record<string, unknown>): T {
  if (!override) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    const current = out[key];
    out[key] = isObject(value) && isObject(current) ? merge(current, value) : value;
  }
  return out as T;
}

/** Combina a pose desktop com os ajustes de tablet/mobile. */
export function resolvePose(scene: SceneConfig, bp: Breakpoint): Pose {
  if (bp === 'desktop') return scene.pose;
  if (bp === 'tablet') return merge(scene.pose, scene.tablet);
  // Mobile herda os ajustes de tablet e depois aplica os de mobile
  return merge(merge(scene.pose, scene.tablet), scene.mobile);
}

export function flattenPose(p: Pose): FlatPose {
  return {
    mx: p.model.position[0], my: p.model.position[1], mz: p.model.position[2],
    rx: p.model.rotation[0], ry: p.model.rotation[1], rz: p.model.rotation[2],
    s: p.model.scale,
    cx: p.camera.position[0], cy: p.camera.position[1], cz: p.camera.position[2],
    tx: p.camera.target[0], ty: p.camera.target[1], tz: p.camera.target[2],
    fov: p.camera.fov,
    key: p.lights.key, fill: p.lights.fill, rim: p.lights.rim, rimColor: p.lights.rimColor,
    accent: p.lights.accent, accentAngle: p.lights.accentAngle, env: p.lights.environment,
    open: p.open,
  };
}

export function posesFor(bp: Breakpoint): FlatPose[] {
  return scenes.map((scene) => flattenPose(resolvePose(scene, bp)));
}

export function createSequenceState(bp: Breakpoint): SequenceState {
  return { ...posesFor(bp)[0], intro: 0, callouts: 0, pointerX: 0, pointerY: 0, ambient: 1 };
}
