import { useState } from 'react';
import { imageRevealConfig } from '../../config/animation-ui';
import type { ImageRef } from '../../content/types';
import type { IconName } from '../../content/types';
import { Icon } from './Icon';

interface Props {
  image: ImageRef;
  ratio?: string;
  className?: string;
  icon?: IconName;
  /** Índice técnico exibido no canto do espaço reservado */
  code?: string;
  priority?: boolean;
  /** Parallax leve ao rolar (somente computador) */
  parallax?: boolean;
}

/**
 * Imagem com carregamento progressivo.
 * - Se `image.src` estiver vazio (ou o arquivo não existir), mostra um espaço
 *   reservado técnico com o nome da foto esperada.
 * - Usa lazy loading nativo e aparece suavemente quando termina de carregar.
 */
export function SmartImage({ image, ratio = '4 / 5', className = '', icon, code, priority, parallax }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(image.src) && !failed;
  // Foto real usa a própria proporção (aparece inteira); espaço reservado usa a do layout
  const aspect = hasImage && image.ratio ? image.ratio : ratio;

  return (
    <figure
      className={`smart-image ${className}`.trim()}
      style={{ aspectRatio: aspect, ['--hover-scale' as string]: imageRevealConfig.hoverScale }}
      data-loaded={loaded || !hasImage}
      data-parallax={parallax ? '' : undefined}
    >
      {hasImage ? (
        <img
          src={image.src}
          alt={image.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="placeholder" role="img" aria-label={`${image.alt} (imagem a ser adicionada)`}>
          <span className="placeholder__grid" aria-hidden="true" />
          <span className="placeholder__corner placeholder__corner--tl" aria-hidden="true" />
          <span className="placeholder__corner placeholder__corner--tr" aria-hidden="true" />
          <span className="placeholder__corner placeholder__corner--bl" aria-hidden="true" />
          <span className="placeholder__corner placeholder__corner--br" aria-hidden="true" />
          {icon && (
            <span className="placeholder__icon" aria-hidden="true">
              <Icon name={icon} size={44} strokeWidth={1} />
            </span>
          )}
          <span className="placeholder__meta" aria-hidden="true">
            {code && <span>{code}</span>}
            <span>{image.placeholderLabel ?? 'Imagem'}</span>
            <span className="placeholder__status">Foto em breve</span>
          </span>
        </div>
      )}
    </figure>
  );
}
