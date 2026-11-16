/**
 * PÁGINA SOBRE NÓS
 *
 * Para mudar um diferencial, edite `title` e `text` em `differentials.items`.
 * Para adicionar, copie um bloco { ... }; para remover, apague o bloco.
 */
import type { Cta, Seo } from './types';

export const sobreContent = {
  seo: {
    title: 'Sobre nós — BH Eletrônicos',
    description: 'Conheça a BH Eletrônicos, loja física de acessórios, eletrônicos e assistência técnica para smartphones em Justinópolis, Ribeirão das Neves (MG).',
  } satisfies Seo,

  hero: {
    label: 'Sobre nós',
    title: 'Uma loja de tecnologia feita de atendimento.',
    text: 'A BH Eletrônicos é uma loja física de acessórios e eletrônicos, com assistência técnica para smartphones.',
  },

  service: {
    label: 'Atendimento',
    title: 'Atendimento de perto, direto na loja.',
    text: 'Venha até a loja para conhecer os produtos, tirar dúvidas e trazer o seu aparelho para avaliação. Nossa equipe atende você pessoalmente.',
  },

  differentials: {
    label: 'Diferenciais',
    title: 'O que nos define.',
    items: [
      {
        title: 'Variedade de verdade',
        text: 'Uma parede inteira de capinhas, películas, carregadores, cabos, fones e muito mais. Do acessório básico ao eletrônico para a sua casa.',
      },
      {
        title: 'Assistência na própria loja',
        text: 'Bancada técnica dentro da loja. Seu aparelho é avaliado ali mesmo, por quem entende do assunto.',
      },
      {
        title: 'Aberto todos os dias',
        text: 'De segunda a sábado até as 20h30, e também aos domingos e feriados pela manhã. Fácil encaixar na sua rotina.',
      },
    ],
  },

  cta: {
    title: 'Venha conhecer a loja.',
    ctas: [{ label: 'Como chegar', action: { type: 'directions' }, variant: 'primary' }] satisfies Cta[],
  },
};
