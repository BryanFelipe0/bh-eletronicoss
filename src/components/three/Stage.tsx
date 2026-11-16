import { Environment, Lightformer, PerformanceMonitor, useProgress } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { calloutAnchors, renderConfig, type Breakpoint } from '../../config/animation';
import { theme } from '../../config/theme';
import { PhoneModel } from './PhoneModel';
import type { SequenceState } from './sequenceState';

export interface CalloutRefs {
  root: RefObject<HTMLDivElement | null>;
  labels: RefObject<(HTMLDivElement | null)[]>;
  lines: RefObject<(SVGLineElement | null)[]>;
  dots: RefObject<(SVGCircleElement | null)[]>;
}

interface StageProps {
  state: SequenceState;
  breakpoint: Breakpoint;
  active: boolean;
  callouts?: CalloutRefs;
  onModelReady?: () => void;
  onProgress?: (progress: number) => void;
}

/** Câmera controlada pelo estado da timeline. */
function CameraRig({ state }: { state: SequenceState }) {
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    const cam = camera as THREE.PerspectiveCamera;
    const px = state.pointerX * 0.12 * state.ambient;
    const py = state.pointerY * 0.08 * state.ambient;
    cam.position.set(state.cx + px, state.cy + py, state.cz);
    target.set(state.tx, state.ty, state.tz);
    cam.lookAt(target);
    if (Math.abs(cam.fov - state.fov) > 0.01) {
      cam.fov = state.fov;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

/** Iluminação: principal, preenchimento, recorte e a luz vermelha que percorre as bordas. */
function Lights({ state, reduced }: { state: SequenceState; reduced: boolean }) {
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.SpotLight>(null);
  const accent = useRef<THREE.PointLight>(null);
  const scene = useThree((s) => s.scene);

  useFrame(() => {
    const intro = state.intro;
    if (key.current) key.current.intensity = state.key * intro;
    if (fill.current) fill.current.intensity = state.fill * intro;
    if (rim.current) {
      rim.current.intensity = state.rim * 4 * Math.min(1, intro * 1.6);
      rim.current.color.set(state.rimColor);
    }
    if (accent.current) {
      // Durante a revelação inicial a luz vermelha varre o aparelho de um lado ao outro
      // A órbita fica atrás do aparelho, para a luz desenhar as bordas sem refletir na tela
      const angle = state.accentAngle + (1 - intro) * -2.6;
      accent.current.position.set(
        state.mx + Math.cos(angle) * 1.6,
        state.my + Math.sin(angle * 0.7) * 1.1,
        state.mz - 1.1 + Math.sin(angle) * 0.5,
      );
      accent.current.intensity = state.accent * Math.min(1, intro * 2.2);
    }
    scene.environmentIntensity = state.env * intro;
  });

  return (
    <>
      <ambientLight intensity={0.03} />
      <directionalLight ref={key} position={[3, 4, 5]} color="#ffffff" />
      <directionalLight ref={fill} position={[-4, -1, 3]} color="#d9dde5" />
      <spotLight ref={rim} position={[-1.5, 2.5, -4.5]} angle={0.7} penumbra={1} distance={0} decay={0} />
      <pointLight ref={accent} color={theme.colors.red} distance={6} decay={1.6} />
      <Environment resolution={reduced ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 3, 2]} rotation-x={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[-4, 0.5, 1]} rotation-y={Math.PI / 2} scale={[3, 5, 1]} />
        <Lightformer form="rect" intensity={1} color="#ffffff" position={[4, 0.5, 2]} rotation-y={-Math.PI / 2} scale={[2, 5, 1]} />
        <Lightformer form="rect" intensity={1.6} color={theme.colors.red} position={[0, -2, -4]} scale={[8, 1, 1]} />
      </Environment>
    </>
  );
}

/** Projeta peças reais do modelo na tela para posicionar as linhas técnicas da cena 04. */
function CalloutProjector({ state, refs, breakpoint }: { state: SequenceState; refs: CalloutRefs; breakpoint: Breakpoint }) {
  const scene = useThree((s) => s.scene);
  const objects = useRef<(THREE.Object3D | null)[]>([]);
  const box = useMemo(() => new THREE.Box3(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  const lastVisible = useRef(false);

  useFrame(({ camera, size }) => {
    const root = refs.root.current;
    if (!root) return;
    const visible = state.callouts > 0.001;
    if (!visible) {
      if (lastVisible.current) root.style.opacity = '0';
      lastVisible.current = false;
      return;
    }
    lastVisible.current = true;
    root.style.opacity = String(state.callouts);

    calloutAnchors.forEach((anchor, i) => {
      if (!objects.current[i]) objects.current[i] = scene.getObjectByName(anchor.node) ?? null;
      const obj = objects.current[i];
      const label = refs.labels.current?.[i];
      const line = refs.lines.current?.[i];
      const dot = refs.dots.current?.[i];
      if (!obj || !label || !line || !dot) return;
      box.setFromObject(obj);
      box.getCenter(v);
      v.project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      const [ox, oy] = breakpoint === 'mobile' && anchor.mobileOffset ? anchor.mobileOffset : anchor.offset;
      const w = label.offsetWidth;
      const h = label.offsetHeight;
      const margin = 12;
      const lx = x + ox * state.callouts;
      const ly = THREE.MathUtils.clamp(y + oy * state.callouts, h / 2 + margin, size.height - h / 2 - margin);
      // Mantém a etiqueta inteira dentro da tela
      const left = THREE.MathUtils.clamp(ox < 0 ? lx - w : lx, margin, size.width - w - margin);
      const lineX = ox < 0 ? left + w : left;
      dot.setAttribute('cx', x.toFixed(1));
      dot.setAttribute('cy', y.toFixed(1));
      line.setAttribute('x1', x.toFixed(1));
      line.setAttribute('y1', y.toFixed(1));
      line.setAttribute('x2', lineX.toFixed(1));
      line.setAttribute('y2', ly.toFixed(1));
      label.style.transform = `translate3d(${left.toFixed(1)}px, ${(ly - h / 2).toFixed(1)}px, 0)`;
    });
  });
  return null;
}

function ProgressReporter({ onProgress }: { onProgress?: (p: number) => void }) {
  const { progress } = useProgress();
  useEffect(() => onProgress?.(progress), [progress, onProgress]);
  return null;
}

/**
 * Canvas 3D principal. Uma única instância durante toda a sequência.
 * `active=false` pausa a renderização quando a sequência sai da tela.
 */
export default function Stage({ state, breakpoint, active, callouts, onModelReady, onProgress }: StageProps) {
  const deviceDpr = window.devicePixelRatio || 1;
  const maxDpr = Math.min(deviceDpr, renderConfig.maxPixelRatio[breakpoint]);
  const minDpr = Math.min(maxDpr, renderConfig.minPixelRatio[breakpoint]);
  const [dpr, setDpr] = useState(maxDpr);
  const reduced = breakpoint === 'mobile' && renderConfig.reduceEffectsOnMobile;

  return (
    <>
      <ProgressReporter onProgress={onProgress} />
      <Canvas
        dpr={dpr}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [state.cx, state.cy, state.cz], fov: state.fov, near: 0.05, far: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMappingExposure = 1.05;
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <PerformanceMonitor
          onDecline={() => setDpr((d) => Math.max(minDpr, d - 0.25))}
          onIncline={() => setDpr((d) => Math.min(maxDpr, d + 0.25))}
        />
        <CameraRig state={state} />
        <Lights state={state} reduced={reduced} />
        <Suspense fallback={null}>
          <PhoneModel state={state} onReady={onModelReady} />
        </Suspense>
        {callouts && <CalloutProjector state={state} refs={callouts} breakpoint={breakpoint} />}
      </Canvas>
    </>
  );
}
