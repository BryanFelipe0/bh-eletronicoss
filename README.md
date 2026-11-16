# BH Eletrônicos — Premium Experience 3D

Site institucional multipáginas da **BH Eletrônicos**: loja física de acessórios e eletrônicos com assistência técnica para smartphones.

Não é um e-commerce: o objetivo é apresentar a loja, as categorias de produtos e a assistência técnica, gerando contatos pelo WhatsApp e visitas ao endereço físico.

> Para alterar textos, imagens, contatos, cores ou a animação 3D, consulte **[GUIA-DE-EDICAO.md](GUIA-DE-EDICAO.md)**.

## Tecnologias

- React 19 + TypeScript + Vite
- React Router (5 páginas, carregadas sob demanda)
- Three.js + React Three Fiber + Drei (experiência 3D)
- GSAP + ScrollTrigger (animação controlada pela rolagem)
- CSS próprio (sem biblioteca de UI) + Lucide React (ícones)

## Requisitos

- Node.js 20 ou superior (testado com Node 26)
- npm

## Iniciar o site (Windows, sem terminal)

Dê dois cliques em **`iniciar-site.bat`** na pasta do projeto. Na primeira vez ele instala as dependências; depois inicia o site e abre o navegador sozinho. Para encerrar, feche a janela preta.

## Comandos

```bash
npm install
```

```bash
npm run dev
```

Abre o site em modo de desenvolvimento em `http://localhost:5173`.

```bash
npm run build
```

Verifica os tipos (TypeScript) e gera a versão final em `dist/`.

```bash
npm run preview
```

Mostra localmente a versão gerada em `dist/`, igual à que será publicada.

## Estrutura

```
modelo-3d/                    ← arquivo GLB ORIGINAL (não é usado pelo site, apenas preservado)
public/
├── models/smartphone-fold.glb ← cópia do GLB usada pelo site
├── images/                    ← fotos (produtos/, loja/, assistencia/, og/)
├── _redirects, .htaccess      ← regras para hospedagens (rotas do React Router)
src/
├── content/                  ← TODO o conteúdo editável (textos, categorias, contatos)
├── config/                   ← tema (cores/fontes), menu, animações e 3D
├── components/
│   ├── layout/               ← cabeçalho, rodapé, logo
│   ├── ui/                   ← botões, imagens, ícones, SEO
│   ├── sections/             ← blocos de página (inclui a sequência 3D)
│   └── three/                ← canvas, modelo, luzes e alternativa sem 3D
├── pages/                    ← Home, Produtos, Assistencia, Sobre, Contato
├── hooks/                    ← detecção de tela, movimento reduzido, WebGL
├── lib/                      ← links (WhatsApp, mapa) e GSAP
└── styles/                   ← CSS (base, componentes, 3D, páginas)
```

## Experiência 3D (Home)

A sequência "Beyond the Screen — Além da tela" usa o modelo fornecido (`apple_iphone_duo_fold_star_white_2026_animated.glb`).

Resultado da inspeção do arquivo:

| Item | Resultado |
| --- | --- |
| Formato | glTF 2.0 binário (Sketchfab), 5,4 MB |
| Geometria | 49 malhas, ~78 mil vértices, 1 esqueleto (skin) |
| Materiais | 30 materiais PBR, extensão `KHR_materials_clearcoat` (suportada pelo Three.js) |
| Texturas | 10 imagens embutidas (PNG/JPEG) |
| Animação | 1 clipe `open-close`, 2 s, 6 canais (dobradiça, eixo e uma metade do aparelho) |
| Sentido da animação | O clipe começa **aberto** e termina **fechado** — o site detecta e inverte automaticamente |
| Peças reais usadas nas linhas técnicas | `Back_Cam_Base_10` (câmera), `Axle_9` (eixo da dobradiça), `Side_Buttons_Cap_36` (botões) |

Como funciona:

- Uma única instância do canvas e do modelo durante toda a sequência.
- A timeline do GSAP interpola um objeto de estado; o Three.js lê esse estado a cada quadro (o React não re-renderiza durante a rolagem).
- O tempo da animação interna do GLB acompanha o progresso da rolagem (reversível).
- O palco usa `position: sticky` (equivalente ao `pin`, mais estável em celulares).
- A renderização pausa quando a seção sai da tela; a densidade de pixels é limitada e reduzida automaticamente se o desempenho cair.

Alternativas:

- **Sem WebGL ou aparelho com poucos recursos**: ilustração técnica leve em SVG e conteúdo em layout normal.
- **`prefers-reduced-motion`**: sem animação de rolagem; o 3D aparece estático na primeira tela e as cenas viram seções normais.
- **Falha ao carregar o modelo**: a mesma alternativa leve é exibida; o restante do site continua funcionando.

## Publicação

O site é estático (pasta `dist/`). Qualquer hospedagem de arquivos estáticos funciona:

- **Netlify**: comando `npm run build`, pasta `dist`. O arquivo `public/_redirects` já trata as rotas.
- **Vercel**: detecta Vite automaticamente; `vercel.json` já trata as rotas.
- **Hospedagem Apache (cPanel/Hostinger)**: envie o conteúdo de `dist/` para `public_html`. O `.htaccess` já trata as rotas.

Nada é publicado automaticamente por este projeto.

## Pendências de conteúdo

Os dados abaixo **não foram fornecidos** e aparecem como "A definir" no site, sem gerar links falsos:

- Número de WhatsApp, Instagram, endereço, horários, mapa → `src/content/site.ts`
- Serviços reais de assistência e respostas do FAQ → `src/content/assistencia.ts`
- História, diferenciais e fotos da loja → `src/content/sobre.ts`
- Fotos de produtos → `public/images/produtos/` + `src/content/produtos.ts`
- Domínio final (SEO, link canônico) → `site.url` em `src/content/site.ts`

## Observações sobre o modelo 3D

- O modelo vem do Sketchfab (autor: extraakash) sob a licença *Sketchfab Standard*. Confirme se a licença adquirida permite uso comercial no site.
- O modelo representa um aparelho com logotipo de uma marca registrada na traseira. Se preferir não exibi-lo, adicione `'Back_Logo_20'` em `hiddenNodes` (`src/config/animation.ts`) — o arquivo original não é alterado.
- Para reduzir o tempo de carregamento em redes móveis, o GLB pode ser comprimido futuramente (ex.: `gltf-transform` com texturas WebP/KTX2), mantendo o original preservado.
