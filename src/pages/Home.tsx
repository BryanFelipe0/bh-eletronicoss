import { useRef } from 'react';
import { BeyondTheScreen } from '../components/sections/BeyondTheScreen';
import { AssistanceBand, IntroSection, StoreBlock } from '../components/sections/HomeSections';
import { Seo } from '../components/ui/Seo';
import { homeContent } from '../content/home';
import { useReveal } from '../hooks/useReveal';

export default function Home() {
  const rest = useRef<HTMLDivElement>(null);
  useReveal(rest);

  return (
    <>
      <Seo seo={homeContent.seo} />
      <BeyondTheScreen />
      <div ref={rest}>
        <IntroSection />
        <AssistanceBand />
        <StoreBlock />
      </div>
    </>
  );
}
