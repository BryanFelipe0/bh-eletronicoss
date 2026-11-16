import { useGSAP } from '@gsap/react';
import { ChevronsLeftRight } from 'lucide-react';
import { useCallback, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import type { ImageRef } from '../../content/types';
import { gsap } from '../../lib/gsap';

interface Props {
  /** Foto do aparelho com defeito */
  before: ImageRef;
  /** Foto do aparelho consertado */
  after: ImageRef;
  beforeLabel: string;
  afterLabel: string;
  /** Texto de ajuda exibido abaixo ("Arraste para comparar") */
  hint: string;
  /** Proporção das fotos (largura / altura) */
  ratio: string;
}

/**
 * Comparador "antes e depois" arrastável.
 * Arrastar para a ESQUERDA mostra o aparelho quebrado (antes);
 * arrastar para a DIREITA mostra o aparelho consertado (depois).
 *
 * Leve para o celular: a posição é uma variável CSS atualizada direto no
 * elemento (sem re-renderizar o React), e `touch-action: pan-y` mantém a
 * rolagem vertical da página funcionando normalmente.
 */
export function BeforeAfter({ before, after, beforeLabel, afterLabel, hint, ratio }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const pos = useRef(50);
  const dragging = useRef(false);
  /** Depois que a pessoa mexe, a animação de dica não move mais a barra */
  const touched = useRef(false);

  const setPos = useCallback((value: number) => {
    const p = Math.min(100, Math.max(0, value));
    pos.current = p;
    root.current?.style.setProperty('--pos', `${p}%`);
    handle.current?.setAttribute('aria-valuenow', String(Math.round(p)));
  }, []);

  const fromPointer = (clientX: number) => {
    const rect = root.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(((clientX - rect.left) / rect.width) * 100);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    touched.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    fromPointer(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) fromPointer(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    touched.current = true;
    const step = e.shiftKey ? 10 : 4;
    if (e.key === 'ArrowLeft') setPos(pos.current - step);
    else if (e.key === 'ArrowRight') setPos(pos.current + step);
    else if (e.key === 'Home') setPos(0);
    else if (e.key === 'End') setPos(100);
    else return;
    e.preventDefault();
  };

  // Ao aparecer na tela, a barra faz um pequeno movimento para mostrar que dá para arrastar
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const state = { p: 50 };
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
            onUpdate: () => {
              if (!touched.current) setPos(state.p);
            },
          })
          .to(state, { p: 72, duration: 0.8, ease: 'power2.inOut' })
          .to(state, { p: 28, duration: 1.1, ease: 'power2.inOut' })
          .to(state, { p: 50, duration: 0.8, ease: 'power2.inOut' });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <figure className="before-after">
      <div
        ref={root}
        className="before-after__stage"
        style={{ aspectRatio: ratio, ['--pos' as string]: '50%' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Fundo: ANTES (aparece à direita da barra) */}
        <img className="before-after__img" src={before.src} alt={before.alt} loading="lazy" decoding="async" draggable={false} />
        {/* Por cima: DEPOIS (aparece à esquerda da barra) */}
        <div className="before-after__after" aria-hidden="true">
          <img className="before-after__img" src={after.src} alt="" loading="lazy" decoding="async" draggable={false} />
        </div>
        <span className="before-after__label before-after__label--after">{afterLabel}</span>
        <span className="before-after__label before-after__label--before">{beforeLabel}</span>

        <div className="before-after__divider" aria-hidden="true" />
        <button
          ref={handle}
          type="button"
          className="before-after__handle"
          role="slider"
          aria-label={`Comparar ${beforeLabel.toLowerCase()} e ${afterLabel.toLowerCase()}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={50}
          aria-valuetext={`${afterLabel} à esquerda, ${beforeLabel.toLowerCase()} à direita`}
          onKeyDown={onKeyDown}
        >
          <ChevronsLeftRight size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <figcaption className="before-after__hint">{hint}</figcaption>
      <span className="sr-only">{after.alt}</span>
    </figure>
  );
}
