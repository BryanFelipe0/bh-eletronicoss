/**
 * PÁGINA INÍCIO (Home)
 *
 * - `seo`: título da aba e descrição para o Google
 * - `cinematic`: textos das 5 cenas da experiência 3D
 * - demais blocos: seções abaixo da experiência 3D
 *
 * As categorias da cena 03 vêm de src/content/produtos.ts.
 * Os botões de WhatsApp ficam somente na página Contato.
 */
import type { Cta, ImageRef, Seo } from './types';

export const homeContent = {
  seo: {
    title: 'BH Eletrônicos — Acessórios, eletrônicos e assistência técnica',
    description:
      'Loja física de acessórios e eletrônicos com assistência técnica para smartphones em Justinópolis, Ribeirão das Neves (MG).',
  } satisfies Seo,

  cinematic: {
    /** Nome conceitual exibido discretamente durante a experiência */
    conceptLabel: 'Beyond the screen — Além da tela',
    /** Rótulo do indicador de rolagem na primeira tela */
    scrollHint: 'Role para explorar',

    despertar: {
      index: '01',
      eyebrow: 'BH Eletrônicos',
      title: 'O futuro está nas suas mãos.',
      text: 'Acessórios, eletrônicos e assistência técnica para smartphones em um só lugar. Venha conhecer a loja.',
      ctas: [{ label: 'Explorar produtos', action: { type: 'route', to: '/produtos' }, variant: 'primary' }] satisfies Cta[],
    },

    transformacao: {
      index: '02',
      eyebrow: 'A transformação',
      title: 'Cada detalhe em movimento.',
      text: 'Tecnologia que se adapta ao seu dia. E acessórios que acompanham essa evolução.',
    },

    alemDaTela: {
      index: '03',
      eyebrow: 'Além da tela',
      title: 'Tudo para o seu mundo digital.',
      text: 'Categorias que você encontra na loja física.',
      /** Quantas categorias aparecem nesta cena (as primeiras de produtos.ts) */
      maxCategories: 6,
      cta: { label: 'Ver todas as categorias', action: { type: 'route', to: '/produtos' }, variant: 'ghost' } satisfies Cta,
    },

    precisao: {
      index: '04',
      eyebrow: 'Precisão em cada detalhe',
      title: 'Tecnologia merece cuidado.',
      text: 'Assistência técnica para smartphones, feita na própria loja.',
      /** Etiquetas das linhas técnicas (peças reais do modelo 3D). Ids em src/config/animation.ts */
      callouts: {
        camera: { code: 'A.01', label: 'Módulo de câmera' },
        dobradica: { code: 'A.02', label: 'Dobradiça' },
        botoes: { code: 'A.03', label: 'Botões laterais' },
      } as Record<string, { code: string; label: string }>,
    },

    revelacao: {
      index: '05',
      eyebrow: 'Acessórios · Eletrônicos · Assistência técnica',
      ctas: [
        { label: 'Conhecer produtos', action: { type: 'route', to: '/produtos' }, variant: 'primary' },
        { label: 'Assistência técnica', action: { type: 'route', to: '/assistencia' }, variant: 'secondary' },
      ] satisfies Cta[],
    },
  },

  intro: {
    label: 'A loja',
    title: 'Tecnologia com atendimento de perto.',
    paragraphs: [
      'A BH Eletrônicos é uma loja física especializada em acessórios e eletrônicos, com assistência técnica para smartphones.',
      'Aqui você encontra o que precisa para o seu aparelho e conversa diretamente com quem entende do assunto.',
    ],
    cta: { label: 'Conheça a BH Eletrônicos', action: { type: 'route', to: '/sobre' }, variant: 'ghost' } satisfies Cta,
  },

  assistance: {
    label: 'Assistência técnica',
    title: 'Seu smartphone em boas mãos.',
    text: 'Bancada própria na loja para cuidar do seu aparelho. Traga o seu smartphone para uma avaliação.',
    ctas: [{ label: 'Como funciona', action: { type: 'route', to: '/assistencia' }, variant: 'ghost' }] satisfies Cta[],
  },

  store: {
    label: 'Loja física',
    title: 'Venha nos visitar.',
    text: 'Atendimento presencial para conhecer os produtos e deixar seu aparelho para avaliação.',
    image: {
      src: `${import.meta.env.BASE_URL}images/loja/fachada.jpg`,
      alt: 'Fachada vermelha da loja BH Eletrônicos na Rua Minas Gerais',
      ratio: '3 / 4',
    } satisfies ImageRef,
    addressLabel: 'Endereço',
    hoursLabel: 'Horário',
    ctas: [
      { label: 'Como chegar', action: { type: 'directions' }, variant: 'primary' },
      { label: 'Todas as informações', action: { type: 'route', to: '/contato' }, variant: 'ghost' },
    ] satisfies Cta[],
  },
};
