/**
 * ANIMAÇÃO 3D — "BEYOND THE SCREEN / ALÉM DA TELA"
 *
 * Esta é a central de controle da sequência cinematográfica da Home.
 * Cada cena define a POSE FINAL do aparelho, da câmera e das luzes.
 * Ao rolar a página, o site interpola suavemente de uma pose para a próxima.
 *
 * Unidades:
 *  - posição: unidades da cena 3D (o aparelho fechado tem ~2 unidades de altura)
 *  - rotação: radianos (3.1416 = meia volta; 1.5708 = um quarto de volta)
 *  - open: 0 = aparelho fechado, 1 = totalmente aberto (animação real do GLB)
 *  - luzes: intensidade (0 = apagada)
 *
 * Cada cena aceita ajustes específicos para `tablet` e `mobile`.
 * Só é preciso informar o que muda — o resto é herdado da versão desktop.
 */

export type Vec3 = [number, number, number];

export interface Pose {
  model: { position: Vec3; rotation: Vec3; scale: number };
  camera: { position: Vec3; target: Vec3; fov: number };
  lights: {
    /** Luz principal (branca, revela o acabamento) */
    key: number;
    /** Luz de preenchimento suave */
    fill: number;
    /** Luz de recorte traseira (contorno) */
    rim: number;
    /** Cor da luz de recorte */
    rimColor: string;
    /** Luz vermelha que percorre as bordas */
    accent: number;
    /** Posição angular da luz vermelha ao redor do aparelho (radianos) */
    accentAngle: number;
    /** Intensidade dos reflexos do ambiente */
    environment: number;
  };
  /** Progresso da animação de abertura do GLB (0 a 1) */
  open: number;
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? (T[K] extends unknown[] ? T[K] : DeepPartial<T[K]>) : T[K] };
export type PoseOverride = DeepPartial<Pose>;

export interface SceneConfig {
  id: 'despertar' | 'transformacao' | 'alem-da-tela' | 'precisao' | 'revelacao';
  /** Duração relativa da cena dentro da rolagem total (proporção, não segundos) */
  duration: number;
  pose: Pose;
  tablet?: PoseOverride;
  mobile?: PoseOverride;
}

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export const breakpoints = {
  /** Abaixo disso é mobile */
  tablet: 768,
  /** A partir disso é desktop */
  desktop: 1100,
};

export const modelConfig = {
  /** Caminho do arquivo GLB dentro de /public */
  path: '/models/smartphone-fold.glb',
  /** Nome da animação interna do GLB usada para abrir/fechar */
  animationName: 'open-close',
  /**
   * O site detecta sozinho se a animação do arquivo começa aberta ou fechada
   * (no arquivo atual ela começa ABERTA e termina FECHADA, e isso já é tratado).
   * Use true somente para forçar a inversão caso um novo modelo seja detectado errado.
   */
  invertAnimation: false,
  /** Altura que o aparelho fechado ocupa na cena (normalização automática) */
  targetHeight: 2,
  /** Correção de orientação aplicada ao modelo bruto (radianos) */
  baseRotation: [0, 0, 0] as Vec3,
  /**
   * Peças do modelo que devem ficar ocultas no site (sem alterar o arquivo).
   * Ex.: ['Back_Logo_20'] oculta o logotipo traseiro presente no modelo.
   */
  hiddenNodes: [] as string[],
};

export const sequenceConfig = {
  /**
   * Comprimento total da rolagem da sequência, em alturas de tela.
   * Ex.: 5 = a sequência dura 5 telas de rolagem.
   */
  scrollLength: { desktop: 6, tablet: 5.5, mobile: 5 },
  /**
   * Suavização entre a rolagem e a animação (segundos de "atraso").
   * true = sem atraso; número maior = mais suave.
   */
  scrub: 1,
  /** Duração da revelação inicial (cena 01) ao carregar a página, em segundos */
  introDuration: 2.6,
  /** Movimento ambiente discreto (flutuação e reação ao mouse) */
  ambient: {
    enabled: true,
    floatAmplitude: 0.03,
    floatSpeed: 0.6,
    pointerInfluence: 0.08,
  },
};

const darkLights: Pose['lights'] = {
  key: 0,
  fill: 0,
  rim: 0,
  rimColor: '#E53935',
  accent: 0,
  accentAngle: -2.4,
  environment: 0,
};

/** Pose de partida, antes da revelação inicial (tudo escuro). */
export const introFromLights = darkLights;

export const scenes: SceneConfig[] = [
  {
    id: 'despertar',
    duration: 1,
    pose: {
      model: { position: [1.45, -0.02, 0], rotation: [0.12, -0.62, 0.06], scale: 1.18 },
      camera: { position: [0, 0, 7.2], target: [0, 0, 0], fov: 30 },
      lights: {
        key: 1.1,
        fill: 0.25,
        rim: 6,
        rimColor: '#E53935',
        accent: 9,
        accentAngle: 0.9,
        environment: 0.55,
      },
      open: 0,
    },
    tablet: { model: { position: [1.1, -0.02, 0], scale: 0.95 } },
    mobile: {
      model: { position: [0, 0.78, 0], rotation: [0.1, -0.45, 0.04], scale: 0.62 },
      camera: { position: [0, 0, 8] },
    },
  },
  {
    id: 'transformacao',
    duration: 1.4,
    pose: {
      model: { position: [0.9, -0.05, 0], rotation: [0.05, 0.35, 0], scale: 1.05 },
      camera: { position: [0, 0.1, 6.2], target: [0, 0, 0], fov: 30 },
      lights: {
        key: 2.2,
        fill: 0.5,
        rim: 4,
        rimColor: '#E53935',
        accent: 4,
        accentAngle: 2.4,
        environment: 1,
      },
      open: 0.55,
    },
    tablet: { model: { position: [0.7, 0, 0], scale: 0.9 } },
    mobile: {
      model: { position: [-0.25, 0.72, 0], rotation: [0.05, 0.3, 0], scale: 0.6 },
      camera: { position: [0, 0, 8] },
    },
  },
  {
    id: 'alem-da-tela',
    duration: 1.6,
    pose: {
      model: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1.1 },
      camera: { position: [0, 0, 2.7], target: [0, 0, 0], fov: 30 },
      lights: {
        key: 1.8,
        fill: 0.6,
        rim: 2,
        rimColor: '#E53935',
        accent: 1.5,
        accentAngle: 3.4,
        environment: 1,
      },
      open: 1,
    },
    mobile: {
      model: { scale: 0.75 },
      camera: { position: [0, 0, 2.6] },
    },
  },
  {
    id: 'precisao',
    duration: 1.6,
    pose: {
      model: { position: [-1.25, -0.05, 0], rotation: [0.18, 2.55, 0.08], scale: 1 },
      camera: { position: [0, 0, 7], target: [0, 0, 0], fov: 30 },
      lights: {
        key: 2.4,
        fill: 0.5,
        rim: 5,
        rimColor: '#FFFFFF',
        accent: 3,
        accentAngle: 4.6,
        environment: 1.1,
      },
      open: 0.62,
    },
    tablet: { model: { position: [-0.9, 0, 0], scale: 0.85 } },
    mobile: {
      model: { position: [0, 0.75, 0], rotation: [0.18, 2.55, 0.08], scale: 0.58 },
      camera: { position: [0, 0, 8] },
    },
  },
  {
    id: 'revelacao',
    duration: 1.4,
    pose: {
      model: { position: [1.55, -0.05, -0.3], rotation: [0.16, -0.75, 0.1], scale: 1.1 },
      camera: { position: [0, 0, 7.6], target: [0, 0, 0], fov: 30 },
      lights: {
        key: 1.6,
        fill: 0.35,
        rim: 6,
        rimColor: '#E53935',
        accent: 6,
        accentAngle: 6.6,
        environment: 0.8,
      },
      open: 0,
    },
    tablet: { model: { position: [1.25, -0.1, -0.6], scale: 0.85 } },
    mobile: {
      model: { position: [0, 0.85, -0.6], rotation: [0.1, -0.35, 0.05], scale: 0.55 },
      camera: { position: [0, 0, 8] },
    },
  },
];

/**
 * LINHAS TÉCNICAS DA CENA 04 (Precisão em cada detalhe).
 * `node` é o nome de uma peça REAL existente no arquivo GLB.
 * `offset` é o deslocamento da etiqueta em pixels a partir da peça.
 * Os textos das etiquetas ficam em src/content/home.ts.
 */
export const calloutAnchors: { id: string; node: string; offset: [number, number]; mobileOffset?: [number, number] }[] = [
  { id: 'camera', node: 'Back_Cam_Base_10', offset: [-60, -110], mobileOffset: [-30, -70] },
  { id: 'dobradica', node: 'Axle_9', offset: [140, 150], mobileOffset: [70, 90] },
  { id: 'botoes', node: 'Side_Buttons_Cap_36', offset: [-50, 140], mobileOffset: [-20, 90] },
];

/** DESEMPENHO DO 3D */
export const renderConfig = {
  /**
   * Limite de densidade de pixels (mais alto = mais nítido e mais pesado).
   * Celulares têm telas muito densas (2x a 3x); abaixo de 2 o 3D fica pixelado.
   */
  maxPixelRatio: { desktop: 2, tablet: 2, mobile: 2 },
  /**
   * Densidade mínima: se o aparelho ficar lento, o site reduz a nitidez
   * automaticamente, mas nunca abaixo destes valores.
   */
  minPixelRatio: { desktop: 1, tablet: 1.25, mobile: 1.5 },
  /** Usa reflexos mais leves no mobile (não afeta a nitidez) */
  reduceEffectsOnMobile: true,
  /**
   * Dispositivos com poucos núcleos ou pouca memória recebem a versão leve
   * (sem 3D). Valores baseados nas APIs do navegador.
   */
  lowEnd: { maxCores: 2, maxMemoryGb: 2 },
};
