# Publicação — bheletronicos.com.br

Mesmo padrão de segurança do site da BF (bfwebcomerce.com.br), conferido em 23/11/2026:

| Proteção | Como fica |
| --- | --- |
| Hospedagem | GitHub Pages (repositório `BryanFelipe0/bh-eletronicoss`) |
| DNS | Servidores do próprio Registro.br |
| DNSSEC | Ativo (vem automático com o DNS do Registro.br) |
| Verificação do domínio no GitHub | Registro TXT `_github-pages-challenge-bryanfelipe0` |
| HTTPS | Certificado gratuito Let's Encrypt emitido pelo GitHub + "Enforce HTTPS" |
| `www` | Redireciona para o endereço principal |
| HTML | `meta referrer strict-origin-when-cross-origin` + endereço canônico |

O site já está preparado: `public/CNAME`, `base: '/'` no `vite.config.ts`, `site.url` em `src/content/site.ts`, `robots.txt` e `sitemap.xml`.

## Passo 1 — Comprar o domínio (você)

1. Acesse https://registro.br e entre com sua conta (CPF ou CNPJ).
2. Pesquise `bheletronicos.com.br` e conclua o registro.
3. Em **Servidores DNS**, mantenha **"Utilizar os servidores DNS do Registro.br"**.

## Passo 2 — Verificar o domínio no GitHub (você)

1. No GitHub: foto do perfil → **Settings** → **Pages** (menu da esquerda, em "Code, planning, and automation").
2. **Add a domain** → digite `bheletronicos.com.br` → **Add domain**.
3. O GitHub mostra um registro TXT. Anote o **nome** (`_github-pages-challenge-bryanfelipe0`) e o **valor** (código que ele gerar).
4. Deixe essa tela aberta; você volta nela no fim do passo 3.

## Passo 3 — Registros no DNS (você, no Registro.br)

Em **Meus domínios → bheletronicos.com.br → DNS → Editar zona**, adicione:

| Tipo | Nome | Valor |
| --- | --- | --- |
| A | (vazio) | 185.199.108.153 |
| A | (vazio) | 185.199.109.153 |
| A | (vazio) | 185.199.110.153 |
| A | (vazio) | 185.199.111.153 |
| AAAA | (vazio) | 2606:50c0:8000::153 |
| AAAA | (vazio) | 2606:50c0:8001::153 |
| AAAA | (vazio) | 2606:50c0:8002::153 |
| AAAA | (vazio) | 2606:50c0:8003::153 |
| CNAME | www | bryanfelipe0.github.io |
| TXT | _github-pages-challenge-bryanfelipe0 | (valor do passo 2) |

Salve. Depois volte ao GitHub (passo 2) e clique em **Verify**. Pode levar de alguns minutos a algumas horas para o DNS propagar.

## Passo 4 — Ligar o domínio no repositório (você)

1. Repositório `bh-eletronicoss` → **Settings** → **Pages**.
2. Em **Custom domain**, digite `bheletronicos.com.br` → **Save**.
3. Aguarde o "DNS check successful".

## Passo 5 — Publicar (Claude, com sua confirmação)

O envio (`git push`) para o GitHub coloca o site no ar pelo domínio novo.

## Passo 6 — Cadeado HTTPS (você)

Quando o GitHub terminar de emitir o certificado, marque **Enforce HTTPS** em Settings → Pages.

## Conferência final

- https://bheletronicos.com.br abre com cadeado
- http://bheletronicos.com.br e https://www.bheletronicos.com.br redirecionam para https://bheletronicos.com.br
- As 5 páginas abrem direto pelo endereço (ex.: https://bheletronicos.com.br/contato)
