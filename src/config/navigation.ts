/**
 * MENU DE NAVEGAÇÃO — usado no cabeçalho, no menu mobile e no rodapé.
 * A ordem do array é a ordem exibida.
 */

export interface NavItem {
  label: string;
  to: string;
}

export const navigation: NavItem[] = [
  { label: 'Início', to: '/' },
  { label: 'Produtos', to: '/produtos' },
  { label: 'Assistência técnica', to: '/assistencia' },
  { label: 'Sobre nós', to: '/sobre' },
  { label: 'Contato', to: '/contato' },
];

export const headerConfig = {
  /**
   * Botão de WhatsApp no cabeçalho e no menu mobile.
   * Desligado: o WhatsApp fica somente na página Contato. Para voltar: true
   */
  showWhatsappButton: false,
  /** Texto do botão de WhatsApp no cabeçalho */
  whatsappLabel: 'WhatsApp',
  /** Mensagem pré-preenchida ao clicar no botão do cabeçalho */
  whatsappMessage: 'Olá! Vim pelo site da BH Eletrônicos e gostaria de atendimento.',
  /** Textos de acessibilidade do menu mobile */
  openMenuLabel: 'Abrir menu',
  closeMenuLabel: 'Fechar menu',
  skipToContentLabel: 'Pular para o conteúdo',
};

/**
 * BOTÃO FLUTUANTE DO WHATSAPP (canto inferior direito)
 * Usa o número de src/content/site.ts. Para desligar: enabled: false
 */
export const floatingWhatsapp = {
  enabled: true,
  /**
   * Páginas onde o botão aparece. Hoje: somente Contato.
   * Para mostrar em todas as páginas, use: pages: 'all'
   */
  pages: ['/contato'] as string[] | 'all',
  /** Texto que aparece ao lado do botão */
  label: 'Fale com a gente',
  /** Mensagem automática ao abrir a conversa */
  message: 'Olá! Vim pelo site da BH Eletrônicos e gostaria de atendimento.',
  /** Na Home, o botão aparece depois de rolar esta fração da primeira tela (evita cobrir os botões do topo) */
  homeRevealAfter: 0.6,
};

/** Títulos das colunas e textos fixos do rodapé */
export const footerConfig = {
  navigationTitle: 'Navegação',
  contactTitle: 'Contato',
  locationTitle: 'Localização',
  socialTitle: 'Redes sociais',
  hoursTitle: 'Horário',
  backToTopLabel: 'Voltar ao topo',
};
