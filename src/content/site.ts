/**
 * DADOS DA EMPRESA — arquivo único com todas as informações comerciais.
 *
 * WhatsApp, Instagram, endereço, horários e links ficam AQUI.
 * Todas as páginas (cabeçalho, rodapé, contato, botões) leem deste arquivo.
 *
 * Campos opcionais vazios ('') simplesmente não aparecem no site
 * e nunca geram links falsos.
 */

export const site = {
  name: 'BH Eletrônicos',
  /** Logotipo em texto: parte principal + complemento */
  wordmark: { primary: 'BH', secondary: 'ELETRÔNICOS' },
  /** Frase curta usada no rodapé e em compartilhamentos */
  tagline: 'Acessórios, eletrônicos e assistência técnica para smartphones.',

  /** Domínio do site depois de publicado (ex.: 'https://www.bheletronicos.com.br'). Usado em SEO. */
  url: 'https://bheletronicos.com.br',

  /** Imagem de compartilhamento em redes sociais (1200×630) em /public/images/og/ */
  shareImage: '',

  contact: {
    whatsapp: {
      /**
       * Número com DDI + DDD + número, somente dígitos.
       * Exemplo de formato: '5531999999999'
       */
      number: '5531992770719',
      /** Como o número aparece escrito no site */
      display: '(31) 99277-0719',
      /** Mensagem padrão ao abrir a conversa */
      defaultMessage: 'Olá! Vim pelo site da BH Eletrônicos e gostaria de atendimento.',
    },
    instagram: {
      /** Nome de usuário sem @ */
      handle: 'bheletronicoss',
    },
    /** Telefone fixo opcional, somente dígitos com DDD. [PROVISÓRIO] */
    phone: '',
    phoneDisplay: '',
    /** E-mail opcional. [PROVISÓRIO] */
    email: '',
  },

  address: {
    street: 'Rua Minas Gerais',
    number: '12',
    complement: '',
    district: 'Menezes (Justinópolis)',
    city: 'Ribeirão das Neves',
    state: 'MG',
    zip: '33913-480',
    /**
     * Ponto exato da loja no Google Maps (latitude e longitude).
     * O mapa e o botão "Como chegar" usam este ponto, porque outras lojas
     * da rua também usam o número 12.
     */
    coordinates: { lat: -19.7756161, lng: -44.0209268 },
    /** Link da loja no Google Maps (o mesmo do botão "Compartilhar") */
    mapsLink: 'https://maps.app.goo.gl/u5G8hwUCYrspiN4B9',
    /**
     * Link de incorporação do Google Maps (opcional).
     * Se ficar vazio, o mapa é gerado automaticamente a partir de `coordinates`.
     * Para usar outro: Google Maps → Compartilhar → Incorporar um mapa → copie
     * somente o endereço dentro de src="..." (começa com https://www.google.com/maps/embed).
     */
    mapEmbedUrl: '',
  },

  /** Horário de funcionamento. Adicione ou remova linhas livremente. */
  hours: [
    { days: 'Segunda a sábado', time: '9h30 às 20h30' },
    { days: 'Domingo e feriados', time: '9h30 às 13h' },
  ],

  legal: {
    /** CNPJ opcional, exibido no rodapé se preenchido */
    cnpj: '',
    rights: 'Todos os direitos reservados.',
  },

  /** Texto exibido no lugar de informações ainda não fornecidas */
  pendingLabel: 'A definir',
};
