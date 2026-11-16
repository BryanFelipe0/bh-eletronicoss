/**
 * ANIMAÇÕES DA INTERFACE (fora do 3D)
 *
 * Todas usam somente opacidade, movimento e recorte, que o celular processa
 * sem esforço. Cada animação roda uma única vez, quando o bloco aparece na tela.
 * Quem ativou "reduzir movimento" no aparelho vê o site sem animações.
 */

/** Blocos de texto e cartões que sobem e aparecem ao rolar */
export const revealConfig = {
  /** Distância (px) que o bloco sobe ao aparecer */
  distance: 28,
  /** Duração em segundos */
  duration: 0.9,
  ease: 'power3.out',
  /** Atraso entre itens que aparecem juntos (ex.: cartões lado a lado) */
  stagger: 0.1,
  /** Quando começa: 'top 88%' = quando o topo do bloco chega a 88% da altura da tela */
  start: 'top 88%',
};

/** Fotos: revelação de baixo para cima, com um leve zoom que se acomoda */
export const imageRevealConfig = {
  enabled: true,
  duration: 1.2,
  ease: 'power4.inOut',
  /** Zoom inicial da foto (1 = sem zoom) */
  startScale: 1.18,
  start: 'top 90%',
  /** Zoom ao passar o mouse sobre a foto (somente computador). 1 desliga. */
  hoverScale: 1.04,
};

/** Títulos que aparecem linha por linha */
export const titleRevealConfig = {
  enabled: true,
  duration: 1,
  ease: 'power4.out',
  /** Atraso entre uma linha e a seguinte */
  stagger: 0.09,
};

/**
 * Parallax: as fotos se movem levemente mais devagar que a rolagem.
 * Somente no computador (no celular fica desligado para economizar bateria).
 */
export const parallaxConfig = {
  enabled: true,
  /** Deslocamento máximo em pixels */
  distance: 40,
  /** Largura mínima da tela para ativar */
  minWidth: 1024,
};

/** Transição suave ao trocar de página (duração em segundos) */
export const pageTransitionConfig = {
  duration: 0.5,
};

export const menuConfig = {
  duration: 0.45,
  ease: 'power3.out',
};
