import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Evita recálculos quando a barra do navegador mobile aparece/desaparece.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
