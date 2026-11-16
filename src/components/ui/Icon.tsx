import {
  BatteryCharging,
  Cable,
  Clock,
  Cpu,
  Headphones,
  Layers,
  MapPin,
  MessageCircle,
  Package,
  PlugZap,
  ScanLine,
  Shield,
  Smartphone,
  Sparkles,
  Store,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '../../content/types';

/** Ícones disponíveis para categorias e serviços (campo `icon` nos arquivos de conteúdo). */
const icons: Record<IconName, LucideIcon> = {
  smartphone: Smartphone,
  shield: Shield,
  plug: PlugZap,
  cable: Cable,
  headphones: Headphones,
  layers: Layers,
  battery: BatteryCharging,
  wrench: Wrench,
  scan: ScanLine,
  cpu: Cpu,
  store: Store,
  message: MessageCircle,
  clock: Clock,
  map: MapPin,
  sparkles: Sparkles,
  package: Package,
};

export function Icon({ name, size = 20, strokeWidth = 1.5 }: { name: IconName; size?: number; strokeWidth?: number }) {
  const Component = icons[name] ?? Package;
  return <Component size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
}
