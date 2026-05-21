import { Gauge, Droplets, Apple, Cherry, Building2 } from 'lucide-react';

export interface IconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
}

const defaultProps = {
  size: 24,
  color: 'currentColor',
  strokeWidth: 2,
};

// --- LUCIDE WRAPPERS ---
export const ContatoreIcon = (props: IconProps) => <Gauge {...defaultProps} {...props} />;
export const RubinettoIcon = (props: IconProps) => <Droplets {...defaultProps} {...props} />;
export const MeloIcon = (props: IconProps) => <Apple {...defaultProps} {...props} />;
export const CiliegioIcon = (props: IconProps) => <Cherry {...defaultProps} {...props} />;
export const BaraccaIcon = (props: IconProps) => <Building2 {...defaultProps} {...props} />;

// --- CUSTOM SVG ICONS ---
export const AmarenoIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="16" r="5" />
    <path d="M11 11c0-4 3-7 6-8" />
    <path d="M17 3c-2 1-3 4-1 6 2-1 3-4 1-6Z" />
  </svg>
);
export const PeroIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5C10.5 5 10.5 8 10 10C9.5 12 5 14 5 18C5 21 8 23 12 23C16 23 19 21 19 18C19 14 14.5 12 14 10C13.5 8 13.5 5 12 5Z" />
    <path d="M12 5V2" />
    <path d="M12 3C15 2 17 4 16 6" />
  </svg>
);

export const UlivoIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="15" rx="4.5" ry="6.5" transform="rotate(-20 12 15)" />
    <path d="M13 9L15 4" />
    <path d="M15 4C13 1 7 2 7 5C7 7 13 6 15 4Z" />
    <path d="M15 4C18 1 23 3 22 6C21 8 16 6 15 4Z" />
  </svg>
);

export const MelogranoIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="14" r="7" />
    <path d="M9 7L8 3L10 5L12 3L14 5L16 3L15 7" />
  </svg>
);

export const FicoIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 6C11.5 6 11 8 10.5 9.5C9 13 5 14.5 5 18C5 21 8 22 12 22C16 22 19 21 19 18C19 14.5 15 13 13.5 9.5C13 8 12.5 6 12 6Z" />
    <path d="M12 6V3" />
    <path d="M10 3H14" />
    <path d="M10.5 9.5C9.5 13 8 16 8 19" opacity="0.4" />
    <path d="M12 11V21" opacity="0.4" />
    <path d="M13.5 9.5C14.5 13 16 16 16 19" opacity="0.4" />
  </svg>
);

export const CacoIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="14" r="7" />
    <path d="M12 2V5" />
    <path d="M8 5C9 7 11 8 12 8C13 8 15 7 16 5" />
    <path d="M12 8C11 10 9 11 7 10" />
    <path d="M12 8C13 10 15 11 17 10" />
  </svg>
);

export const FragolaIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22C16 22 19 15 19 10C19 6 15 5 12 7C9 5 5 6 5 10C5 15 8 22 12 22Z" />
    <path d="M12 2V4" />
    <path d="M12 7C14 5 16 3 18 4" />
    <path d="M12 7C10 5 8 3 6 4" />
    <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    <circle cx="9" cy="15" r="0.5" fill="currentColor" />
    <circle cx="15" cy="15" r="0.5" fill="currentColor" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    <circle cx="9" cy="10" r="0.5" fill="currentColor" />
    <circle cx="15" cy="10" r="0.5" fill="currentColor" />
  </svg>
);

export const AsparagoIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 22V10C10 6 11 4 12 2C13 4 14 6 14 10V22" />
    <path d="M9 13L11 12" />
    <path d="M15 15L13 14" />
    <path d="M9 18L11 17" />
    <path d="M15 8L12 7L9 8" />
  </svg>
);

export const PescoIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="14" r="8" />
    <path d="M12 6C10 9 10 12 12 16" />
    <path d="M12 6C14 4 17 3 18 5C19 7 16 9 12 9" />
  </svg>
);

export const PrugnoIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="14" rx="6" ry="8" />
    <path d="M12 6V11" />
    <path d="M12 6C14 4 17 3 18 5C19 7 16 9 12 9" />
  </svg>
);

export const AlbicoccoIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="14" r="7" />
    <path d="M12 7C11 9 11 12 12 14" />
    <path d="M12 7V4" />
    <path d="M12 7C14 6 15 5 15 3C13 3 12 4 12 7Z" />
  </svg>
);

export const NespoloIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="10" cy="12" r="4" />
    <circle cx="16" cy="14" r="4" />
    <circle cx="12" cy="18" r="4" />
    <path d="M12 2V6" />
    <path d="M12 6L10 8" />
    <path d="M12 6L14 10" />
    <path d="M12 2C15 2 17 4 17 6C17 8 15 9 12 9" />
  </svg>
);

export const ScalaIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 2V22" />
    <path d="M16 2V22" />
    <path d="M8 6H16" />
    <path d="M8 12H16" />
    <path d="M8 18H16" />
  </svg>
);

export const CaminoIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 10V22H16V10" />
    <path d="M7 10H17V12H7Z" />
    <path d="M10 6C10 4 12 4 12 2" />
    <path d="M14 7C14 5 16 5 16 3" />
  </svg>
);

export const ReteIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4L20 20" />
    <path d="M4 20L20 4" />
    <path d="M12 4V20" />
    <path d="M4 12H20" />
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </svg>
);

export const CancelloIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 22V2" />
    <path d="M20 22V2" />
    <path d="M4 6H20" />
    <path d="M4 18H20" />
    <path d="M8 6V18" />
    <path d="M12 6V18" />
    <path d="M16 6V18" />
    <path d="M4 12L12 18" />
    <path d="M12 18L20 12" />
  </svg>
);

export const KiwiIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2.5" opacity="0.5" />
    <path d="M12 3V5" opacity="0.3" />
    <path d="M12 19V21" opacity="0.3" />
    <path d="M3 12H5" opacity="0.3" />
    <path d="M19 12H21" opacity="0.3" />
    <circle cx="12" cy="7.5" r="0.5" fill="currentColor" />
    <circle cx="12" cy="16.5" r="0.5" fill="currentColor" />
    <circle cx="7.5" cy="12" r="0.5" fill="currentColor" />
    <circle cx="16.5" cy="12" r="0.5" fill="currentColor" />
    <circle cx="8.8" cy="8.8" r="0.5" fill="currentColor" />
    <circle cx="15.2" cy="15.2" r="0.5" fill="currentColor" />
    <circle cx="15.2" cy="8.8" r="0.5" fill="currentColor" />
    <circle cx="8.8" cy="15.2" r="0.5" fill="currentColor" />
  </svg>
);

export const LimoneIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 5C19.5 7.5 19.5 11.5 17 15C14.5 18.5 10.5 19.5 8 17C5.5 14.5 5.5 10.5 8 7C10.5 3.5 14.5 2.5 17 5Z" />
    <path d="M17 5L19 3" />
    <path d="M8 17L6 19" />
  </svg>
);

export const BananaIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12C5 17 9 21 14 21C18 21 21 18 21 14C21 10 16 6 13 4C11 2.5 9 2 9 2L8 4C8 4 11 6 12 8C13 10 14 13 13 16C12 18 9 19 7 17C5 15 5 12 5 12Z" />
  </svg>
);

export const UnknownIcon = ({ size = 24, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#ef4444" className={className}>
    <circle cx="12" cy="12" r="10" />
  </svg>
);
