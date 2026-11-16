/**
 * PÁGINA CONTATO — somente os TEXTOS da página.
 *
 * Os DADOS (WhatsApp, Instagram, endereço, horários, mapa) ficam em um único
 * lugar: src/content/site.ts
 */
import type { Seo } from './types';

export const contatoContent = {
  seo: {
    title: 'Contato e localização — BH Eletrônicos',
    description: 'WhatsApp, Instagram, endereço e horário de funcionamento da BH Eletrônicos.',
  } satisfies Seo,

  hero: {
    label: 'Contato',
    title: 'Fale com a gente.',
    text: 'Atendimento pelo WhatsApp ou presencialmente na loja.',
  },

  cards: {
    whatsapp: { label: 'WhatsApp', action: 'Iniciar conversa' },
    /** Card de assistência técnica: abre o WhatsApp com a mensagem abaixo */
    evaluation: {
      label: 'Assistência técnica',
      value: 'Avaliação do seu smartphone',
      action: 'Solicitar avaliação',
      message: 'Olá! Gostaria de solicitar uma avaliação para o meu smartphone. Modelo: ',
    },
    instagram: { label: 'Instagram', action: 'Ver perfil' },
    address: { label: 'Endereço', action: 'Como chegar' },
    hours: { label: 'Horário de funcionamento' },
    phone: { label: 'Telefone' },
    email: { label: 'E-mail' },
  },

  map: {
    label: 'Localização',
    title: 'Onde estamos.',
    /** Texto exibido enquanto o mapa não estiver configurado em site.ts */
    pendingText: 'O mapa será exibido aqui assim que o endereço da loja for configurado.',
    iframeTitle: 'Mapa com a localização da BH Eletrônicos',
  },
};
