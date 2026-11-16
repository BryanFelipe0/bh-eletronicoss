import { useGSAP } from '@gsap/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { breakpoints, calloutAnchors, scenes, sequenceConfig } from '../../config/animation';
import { homeContent } from '../../content/home';
import { categories } from '../../content/produtos';
import { site } from '../../content/site';
import { getBreakpoint, isLowEndDevice, supportsWebGL, useBreakpoint, useReducedMotion } from '../../hooks/useMedia';
import { gsap } from '../../lib/gsap';
import { createSequenceState, posesFor, type SequenceState } from '../three/sequenceState';
import { SceneFallback, ThreeErrorBoundary } from '../three/SceneFallback';
import type { CalloutRefs } from '../three/Stage';
import { CtaButton, CtaGroup } from '../ui/CtaButton';
import { Eyebrow } from '../ui/Primitives';

// O canvas 3D (Three.js) só é baixado quando for realmente usado
const Stage = lazy(() => import('../three/Stage'));

const c = homeContent.cinematic;

/**
 * BEYOND THE SCREEN — ALÉM DA TELA
 * Sequência cinematográfica da Home, controlada pela rolagem (GSAP ScrollTrigger + scrub).
 *
 * Arquitetura:
 *  - Um único canvas 3D fixo (position: sticky) dentro de uma seção alta.
 *  - Uma timeline GSAP interpola um objeto de estado simples (`stateRef`);
 *    o Three.js lê esse estado a cada quadro. O React não re-renderiza durante a rolagem.
 *  - Poses, durações, luzes e câmera ficam em src/config/animation.ts.
 *  - Textos ficam em src/content/home.ts.
 */
export function BeyondTheScreen() {
  const reducedMotion = useReducedMotion();
  const breakpoint = useBreakpoint();
  const [can3D] = useState(() => supportsWebGL() && !isLowEndDevice());
  const [failed, setFailed] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [active, setActive] = useState(true);

  const mode: 'cinematic' | 'static' = reducedMotion || !can3D ? 'static' : 'cinematic';
  const show3D = can3D && !failed;

  const sectionRef = useRef<HTMLElement>(null);
  const stateRef = useRef<SequenceState>(createSequenceState(getBreakpoint()));
  const indicatorRefs = useRef<(HTMLLIElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);

  const callouts: CalloutRefs = {
    root: useRef<HTMLDivElement>(null),
    labels: useRef<(HTMLDivElement | null)[]>([]),
    lines: useRef<(SVGLineElement | null)[]>([]),
    dots: useRef<(SVGCircleElement | null)[]>([]),
  };

  const onModelReady = useCallback(() => setModelReady(true), []);

  // Pausa a renderização 3D quando a seção não está visível
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '100px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Movimento ambiente: reação discreta ao ponteiro (somente mouse/trackpad)
  useEffect(() => {
    if (mode !== 'cinematic' || !window.matchMedia('(pointer: fine)').matches) return;
    const st = stateRef.current;
    const toX = gsap.quickTo(st, 'pointerX', { duration: 1.4, ease: 'power3' });
    const toY = gsap.quickTo(st, 'pointerY', { duration: 1.4, ease: 'power3' });
    const onMove = (e: PointerEvent) => {
      toX((e.clientX / window.innerWidth) * 2 - 1);
      toY((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mode]);

  // Revelação inicial (cena 01): a luz vermelha varre o aparelho ao carregar
  useEffect(() => {
    const st = stateRef.current;
    st.ambient = mode === 'cinematic' ? 1 : 0;
    if (!modelReady) return;
    if (mode === 'static') {
      st.intro = 1;
      return;
    }
    const tween = gsap.to(st, { intro: 1, duration: sequenceConfig.introDuration, ease: 'power2.inOut' });
    return () => {
      tween.kill();
      st.intro = 1;
    };
  }, [modelReady, mode]);

  // Entrada dos textos da primeira tela (independente do 3D)
  useGSAP(
    () => {
      if (mode !== 'cinematic' || window.scrollY > 10) return;
      gsap.from('[data-intro]', { autoAlpha: 0, y: 32, duration: 1.1, ease: 'power3.out', stagger: 0.09, delay: 0.25 });
      gsap.from('.hero-rule', { scaleX: 0, transformOrigin: 'left center', duration: 1.6, ease: 'power3.inOut', delay: 0.2 });
    },
    { scope: sectionRef, dependencies: [mode] },
  );

  // Timeline principal controlada pela rolagem
  useGSAP(
    () => {
      if (mode !== 'cinematic') {
        // Modo estático: pose da cena 01 sem animação
        Object.assign(stateRef.current, posesFor(getBreakpoint())[0], { callouts: 0 });
        return;
      }
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: `(min-width: ${breakpoints.desktop}px)`,
          tablet: `(min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 0.02}px)`,
          mobile: `(max-width: ${breakpoints.tablet - 0.02}px)`,
        },
        (ctx) => {
          const cond = ctx.conditions ?? {};
          const bp = cond.desktop ? 'desktop' : cond.tablet ? 'tablet' : 'mobile';
          const poses = posesFor(bp);
          const st = stateRef.current;
          Object.assign(st, poses[0], { callouts: 0 });

          const q = gsap.utils.selector(sectionRef);
          const sceneEls = scenes.map((s) => q(`[data-scene="${s.id}"]`)[0] as HTMLElement);
          gsap.set(sceneEls.slice(1), { autoAlpha: 0 });

          const starts: number[] = [];
          let total = 0;
          scenes.forEach((s) => {
            starts.push(total);
            total += s.duration;
          });

          const setIndicator = (time: number, progress: number) => {
            let current = 0;
            starts.forEach((start, i) => {
              if (time >= start + scenes[i].duration * 0.35) current = i;
            });
            indicatorRefs.current.forEach((li, i) => li?.toggleAttribute('data-active', i === current));
            progressRef.current?.style.setProperty('--progress', progress.toFixed(4));
          };

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: sequenceConfig.scrub,
              invalidateOnRefresh: true,
              onUpdate: (self) => setIndicator(self.animation ? self.animation.time() : 0, self.progress),
            },
          });

          // CENA 01 → saída dos textos da primeira tela
          const d0 = scenes[0].duration;
          tl.to(sceneEls[0], { autoAlpha: 0, y: -48, duration: d0 * 0.5, ease: 'power1.in' }, d0 * 0.35);

          scenes.forEach((scene, i) => {
            if (i === 0) return;
            const S = starts[i];
            const d = scene.duration;
            const el = sceneEls[i];

            // Pose 3D (modelo, câmera, luzes, abertura do GLB)
            tl.to(st, { ...poses[i], duration: d * 0.75, ease: 'power2.inOut' }, S);

            // Texto da cena entra
            tl.fromTo(el, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: d * 0.25, ease: 'power2.out' }, S + d * 0.45);

            // Texto da cena anterior sai (exceto a cena 01, tratada acima)
            if (i < scenes.length - 1) {
              const next = scenes[i + 1];
              tl.to(el, { autoAlpha: 0, y: -36, duration: next.duration * 0.2, ease: 'power1.in' }, starts[i + 1]);
            }
          });

          // CENA 03 → transição da tela do aparelho para o editorial de categorias
          const s3 = scenes.findIndex((s) => s.id === 'alem-da-tela');
          if (s3 > 0) {
            const S = starts[s3];
            const d = scenes[s3].duration;
            tl.fromTo(
              q('.editorial__veil'),
              { clipPath: 'circle(0% at 50% 50%)' },
              { clipPath: 'circle(75% at 50% 50%)', duration: d * 0.3, ease: 'power2.inOut' },
              S + d * 0.45,
            );
            tl.fromTo(
              q('.editorial__item'),
              { autoAlpha: 0, y: 24 },
              { autoAlpha: 1, y: 0, duration: d * 0.2, stagger: d * 0.025, ease: 'power2.out' },
              S + d * 0.6,
            );
          }

          // CENA 04 → linhas técnicas sobre peças reais do modelo
          const s4 = scenes.findIndex((s) => s.id === 'precisao');
          if (s4 > 0) {
            const S = starts[s4];
            const d = scenes[s4].duration;
            tl.fromTo(st, { callouts: 0 }, { callouts: 1, duration: d * 0.25, ease: 'power2.out' }, S + d * 0.6);
            if (s4 < scenes.length - 1) tl.to(st, { callouts: 0, duration: scenes[s4 + 1].duration * 0.15 }, starts[s4 + 1]);
          }

          // CENA 05 → revelação da marca
          const s5 = scenes.findIndex((s) => s.id === 'revelacao');
          if (s5 > 0) {
            const S = starts[s5];
            const d = scenes[s5].duration;
            tl.fromTo(
              q('.brand-reveal__word'),
              { yPercent: 105 },
              { yPercent: 0, duration: d * 0.3, stagger: d * 0.06, ease: 'power3.out' },
              S + d * 0.45,
            );
            tl.fromTo(q('.brand-reveal__rule'), { scaleX: 0 }, { scaleX: 1, duration: d * 0.3, ease: 'power2.inOut' }, S + d * 0.55);
          }

          // Pausa final para a marca permanecer na tela antes de liberar a rolagem
          tl.to({}, { duration: 0.35 });
          setIndicator(0, 0);

          // Ferramenta de depuração (somente em desenvolvimento): window.__beyond.tl.progress(0.5)
          if (import.meta.env.DEV) (window as unknown as { __beyond: unknown }).__beyond = { tl, state: st, starts };

          return () => {
            Object.assign(st, poses[0], { callouts: 0 });
          };
        },
      );
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [mode] },
  );

  const len = sequenceConfig.scrollLength[breakpoint];
  const sceneCategories = categories.slice(0, c.alemDaTela.maxCategories);
  const hideFromAT = mode === 'cinematic';

  return (
    <section
      ref={sectionRef}
      className={`beyond beyond--${mode}`}
      style={{ ['--len' as string]: len }}
      aria-label={c.conceptLabel}
    >
      <div className="beyond__stage">
        <div className="beyond__canvas">
          {show3D ? (
            <ThreeErrorBoundary fallback={<SceneFallback />} onError={() => setFailed(true)}>
              <Suspense fallback={null}>
                <Stage
                  state={stateRef.current}
                  breakpoint={breakpoint}
                  active={active}
                  callouts={mode === 'cinematic' ? callouts : undefined}
                  onModelReady={onModelReady}
                  onProgress={setLoadProgress}
                />
              </Suspense>
            </ThreeErrorBoundary>
          ) : (
            <SceneFallback />
          )}
        </div>

        {show3D && !modelReady && (
          <p className="beyond__loader" role="status" aria-live="polite">
            <span className="beyond__loader-bar" style={{ ['--p' as string]: loadProgress / 100 }} />
            <span>Carregando 3D · {Math.round(loadProgress)}%</span>
          </p>
        )}

        {mode === 'cinematic' && (
          <div className="callouts" ref={callouts.root} aria-hidden="true">
            <svg className="callouts__svg">
              {calloutAnchors.map((a, i) => (
                <g key={a.id}>
                  <line ref={(el) => void (callouts.lines.current[i] = el)} />
                  <circle ref={(el) => void (callouts.dots.current[i] = el)} r="3.5" />
                </g>
              ))}
            </svg>
            {calloutAnchors.map((a, i) => {
              const text = c.precisao.callouts[a.id];
              return (
                <div key={a.id} className="callout" ref={(el) => void (callouts.labels.current[i] = el)}>
                  <span className="callout__code">{text?.code}</span>
                  <span className="callout__label">{text?.label ?? a.id}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* CENA 01 — O DESPERTAR */}
        <div className="scene scene--despertar" data-scene="despertar">
          <div className="container scene__inner">
            <div className="hero-copy">
              <Eyebrow index={c.despertar.index} className="hero-copy__eyebrow">
                <span data-intro>{c.despertar.eyebrow}</span>
              </Eyebrow>
              <h1 className="display-hero" data-intro>
                {c.despertar.title}
              </h1>
              <span className="hero-rule" aria-hidden="true" />
              <p className="lead hero-copy__text" data-intro>
                {c.despertar.text}
              </p>
              <div data-intro>
                <CtaGroup ctas={c.despertar.ctas} />
              </div>
            </div>
          </div>
          <div className="container scene__footer" data-intro>
            <span className="mono-caption">{c.conceptLabel}</span>
            {mode === 'cinematic' && (
              <span className="scroll-hint">
                {c.scrollHint}
                <ArrowDown size={14} strokeWidth={1.5} aria-hidden="true" />
              </span>
            )}
          </div>
        </div>

        {/* CENA 02 — A TRANSFORMAÇÃO */}
        <div className="scene scene--transformacao" data-scene="transformacao" aria-hidden={hideFromAT}>
          <div className="container scene__inner">
            <div className="caption-block">
              <Eyebrow index={c.transformacao.index}>{c.transformacao.eyebrow}</Eyebrow>
              <h2 className="display-md">{c.transformacao.title}</h2>
              <p className="body-muted">{c.transformacao.text}</p>
            </div>
          </div>
        </div>

        {/* CENA 03 — ALÉM DA TELA */}
        <div className="scene scene--alem" data-scene="alem-da-tela">
          <div className="editorial__veil">
            <div className="container editorial">
              <header className="editorial__header">
                <Eyebrow index={c.alemDaTela.index}>{c.alemDaTela.eyebrow}</Eyebrow>
                <h2 className="display-lg">{c.alemDaTela.title}</h2>
                <p className="body-muted">{c.alemDaTela.text}</p>
              </header>
              <ol className="editorial__list">
                {sceneCategories.map((cat, i) => (
                  <li key={cat.id} className="editorial__item">
                    <Link to={`/produtos#${cat.id}`} className="editorial__link">
                      <span className="editorial__num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="editorial__name">{cat.name}</span>
                      <span className="editorial__summary">{cat.summary}</span>
                      <ArrowUpRight className="editorial__arrow" size={18} strokeWidth={1.5} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ol>
              <div className="editorial__item">
                <CtaButton cta={c.alemDaTela.cta} />
              </div>
            </div>
          </div>
        </div>

        {/* CENA 04 — PRECISÃO EM CADA DETALHE */}
        <div className="scene scene--precisao" data-scene="precisao">
          <div className="container scene__inner">
            <div className="tech-block">
              <Eyebrow index={c.precisao.index}>{c.precisao.eyebrow}</Eyebrow>
              <h2 className="display-lg">{c.precisao.title}</h2>
              <p className="body-muted">{c.precisao.text}</p>
              <ul className="tech-block__specs" aria-label="Peças destacadas">
                {calloutAnchors.map((a) => (
                  <li key={a.id}>
                    <span>{c.precisao.callouts[a.id]?.code}</span> {c.precisao.callouts[a.id]?.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CENA 05 — A REVELAÇÃO DA MARCA */}
        <div className="scene scene--revelacao" data-scene="revelacao">
          <div className="container scene__inner">
            <div className="brand-reveal">
              <Eyebrow index={c.revelacao.index}>{c.revelacao.eyebrow}</Eyebrow>
              <h2 className="brand-reveal__title" aria-label={site.name}>
                <span className="brand-reveal__mask" aria-hidden="true">
                  <span className="brand-reveal__word brand-reveal__word--primary">{site.wordmark.primary}</span>
                </span>
                <span className="brand-reveal__mask" aria-hidden="true">
                  <span className="brand-reveal__word">{site.wordmark.secondary}</span>
                </span>
              </h2>
              <span className="brand-reveal__rule" aria-hidden="true" />
              <CtaGroup ctas={c.revelacao.ctas} />
            </div>
          </div>
        </div>

        {mode === 'cinematic' && (
          <div className="beyond__indicator" aria-hidden="true">
            <span className="beyond__progress" ref={progressRef} />
            <ol>
              {scenes.map((s, i) => (
                <li key={s.id} ref={(el) => void (indicatorRefs.current[i] = el)}>
                  {String(i + 1).padStart(2, '0')}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
