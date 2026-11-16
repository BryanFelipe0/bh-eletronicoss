import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import type { RefObject } from 'react';
import { imageRevealConfig, parallaxConfig, revealConfig, titleRevealConfig } from '../config/animation-ui';
import { gsap, ScrollTrigger } from '../lib/gsap';

gsap.registerPlugin(SplitText);

/**
 * Animações de entrada do conteúdo, dentro do container informado.
 * Marque os elementos no JSX com:
 *  - data-reveal   → bloco sobe e aparece (itens próximos aparecem em sequência)
 *  - data-split    → título aparece linha por linha
 *  - data-draw     → linha se desenha da esquerda para a direita
 *  - .smart-image  → fotos são reveladas automaticamente
 *  - data-parallax → foto com parallax leve (somente computador)
 *
 * Tudo roda uma única vez por elemento e somente com transform/opacity/clip-path,
 * que são leves para o celular. Com "reduzir movimento" ativado, nada é animado.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          desktop: `(min-width: ${parallaxConfig.minWidth}px) and (hover: hover) and (pointer: fine)`,
        },
        (ctx) => {
          const { motion, desktop } = ctx.conditions ?? {};
          const root = scope.current;
          if (!motion || !root) return;
          const all = <T extends Element = HTMLElement>(selector: string) => gsap.utils.toArray<T>(selector, root);

          // 1. Blocos: aparecem em sequência quando entram juntos na tela
          const blocks = all('[data-reveal]');
          if (blocks.length) {
            gsap.set(blocks, { autoAlpha: 0, y: revealConfig.distance });
            ScrollTrigger.batch(blocks, {
              start: revealConfig.start,
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  autoAlpha: 1,
                  y: 0,
                  duration: revealConfig.duration,
                  ease: revealConfig.ease,
                  stagger: revealConfig.stagger,
                  overwrite: true,
                  clearProps: 'transform',
                }),
            });
          }

          // 2. Fotos: cortina de baixo para cima + zoom que se acomoda
          if (imageRevealConfig.enabled) {
            all('.smart-image').forEach((figure) => {
              const media = figure.querySelector('img, .placeholder');
              const tl = gsap.timeline({
                scrollTrigger: { trigger: figure, start: imageRevealConfig.start, once: true },
                onComplete: () => figure.classList.add('is-revealed'),
              });
              tl.fromTo(
                figure,
                { clipPath: 'inset(100% 0% 0% 0%)' },
                { clipPath: 'inset(0% 0% 0% 0%)', duration: imageRevealConfig.duration, ease: imageRevealConfig.ease, clearProps: 'clipPath' },
              );
              if (media) {
                tl.fromTo(
                  media,
                  { scale: imageRevealConfig.startScale },
                  { scale: 1, duration: imageRevealConfig.duration + 0.5, ease: 'power3.out', clearProps: 'transform' },
                  0,
                );
              }
            });
          }

          // 3. Títulos linha por linha (as linhas são recalculadas se a fonte ou a tela mudarem)
          if (titleRevealConfig.enabled) {
            all('[data-split]').forEach((title) => {
              SplitText.create(title, {
                type: 'lines',
                mask: 'lines',
                autoSplit: true,
                onSplit: (self) =>
                  gsap.from(self.lines, {
                    yPercent: 110,
                    duration: titleRevealConfig.duration,
                    ease: titleRevealConfig.ease,
                    stagger: titleRevealConfig.stagger,
                    scrollTrigger: { trigger: title, start: revealConfig.start, once: true },
                  }),
              });
            });
          }

          // 4. Linhas que se desenham
          all('[data-draw]').forEach((line) => {
            gsap.from(line, {
              scaleX: 0,
              transformOrigin: 'left center',
              duration: 1.2,
              ease: 'power3.inOut',
              scrollTrigger: { trigger: line, start: revealConfig.start, once: true },
            });
          });

          // 5. Parallax leve nas fotos (somente computador)
          if (desktop && parallaxConfig.enabled) {
            all('[data-parallax]').forEach((el) => {
              gsap.fromTo(
                el,
                { y: -parallaxConfig.distance },
                {
                  y: parallaxConfig.distance,
                  ease: 'none',
                  scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
                },
              );
            });
          }

          ScrollTrigger.refresh();
        },
      );
      return () => mm.revert();
    },
    { scope, dependencies: deps },
  );
}
