# Guia de edição — BH Eletrônicos

Este guia explica **onde** mudar cada informação do site. Nenhum texto, contato, imagem ou cor está escrito dentro dos componentes: tudo fica em arquivos de configuração organizados.

## Antes de começar

- Abra a pasta do projeto em um editor (recomendado: VS Code).
- Dê dois cliques em `iniciar-site.bat` (ou rode `npm run dev`) e deixe o site aberto no navegador. Cada vez que você salvar um arquivo, o site atualiza sozinho.
- Os arquivos são TypeScript (`.ts`). Regras básicas:
  - Textos ficam entre aspas simples: `'Meu texto'`. Se o texto tiver apóstrofo, use aspas duplas: `"D'água"`.
  - Cada item de uma lista termina com vírgula.
  - Não apague chaves `{ }`, colchetes `[ ]` ou vírgulas da estrutura.
- Se algo quebrar, o terminal (`npm run dev`) mostra o arquivo e a linha do erro.

### Mapa dos arquivos

| O que mudar | Arquivo |
| --- | --- |
| WhatsApp, Instagram, endereço, horários, mapa, nome da empresa | `src/content/site.ts` |
| Textos da Home e das 5 cenas 3D | `src/content/home.ts` |
| Categorias, página Produtos, destaques | `src/content/produtos.ts` |
| Página Assistência técnica, serviços, etapas, FAQ | `src/content/assistencia.ts` |
| Página Sobre nós | `src/content/sobre.ts` |
| Textos da página Contato | `src/content/contato.ts` |
| Menu e textos do cabeçalho/rodapé | `src/config/navigation.ts` |
| Cores, fontes, arredondamento | `src/config/theme.ts` |
| Animação 3D (câmera, luzes, poses, duração) | `src/config/animation.ts` |
| Animação de entrada dos blocos | `src/config/animation-ui.ts` |
| Fotos | `public/images/...` |
| Modelo 3D usado pelo site | `public/models/smartphone-fold.glb` |

---

## 1. Alterar qualquer texto

Cada página tem seu arquivo em `src/content/`. Os nomes dos campos indicam onde o texto aparece:

- `label` → etiqueta pequena acima do título (fonte mono)
- `title` → título
- `text` / `paragraphs` → parágrafos
- `seo.title` → título da aba do navegador e do Google
- `seo.description` → descrição exibida no Google

Exemplo (`src/content/home.ts`):

```ts
despertar: {
  index: '01',
  eyebrow: 'BH Eletrônicos',
  title: 'O futuro está nas suas mãos.',
  text: 'Acessórios, eletrônicos e assistência técnica...',
```

**Botões** usam o formato:

```ts
{ label: 'Texto do botão', action: { type: 'route', to: '/produtos' }, variant: 'primary' }
```

Tipos de `action`:

| `type` | O que faz | Exemplo |
| --- | --- | --- |
| `route` | Vai para uma página do site | `{ type: 'route', to: '/assistencia' }` |
| `whatsapp` | Abre o WhatsApp de `site.ts` (mensagem opcional) | `{ type: 'whatsapp', message: 'Olá!' }` |
| `external` | Link externo (somente `https://`) | `{ type: 'external', href: 'https://...' }` |
| `directions` | Abre rota no Google Maps até o endereço | `{ type: 'directions' }` |

`variant`: `'primary'` (vermelho), `'secondary'` (contorno) ou `'ghost'` (texto sublinhado).

**Conteúdo provisório**: textos entre colchetes (ex.: `[Serviço a confirmar]`) e itens com `placeholder: true` ainda não são reais. Ao substituir, apague também o `placeholder: true` — a etiqueta "Conteúdo provisório" some sozinha.

## 2. Trocar imagens

1. Coloque o arquivo em uma das pastas:
   - `public/images/produtos/` — fotos das categorias
   - `public/images/loja/` — fachada, interior, equipe
   - `public/images/assistencia/` — bancada técnica
   - `public/images/og/` — imagem de compartilhamento em redes sociais (1200×630)
2. No arquivo de conteúdo, preencha `src` com o caminho **começando em `/images`** (sem `public`):

```ts
image: { src: '/images/produtos/capinhas.jpg', alt: 'Capinhas expostas na loja', placeholderLabel: 'capinhas.jpg' },
```

- `alt` descreve a foto para leitores de tela e para o Google. Sempre preencha.
- Enquanto `src` estiver vazio (`''`), o site mostra um espaço reservado técnico com o nome da foto esperada.
- Recomendações: JPG ou WebP, até ~300 KB, largura entre 1200 e 1600 px. Proporções usadas: categorias 4:5, loja 5:4, fotos da página Sobre 4:5 e 4:3.

Onde ficam as imagens de cada página:

| Imagem | Arquivo / campo |
| --- | --- |
| Categorias | `src/content/produtos.ts` → `categories[].image` |
| Destaques | `src/content/produtos.ts` → `highlights[].image` |
| Fachada (Home) | `src/content/home.ts` → `store.image` |
| Bancada (Assistência) | `src/content/assistencia.ts` → `hero.image` |
| Fotos da loja (Sobre) | `src/content/sobre.ts` → `photos.items` |
| Compartilhamento | `src/content/site.ts` → `shareImage` (ex.: `'/images/og/bh.jpg'`) |

## 3. Adicionar categorias

Arquivo: `src/content/produtos.ts`, lista `categories`.

Copie um bloco inteiro, cole no final da lista (antes do `];`) e altere:

```ts
{
  id: 'smartwatches',              // sem espaços nem acentos; vira /produtos#smartwatches
  name: 'Smartwatches',
  summary: 'Frase curta para cartões.',
  description: 'Texto mais completo para a página Produtos.',
  image: { src: '', alt: 'Smartwatches', placeholderLabel: 'smartwatches.jpg' },
  icon: 'sparkles',                // ver lista de ícones abaixo
  featured: true,                  // true = aparece em "Categorias em destaque" na Home
  whatsappMessage: 'Olá! Gostaria de consultar smartwatches.',
},
```

- A categoria aparece automaticamente na página Produtos, no índice, na cena 03 da Home (as 6 primeiras — ajuste em `home.ts` → `alemDaTela.maxCategories`) e no destaque da Home (se `featured: true`).
- Para **remover**, apague o bloco. Para **reordenar**, mude a posição na lista.
- Ícones disponíveis: `smartphone`, `shield`, `plug`, `cable`, `headphones`, `layers`, `battery`, `wrench`, `scan`, `cpu`, `store`, `message`, `clock`, `map`, `sparkles`, `package`. Para incluir outro ícone da biblioteca Lucide, edite `src/components/ui/Icon.tsx` e `src/content/types.ts` (`IconName`).

**Destaques**: a lista `highlights` (mesmo arquivo) começa vazia e a seção fica oculta. Há um exemplo comentado logo acima dela. Não informe preços.

## 4. Adicionar serviços

Arquivo: `src/content/assistencia.ts`, lista `services`.

```ts
{
  id: 'troca-de-tela',
  title: 'Nome real do serviço',
  description: 'Descrição real, sem prometer prazo ou garantia que não seja praticado.',
  icon: 'smartphone',
},
```

- Remova os três itens marcados com `placeholder: true` quando houver serviços reais.
- Enquanto **todos** os serviços forem provisórios, aparece o aviso definido em `servicesSection.pendingNotice`.
- Etapas do processo: lista `processSteps`.
- Perguntas frequentes: lista `faqs` (`question`, `answer`). Itens com `placeholder: true` aparecem em fonte mono como rascunho.

## 5. Atualizar WhatsApp

Arquivo: `src/content/site.ts`

```ts
whatsapp: {
  number: '5531999999999',          // DDI 55 + DDD + número, só dígitos
  display: '(31) 99999-9999',       // como aparece escrito no site
  defaultMessage: 'Olá! Vim pelo site da BH Eletrônicos e gostaria de atendimento.',
},
```

Todos os botões de WhatsApp do site (cabeçalho, Home, categorias, assistência, contato, rodapé) passam a funcionar. Enquanto `number` estiver vazio, esses botões levam à página Contato e o número aparece como "A definir".

**Onde o WhatsApp aparece:** hoje os botões de WhatsApp e o "Solicitar avaliação" ficam **somente na página Contato** (`src/content/contato.ts` → `cards`). Para mostrar de novo em outros lugares, em `src/config/navigation.ts`:

- `headerConfig.showWhatsappButton: true` → botão no cabeçalho e no menu mobile;
- `floatingWhatsapp.pages: 'all'` → botão verde flutuante em todas as páginas (hoje: `['/contato']`).

Também é possível adicionar um botão em qualquer texto de conteúdo com `action: { type: 'whatsapp', message: '...' }`.

## 6. Atualizar Instagram

Arquivo: `src/content/site.ts`

```ts
instagram: {
  handle: 'bheletronicos',   // somente o nome de usuário, sem @ e sem link
},
```

O link `https://www.instagram.com/<usuário>/` é montado automaticamente no rodapé e na página Contato.

## 7. Atualizar endereço

Arquivo: `src/content/site.ts`, bloco `address`:

```ts
address: {
  street: 'Rua Exemplo',
  number: '123',
  complement: 'Loja 2',
  district: 'Centro',
  city: 'Belo Horizonte',
  state: 'MG',
  zip: '30000-000',
  mapEmbedUrl: '',
},
```

- Com `street` e `city` preenchidos, o endereço aparece no rodapé, na Home e na página Contato, e o botão **Como chegar** passa a abrir o Google Maps.
- **Mapa**: no Google Maps, procure a loja → Compartilhar → Incorporar um mapa → copie **somente** o endereço dentro de `src="..."` e cole em `mapEmbedUrl`. Só são aceitos links que começam com `https://www.google.com/maps/embed`.

Opcionais no mesmo arquivo: `phone` / `phoneDisplay`, `email`, `legal.cnpj`, `url` (domínio final, usado no SEO).

## 8. Alterar horários

Arquivo: `src/content/site.ts`, lista `hours`:

```ts
hours: [
  { days: 'Segunda a sexta', time: '9h às 18h' },
  { days: 'Sábado', time: '9h às 13h' },
  { days: 'Domingo e feriados', time: 'Fechado' },
],
```

Adicione ou remova linhas livremente. Os horários aparecem no rodapé, na Home e na página Contato.

## 9. Mudar cores e fontes

Arquivo: `src/config/theme.ts`

```ts
colors: {
  black: '#09090B',      // fundo principal
  blackSoft: '#141417',  // fundo de blocos
  line: '#26262B',       // linhas e bordas
  white: '#FFFFFF',
  red: '#E53935',        // destaque, botões, luz vermelha do 3D
  redDeep: '#A71919',    // hover dos botões
  gray: '#A1A1AA',       // texto secundário
  grayDim: '#71717A',    // legendas
},
```

**Fontes**: altere `fonts.display` (títulos), `fonts.body` (textos) e `fonts.mono` (etiquetas). Se trocar por outra fonte do Google Fonts, gere o link em https://fonts.google.com e substitua `googleFontsUrl`.

Tamanhos de texto (escala responsiva com `clamp()`): variáveis `--fs-*` no início de `src/styles/base.css`.

Observação: a cor da luz de recorte do 3D em cada cena fica em `src/config/animation.ts` (`rimColor`).

## 10. Ajustar a animação 3D

Arquivo: `src/config/animation.ts`. Os comentários no arquivo explicam cada campo.

**Comprimento e suavidade da rolagem** (`sequenceConfig`):

- `scrollLength`: quantas "telas" de rolagem a sequência dura (desktop, tablet, mobile). Menor = mais rápida.
- `scrub`: suavização (1 = 1 segundo de atraso suave; `true` = sem atraso).
- `introDuration`: duração da revelação inicial com a luz vermelha.
- `ambient`: flutuação discreta e reação ao mouse (`enabled: false` desliga).

**Cenas** (`scenes`): cada uma tem `duration` (proporção do tempo total) e uma `pose` final:

```ts
pose: {
  model:  { position: [x, y, z], rotation: [x, y, z], scale: 1 },
  camera: { position: [x, y, z], target: [x, y, z], fov: 30 },
  lights: { key, fill, rim, rimColor, accent, accentAngle, environment },
  open: 0.55,   // 0 = fechado, 1 = aberto (animação real do GLB)
},
```

- `position`: x = esquerda/direita, y = cima/baixo, z = perto/longe.
- `rotation` em radianos: `3.1416` = meia volta, `1.5708` = um quarto de volta.
- `camera.position[2]` menor = câmera mais perto.
- `tablet` e `mobile` recebem só o que muda em relação ao desktop (o mobile também herda os ajustes de `tablet`). Ex.: no mobile o aparelho fica em `y ≈ 0.75` (parte de cima da tela) para não cobrir os textos.
- Pontos de troca de layout: `breakpoints` (mobile < 768 px, desktop ≥ 1100 px).

**Linhas técnicas da cena 04** (`calloutAnchors`): `node` é o nome de uma peça real do modelo; `offset` é a posição da etiqueta em pixels. Textos das etiquetas: `src/content/home.ts` → `precisao.callouts`.

**Desempenho** (`renderConfig`): limite de densidade de pixels por tipo de tela e critérios para a versão leve.

Dica: em `npm run dev`, abra o console do navegador e digite `__beyond.tl.progress(0.5)` para ver a sequência em qualquer ponto (desative a rolagem antes com `__beyond.tl.scrollTrigger.disable(false)`).

## 11. Substituir o modelo GLB futuramente

1. **Preserve o original** em `modelo-3d/`. Nunca apague essa pasta.
2. Copie o novo arquivo para `public/models/` (ex.: `public/models/novo-aparelho.glb`).
3. Em `src/config/animation.ts` → `modelConfig`:
   - `path`: `'/models/novo-aparelho.glb'`
   - `animationName`: nome da animação interna do novo arquivo (se não existir, o primeiro clipe é usado; sem animação, `open` simplesmente não tem efeito).
   - `targetHeight`: tamanho do aparelho na cena (a escala é normalizada automaticamente).
   - `baseRotation`: correção se o modelo vier deitado ou de costas.
   - `invertAnimation`: o sentido aberto/fechado é detectado sozinho; use `true` só se ficar invertido.
   - `hiddenNodes`: peças a ocultar sem alterar o arquivo.
4. Atualize `calloutAnchors` com nomes de peças que existam no novo modelo. Para listar os nomes, abra o arquivo em https://gltf-viewer.donmccurdy.com ou https://threejs.org/editor.
5. Rode `npm run dev` e ajuste as poses das cenas.

Recomendação: mantenha o arquivo abaixo de ~6 MB. Para comprimir, use `gltf-transform` (texturas WebP/KTX2, geometria com Draco/Meshopt) em uma **cópia**, nunca no original.

## 12. Fazer build e publicar

```bash
npm run build
```

Gera a pasta `dist/` com o site pronto. Para conferir antes de publicar:

```bash
npm run preview
```

Publicação (escolha uma):

- **Netlify**: conecte o repositório ou arraste a pasta `dist/` em app.netlify.com. Comando de build `npm run build`, pasta `dist`.
- **Vercel**: importe o projeto em vercel.com; o Vite é detectado automaticamente.
- **Hospedagem com cPanel / Hostinger**: envie **o conteúdo** de `dist/` para `public_html/` (o arquivo `.htaccess` já vem incluído).

Depois de publicar, preencha `url` em `src/content/site.ts` com o domínio final e faça um novo build (melhora o SEO).

Checklist antes de publicar:

- [ ] WhatsApp, Instagram, endereço e horários preenchidos em `site.ts`
- [ ] Serviços, FAQ, história e diferenciais reais (sem itens `placeholder: true`)
- [ ] Fotos adicionadas e `alt` preenchidos
- [ ] Licença do modelo 3D verificada para uso comercial
- [ ] `npm run build` sem erros
