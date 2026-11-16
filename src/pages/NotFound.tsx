import { PageHero } from '../components/sections/PageHero';
import { Seo } from '../components/ui/Seo';

export default function NotFound() {
  return (
    <>
      <Seo seo={{ title: 'Página não encontrada — BH Eletrônicos', description: 'A página procurada não existe.' }} />
      <PageHero
        label="Erro 404"
        index="404"
        title="Página não encontrada."
        text="O endereço pode ter mudado. Volte para o início ou fale com a gente."
        ctas={[
          { label: 'Voltar ao início', action: { type: 'route', to: '/' }, variant: 'primary' },
          { label: 'Contato', action: { type: 'route', to: '/contato' }, variant: 'secondary' },
        ]}
      />
    </>
  );
}
