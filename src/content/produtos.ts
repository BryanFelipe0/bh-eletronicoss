/**
 * PÁGINA PRODUTOS + CATEGORIAS DO SITE
 *
 * `categories` alimenta a página Produtos e a cena 03 da Home.
 *
 * Para adicionar uma categoria: copie um bloco { ... } inteiro, cole no
 * final da lista e altere os campos. Para remover: apague o bloco.
 * As descrições não informam preços nem disponibilidade.
 */
import type { Category, Highlight, Seo } from './types';

export const produtosContent = {
  seo: {
    title: 'Produtos — BH Eletrônicos',
    description:
      'Capinhas, películas, carregadores, cabos, fones e outros acessórios e eletrônicos na loja física da BH Eletrônicos.',
  } satisfies Seo,

  hero: {
    label: 'Produtos',
    title: 'Acessórios para o seu dia a dia.',
    text: 'Uma seleção das categorias que você encontra na loja física. Venha conhecer de perto os modelos disponíveis.',
  },

  indexLabel: 'Categorias',

  highlightsSection: {
    label: 'Destaques',
    title: 'Em destaque na loja.',
  },
};

export const categories: Category[] = [
  {
    id: 'capinhas',
    name: 'Capinhas',
    summary: 'Proteção e estilo para o seu aparelho.',
    description: 'Uma parede inteira de capinhas, em várias cores e modelos para diferentes smartphones.',
    image: { src: '/images/produtos/capinhas.jpg', alt: 'Capinhas de silicone em várias cores na parede de capinhas da loja', ratio: '3 / 4' },
    icon: 'smartphone',
    featured: true,
  },
  {
    id: 'peliculas',
    name: 'Películas',
    summary: 'Proteção para a tela.',
    description: 'Películas de cerâmica e 3D para proteger a tela do seu smartphone.',
    image: { src: '/images/produtos/peliculas.jpg', alt: 'Películas de cerâmica e 3D na mão, com as prateleiras da loja ao fundo', ratio: '3 / 4' },
    icon: 'layers',
    featured: true,
  },
  {
    id: 'carregadores',
    name: 'Carregadores',
    summary: 'Energia para o seu dia.',
    description: 'Carregadores de tomada, kits com cabo e power banks para manter o seu aparelho carregado.',
    image: { src: '/images/produtos/carregadores.jpg', alt: 'Kit carregador, carregador rápido, power bank e adaptador USB-C', ratio: '4 / 3' },
    icon: 'plug',
    featured: true,
  },
  {
    id: 'cabos',
    name: 'Cabos',
    summary: 'Conexão e carregamento.',
    description: 'Cabos de carregamento rápido para iPhone, USB-C e modelos multiuso.',
    image: { src: '/images/produtos/cabos.jpg', alt: 'Cabos de carregamento rápido iOS, USB-C e 4 em 1 nas embalagens', ratio: '3 / 4' },
    icon: 'cable',
    featured: true,
  },
  {
    id: 'fones',
    name: 'Fones',
    summary: 'Som para todos os momentos.',
    description: 'Fones sem fio, intra-auriculares e headphones para o dia a dia.',
    image: { src: '/images/produtos/fones.jpg', alt: 'Fones de ouvido sem fio e headphone nas embalagens', ratio: '4 / 3' },
    icon: 'headphones',
    featured: true,
  },
  {
    id: 'acessorios',
    name: 'Outros acessórios',
    summary: 'Muito além do celular.',
    description: 'Caixas de som, projetores, videogames, eletroportáteis e outros eletrônicos para a sua casa.',
    image: { src: '/images/produtos/outros-acessorios.jpg', alt: 'Caixa de som, projetor, videogame e chaleira elétrica no balcão da loja', ratio: '3 / 4' },
    icon: 'package',
    featured: true,
  },
];

/**
 * DESTAQUES (opcional)
 * Produtos ou grupos que merecem destaque. A seção só aparece se esta lista
 * tiver pelo menos um item. Exemplo de item:
 *
 * {
 *   id: 'destaque-1',
 *   title: 'Nome do destaque',
 *   description: 'Descrição curta, sem preço.',
 *   categoryId: 'fones',
 *   image: { src: '/images/produtos/destaque-1.jpg', alt: 'Descrição da foto', ratio: '3 / 4' },
 * },
 */
export const highlights: Highlight[] = [];
