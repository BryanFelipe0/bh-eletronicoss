/**
 * PÁGINA ASSISTÊNCIA TÉCNICA
 *
 * Serviços, etapas e perguntas frequentes são listas: copie um bloco { ... }
 * para adicionar um item ou apague o bloco para remover.
 * Não informe prazos, preços ou garantias que não sejam praticados pela loja.
 * O botão "Solicitar avaliação" fica somente na página Contato.
 */
import type { Cta, Faq, ImageRef, Seo, Service, Step } from './types';

export const assistenciaContent = {
  seo: {
    title: 'Assistência técnica para smartphones — BH Eletrônicos',
    description:
      'Assistência técnica para smartphones na loja da BH Eletrônicos em Justinópolis, Ribeirão das Neves (MG): troca de tela, troca de vidro traseiro e avaliação técnica.',
  } satisfies Seo,

  hero: {
    label: 'Assistência técnica',
    title: 'Tecnologia merece cuidado.',
    text: 'Assistência técnica para smartphones na loja física da BH Eletrônicos, com bancada própria. O primeiro passo é uma avaliação do aparelho.',
    ctas: [{ label: 'Ver o processo', action: { type: 'route', to: '/assistencia#processo' }, variant: 'ghost' }] satisfies Cta[],
    image: {
      src: '/images/assistencia/bancada.jpg',
      alt: 'Técnico da BH Eletrônicos trabalhando em um smartphone na bancada de assistência',
      ratio: '3 / 4',
    } satisfies ImageRef,
  },

  intro: {
    label: 'Atendimento técnico',
    title: 'Diagnóstico antes de qualquer serviço.',
    text: 'Cada aparelho é avaliado individualmente. Depois da avaliação, você recebe as informações sobre o que foi identificado para decidir os próximos passos.',
    image: {
      src: '/images/assistencia/bancada-reparo.jpg',
      alt: 'Dois smartphones com o vidro traseiro quebrado na bancada de reparo',
      ratio: '4 / 3',
    } satisfies ImageRef,
  },

  /** Comparador arrastável: esquerda = depois (consertado), direita = antes (quebrado) */
  beforeAfter: {
    label: 'Antes e depois',
    title: 'Seu celular como novo.',
    text: 'Arraste a barra: para a esquerda você vê o aparelho como chegou na loja, para a direita, como ele saiu da bancada.',
    hint: 'Arraste para comparar',
    beforeLabel: 'Antes',
    afterLabel: 'Depois',
    /** Proporção das duas fotos (precisam ter o mesmo tamanho) */
    ratio: '635 / 870',
    before: {
      src: '/images/assistencia/antes.jpg',
      alt: 'Antes: smartphone com a tela totalmente trincada',
    } satisfies ImageRef,
    after: {
      src: '/images/assistencia/depois.jpg',
      alt: 'Depois: o mesmo smartphone com a tela nova, sem trincas',
    } satisfies ImageRef,
  },

  servicesSection: {
    label: 'Serviços',
    title: 'O que fazemos.',
  },

  processSection: {
    id: 'processo',
    label: 'Processo',
    title: 'Como solicitar uma avaliação.',
  },

  faqSection: {
    label: 'Perguntas frequentes',
    title: 'Dúvidas comuns.',
  },
};

/** SERVIÇOS — copie um bloco { ... } para adicionar um serviço. */
export const services: Service[] = [
  {
    id: 'troca-de-tela',
    title: 'Troca de tela',
    description: 'Substituição da tela quebrada ou com defeito do seu smartphone.',
    icon: 'smartphone',
  },
  {
    id: 'troca-de-vidro-traseiro',
    title: 'Troca de vidro traseiro',
    description: 'Substituição da tampa de vidro traseira trincada ou quebrada.',
    icon: 'layers',
  },
  {
    id: 'avaliacao-tecnica',
    title: 'Avaliação técnica',
    description: 'Análise do aparelho na bancada para identificar o problema antes de qualquer serviço.',
    icon: 'scan',
  },
];

/** ETAPAS DO PROCESSO DE AVALIAÇÃO */
export const processSteps: Step[] = [
  { title: 'Contato', description: 'Fale com a loja pelos canais da página Contato ou venha direto à loja física.' },
  { title: 'Entrega na loja', description: 'Leve o aparelho até a loja para que ele possa ser avaliado.' },
  { title: 'Avaliação', description: 'O aparelho passa por uma avaliação técnica na bancada.' },
  { title: 'Retorno', description: 'Você recebe as informações da avaliação e decide como seguir.' },
];

/** PERGUNTAS FREQUENTES — adicione, remova ou edite livremente */
export const faqs: Faq[] = [
  {
    question: 'Como solicito uma avaliação?',
    answer: 'Use o botão "Solicitar avaliação" na página Contato ou vá direto até a loja com o seu aparelho.',
  },
  {
    question: 'Onde fica a assistência técnica?',
    answer: 'Na própria loja da BH Eletrônicos: Rua Minas Gerais, 12, Menezes (Justinópolis), Ribeirão das Neves - MG.',
  },
  {
    question: 'Qual o horário de atendimento?',
    answer: 'De segunda a sábado, das 9h30 às 20h30. Domingos e feriados, das 9h30 às 13h.',
  },
];
