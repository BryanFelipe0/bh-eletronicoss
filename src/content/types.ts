/**
 * Tipos compartilhados pelos arquivos de conteúdo.
 * Não é preciso editar este arquivo para mudar textos — ele apenas garante
 * que nenhum campo obrigatório seja esquecido.
 */

/** Ação de um botão ou link. */
export type CtaAction =
  /** Página interna do site (ex.: '/produtos' ou '/produtos#capinhas') */
  | { type: 'route'; to: string }
  /** Abre conversa no WhatsApp configurado em site.ts */
  | { type: 'whatsapp'; message?: string }
  /** Link externo (somente https://) */
  | { type: 'external'; href: string }
  /** Abre rotas no Google Maps até o endereço de site.ts */
  | { type: 'directions' };

export interface Cta {
  label: string;
  action: CtaAction;
  variant?: 'primary' | 'secondary' | 'ghost';
}

/** Imagem local em /public/images. Deixe `src` vazio para exibir o espaço reservado. */
export interface ImageRef {
  src: string;
  alt: string;
  /** Texto exibido no espaço reservado enquanto a foto não existir */
  placeholderLabel?: string;
  /**
   * Proporção da foto (largura / altura), para exibi-la inteira, sem cortes.
   * Foto em pé do celular: '3 / 4'. Foto deitada: '4 / 3'.
   */
  ratio?: string;
}

export interface Seo {
  title: string;
  description: string;
}

export interface Category {
  /** Identificador usado no endereço (ex.: /produtos#capinhas). Sem espaços ou acentos. */
  id: string;
  name: string;
  /** Frase curta usada em cartões e listas */
  summary: string;
  /** Texto mais longo, exibido na página Produtos */
  description: string;
  image: ImageRef;
  /** Ícone (nome de um ícone Lucide listado em src/components/ui/Icon.tsx) */
  icon: IconName;
  /** Marca a categoria como destaque (reservado para uso futuro) */
  featured: boolean;
  /** Mensagem pré-preenchida, caso um botão de WhatsApp volte a ser usado (opcional) */
  whatsappMessage?: string;
  /** Marca o conteúdo como provisório (mostra uma etiqueta discreta em desenvolvimento) */
  placeholder?: boolean;
}

export interface Highlight {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  image: ImageRef;
  whatsappMessage?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  placeholder?: boolean;
}

export interface Step {
  title: string;
  description: string;
}

export interface Faq {
  question: string;
  answer: string;
  placeholder?: boolean;
}

export type IconName =
  | 'smartphone'
  | 'shield'
  | 'plug'
  | 'cable'
  | 'headphones'
  | 'layers'
  | 'battery'
  | 'wrench'
  | 'scan'
  | 'cpu'
  | 'store'
  | 'message'
  | 'clock'
  | 'map'
  | 'sparkles'
  | 'package';
