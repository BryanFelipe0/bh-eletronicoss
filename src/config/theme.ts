/**
 * TEMA VISUAL — cores, fontes e medidas globais.
 *
 * Tudo aqui vira variável CSS (ex.: `--color-red`) aplicada no <html>
 * quando o site carrega. Para mudar uma cor no site inteiro, altere o
 * valor abaixo — não é preciso mexer nos arquivos CSS.
 */

export const theme = {
  colors: {
    /** Fundo principal do site */
    black: '#09090B',
    /** Fundo de blocos e cartões */
    blackSoft: '#141417',
    /** Linhas e bordas sutis */
    line: '#26262B',
    white: '#FFFFFF',
    /** Vermelho de destaque (botões, detalhes, luz do 3D) */
    red: '#E53935',
    /** Vermelho escuro (hover, sombras) */
    redDeep: '#A71919',
    /** Texto secundário */
    gray: '#A1A1AA',
    /** Texto terciário / legendas */
    grayDim: '#71717A',
  },

  fonts: {
    /** Títulos e headlines */
    display: "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif",
    /** Textos, navegação e botões */
    body: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    /** Etiquetas técnicas e numeração */
    mono: "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
  },

  /**
   * Endereço do Google Fonts. Se trocar as fontes acima, gere um novo link
   * em https://fonts.google.com e cole aqui.
   */
  googleFontsUrl:
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap',

  /** Arredondamento dos cantos (mantido baixo de propósito) */
  radius: {
    sm: '2px',
    md: '4px',
  },

  /** Largura máxima do conteúdo */
  containerWidth: '1320px',
} as const;

/** Converte o objeto acima em variáveis CSS no elemento <html>. */
export function applyTheme(): void {
  const root = document.documentElement;
  const c = theme.colors;
  const vars: Record<string, string> = {
    '--color-black': c.black,
    '--color-black-soft': c.blackSoft,
    '--color-line': c.line,
    '--color-white': c.white,
    '--color-red': c.red,
    '--color-red-deep': c.redDeep,
    '--color-gray': c.gray,
    '--color-gray-dim': c.grayDim,
    '--font-display': theme.fonts.display,
    '--font-body': theme.fonts.body,
    '--font-mono': theme.fonts.mono,
    '--radius-sm': theme.radius.sm,
    '--radius-md': theme.radius.md,
    '--container': theme.containerWidth,
  };
  for (const [key, value] of Object.entries(vars)) root.style.setProperty(key, value);

  if (!document.querySelector('link[data-theme-fonts]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = theme.googleFontsUrl;
    link.dataset.themeFonts = 'true';
    document.head.appendChild(link);
  }
}
