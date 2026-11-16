import { Link } from 'react-router-dom';
import { site } from '../../content/site';

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" className="logo" aria-label={`${site.name} — página inicial`} onClick={onClick}>
      <span className="logo__primary">{site.wordmark.primary}</span>
      <span className="logo__bar" aria-hidden="true" />
      <span className="logo__secondary">{site.wordmark.secondary}</span>
    </Link>
  );
}
