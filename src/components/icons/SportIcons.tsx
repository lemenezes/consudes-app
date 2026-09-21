import type { ComponentType, SVGProps } from "react";
import { Volleyball } from "lucide-react";

interface SportIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const
};

/** Bola de basquete — círculo com as costuras características. */
export function BasketballIcon({ size = 24, ...props }: SportIconProps) {
  return (
    <svg width={size} height={size} {...baseProps} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="M4.93 4.93c3.75 3.75 3.75 10.39 0 14.14" />
      <path d="M19.07 4.93c-3.75 3.75-3.75 10.39 0 14.14" />
    </svg>
  );
}

/** Bola de futsal — círculo com gomo pentagonal central. */
export function FutsalBallIcon({ size = 24, ...props }: SportIconProps) {
  return (
    <svg width={size} height={size} {...baseProps} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8.2l2.35 1.71-.9 2.77h-2.9l-.9-2.77z" />
      <path d="M12 8.2V4.5" />
      <path d="M9.55 9.91 5.9 8.2" />
      <path d="M14.45 9.91l3.65-1.71" />
      <path d="M10.55 12.68 8.2 16.9" />
      <path d="M13.45 12.68l2.35 4.22" />
    </svg>
  );
}

/** Mão aberta lançando uma bola — representa handebol/balonmano. */
export function HandballIcon({ size = 24, ...props }: SportIconProps) {
  return (
    <svg width={size} height={size} {...baseProps} {...props}>
      <circle cx="19" cy="4" r="1.6" />
      <path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12" />
      <path d="M11 12V5a1.5 1.5 0 0 1 3 0v7" />
      <path d="M14 12V6.5a1.5 1.5 0 0 1 3 0V13" />
      <path d="M17 13v-2a1.5 1.5 0 0 1 3 0v4a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-5.2-3l-1.8-3.1a1.4 1.4 0 0 1 2.4-1.5L9 15" />
    </svg>
  );
}

/** Bola de vôlei de praia — bola sobre uma linha ondulada (areia/mar). */
export function BeachVolleyballIcon({ size = 24, ...props }: SportIconProps) {
  return (
    <svg width={size} height={size} {...baseProps} {...props}>
      <circle cx="12" cy="8" r="5" />
      <path d="M12 3v10" />
      <path d="M7.5 5.5c3 1.5 6 1.5 9 0" />
      <path d="M3 19c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" />
    </svg>
  );
}

/** Mapa slug → ícone, usado nas páginas de listagem e detalhe de modalidades. */
export const modalityIcons: Record<string, ComponentType<SportIconProps>> = {
  baloncesto: BasketballIcon,
  futsal: FutsalBallIcon,
  balonmano: HandballIcon,
  voleibol: Volleyball,
  "voleibol-playa": BeachVolleyballIcon
};

export function getModalityIcon(slug: string): ComponentType<SportIconProps> {
  return modalityIcons[slug] ?? Volleyball;
}
