import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { modelConfig, sequenceConfig } from '../../config/animation';
import type { SequenceState } from './sequenceState';

interface Props {
  state: SequenceState;
  onReady?: (root: THREE.Object3D) => void;
}

interface Calibration {
  scale: number;
  closedCenter: THREE.Vector3;
  openCenter: THREE.Vector3;
  invert: boolean;
  duration: number;
}

const END_EPSILON = 0.0005;

/**
 * Modelo 3D do smartphone (arquivo GLB original, sem alterações).
 *
 * - Usa a animação real "open-close" do arquivo para abrir/fechar.
 *   O tempo da animação é controlado pelo progresso da rolagem (state.open).
 * - Normaliza escala e centro automaticamente (o centro acompanha a abertura,
 *   para o aparelho não "escorregar" para o lado ao abrir).
 */
export function PhoneModel({ state, onReady }: Props) {
  const { scene, animations } = useGLTF(modelConfig.path);
  const outer = useRef<THREE.Group>(null);
  const centerGroup = useRef<THREE.Group>(null);
  const lastTime = useRef(-1);

  const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene]);
  const clip = useMemo(
    () => animations.find((a) => a.name === modelConfig.animationName) ?? animations[0] ?? null,
    [animations],
  );

  const action = useMemo(() => {
    if (!clip) return null;
    const a = mixer.clipAction(clip);
    a.setLoop(THREE.LoopOnce, 1);
    a.clampWhenFinished = true;
    a.play();
    return a;
  }, [mixer, clip]);

  // Ajustes de materiais em tempo de execução (o arquivo original não é alterado)
  useLayoutEffect(() => {
    modelConfig.hiddenNodes.forEach((name) => {
      const node = scene.getObjectByName(name);
      if (node) node.visible = false;
    });
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      // Malhas com esqueleto mudam de forma ao abrir: evita que sumam por culling incorreto
      if ((mesh as THREE.SkinnedMesh).isSkinnedMesh) mesh.frustumCulled = false;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        if (mat.map) mat.map.anisotropy = 4;
        if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
      });
    });
  }, [scene]);

  // Calibração: mede o aparelho fechado e aberto para normalizar escala e centro
  const calibration = useMemo<Calibration>(() => {
    const duration = clip?.duration ?? 0;
    const measure = (time: number) => {
      if (action) mixer.setTime(time);
      scene.updateMatrixWorld(true);
      return new THREE.Box3().setFromObject(scene, true);
    };
    const boxStart = measure(0);
    const boxEnd = action ? measure(Math.max(0, duration - END_EPSILON)) : boxStart.clone();
    const sizeStart = boxStart.getSize(new THREE.Vector3());
    const sizeEnd = boxEnd.getSize(new THREE.Vector3());
    const areaStart = sizeStart.x * sizeStart.y;
    const areaEnd = sizeEnd.x * sizeEnd.y;
    // Detecta automaticamente se o arquivo começa fechado ou aberto
    const autoInvert = areaStart > areaEnd;
    const invert = modelConfig.invertAnimation || autoInvert;
    const closedBox = invert ? boxEnd : boxStart;
    const openBox = invert ? boxStart : boxEnd;
    const closedSize = closedBox.getSize(new THREE.Vector3());
    const height = Math.max(closedSize.y, 0.0001);

    if (import.meta.env.DEV) {
      console.info('[3D] Calibração do modelo', {
        animacao: clip?.name,
        duracao: duration,
        tamanhoFechado: closedSize.toArray().map((n) => n.toFixed(4)),
        tamanhoAberto: openBox.getSize(new THREE.Vector3()).toArray().map((n) => n.toFixed(4)),
        invertido: invert,
      });
    }
    if (action) mixer.setTime(invert ? duration - END_EPSILON : 0);

    return {
      scale: modelConfig.targetHeight / height,
      closedCenter: closedBox.getCenter(new THREE.Vector3()),
      openCenter: openBox.getCenter(new THREE.Vector3()),
      invert,
      duration,
    };
  }, [scene, mixer, action, clip]);

  useEffect(() => {
    if (outer.current) onReady?.(outer.current);
  }, [onReady]);

  useEffect(
    () => () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
    },
    [mixer, scene],
  );

  const tmpCenter = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const g = outer.current;
    const c = centerGroup.current;
    if (!g || !c) return;

    // 1. Animação interna do GLB sincronizada com a rolagem
    const open = THREE.MathUtils.clamp(state.open, 0, 1);
    if (action && calibration.duration > 0) {
      const progress = calibration.invert ? 1 - open : open;
      const time = progress * (calibration.duration - END_EPSILON);
      if (Math.abs(time - lastTime.current) > 1e-5) {
        mixer.setTime(time);
        lastTime.current = time;
      }
    }

    // 2. Centro acompanha a abertura
    tmpCenter.lerpVectors(calibration.closedCenter, calibration.openCenter, open);
    c.position.copy(tmpCenter).multiplyScalar(-1);

    // 3. Pose controlada pela timeline + revelação inicial + movimento ambiente
    const intro = state.intro;
    const amb = sequenceConfig.ambient;
    const t = clock.getElapsedTime();
    const ambientOn = amb.enabled ? state.ambient : 0;
    const float = Math.sin(t * amb.floatSpeed) * amb.floatAmplitude * ambientOn;
    const px = state.pointerX * amb.pointerInfluence * ambientOn;
    const py = state.pointerY * amb.pointerInfluence * ambientOn;

    g.position.set(state.mx, state.my + float + (1 - intro) * -0.25, state.mz);
    g.rotation.set(state.rx + py * 0.6, state.ry + px + (1 - intro) * -0.7, state.rz);
    g.scale.setScalar(state.s * calibration.scale);
  });

  return (
    <group ref={outer}>
      <group rotation={modelConfig.baseRotation}>
        <group ref={centerGroup}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(modelConfig.path);
