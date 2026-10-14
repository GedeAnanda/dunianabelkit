import React from 'react';
import { INK } from '../shared/theme';

/**
 * Ikon generik Nabel Kit (flat, outline tebal, tanpa logo/merek). viewBox 0 0 100 100.
 * Pakai <Icon name="phone" x={..} y={..} size={..} /> — (x, y) = tengah.
 */
const S = { stroke: INK, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
const line = (d: string, w = 5, color = INK) => <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;

const ICONS = {
  phone: () => (
    <>
      <rect x={28} y={8} width={44} height={84} rx={10} fill="#3B3852" {...S} />
      <rect x={34} y={18} width={32} height={60} rx={4} fill="#BFE6FF" />
      <circle cx={50} cy={85} r={3.5} fill="#FFFFFF" />
    </>
  ),
  satellite: () => (
    <>
      <rect x={6} y={38} width={26} height={24} rx={3} fill="#3D5BD9" {...S} />
      <rect x={68} y={38} width={26} height={24} rx={3} fill="#3D5BD9" {...S} />
      {line('M32 50 L68 50')}
      <rect x={38} y={34} width={24} height={32} rx={6} fill="#F2B53A" {...S} />
      {line('M50 34 L50 22')}
      <circle cx={50} cy={19} r={4} fill="#FF5A5F" {...S} strokeWidth={3} />
    </>
  ),
  clock: () => (
    <>
      <circle cx={50} cy={52} r={38} fill="#FFFFFF" {...S} />
      {line('M50 52 L50 30', 6)}
      {line('M50 52 L66 60', 6, '#E5484D')}
      <circle cx={50} cy={52} r={4} fill={INK} />
      <rect x={42} y={6} width={16} height={8} rx={3} fill="#B8C4E0" {...S} strokeWidth={4} />
    </>
  ),
  coin: () => (
    <>
      <circle cx={50} cy={50} r={38} fill="#FFD23F" {...S} />
      <circle cx={50} cy={50} r={27} fill="none" stroke="#C98A12" strokeWidth={4} />
      <text x={50} y={62} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={34} fill="#8A5A00">
        Rp
      </text>
    </>
  ),
  money: () => (
    <>
      <rect x={8} y={26} width={84} height={48} rx={8} fill="#9CE0B5" {...S} />
      <circle cx={50} cy={50} r={13} fill="#5FBF7A" {...S} strokeWidth={4} />
      <circle cx={22} cy={50} r={4} fill={INK} />
      <circle cx={78} cy={50} r={4} fill={INK} />
    </>
  ),
  globe: () => (
    <>
      <circle cx={50} cy={50} r={40} fill="#7FD3F7" {...S} />
      <path d="M26 30 Q40 22 50 34 Q58 44 46 52 Q34 58 26 48 Z" fill="#7CC157" {...S} strokeWidth={4} />
      <path d="M58 60 Q72 54 80 64 Q74 80 60 78 Z" fill="#7CC157" {...S} strokeWidth={4} />
    </>
  ),
  book: () => (
    <>
      <rect x={18} y={12} width={60} height={76} rx={6} fill="#7B61FF" {...S} />
      <rect x={18} y={12} width={14} height={76} rx={4} fill="#5B3FD6" {...S} strokeWidth={4} />
      {line('M44 34 L68 34', 5, '#FFFFFF')}
      {line('M44 46 L62 46', 5, '#FFFFFF')}
    </>
  ),
  bulb: () => (
    <>
      <path d="M50 10 C30 10 20 26 22 40 C24 52 34 58 36 68 L64 68 C66 58 76 52 78 40 C80 26 70 10 50 10 Z" fill="#FFE27A" {...S} />
      <rect x={36} y={68} width={28} height={16} rx={4} fill="#B8C4E0" {...S} strokeWidth={4} />
      {line('M42 92 L58 92')}
      {line('M44 50 L50 58 L56 50', 4, '#C98A12')}
    </>
  ),
  warning: () => (
    <>
      <path d="M50 10 L92 86 L8 86 Z" fill="#FFD23F" {...S} strokeWidth={6} />
      {line('M50 36 L50 62', 8)}
      <circle cx={50} cy={74} r={5} fill={INK} />
    </>
  ),
  check: () => (
    <>
      <circle cx={50} cy={50} r={40} fill="#1F9D63" {...S} />
      {line('M30 52 L45 66 L72 36', 9, '#FFFFFF')}
    </>
  ),
  cross: () => (
    <>
      <circle cx={50} cy={50} r={40} fill="#E5484D" {...S} />
      {line('M34 34 L66 66 M66 34 L34 66', 9, '#FFFFFF')}
    </>
  ),
  person: () => (
    <>
      <circle cx={50} cy={32} r={18} fill="#FFD6A6" {...S} />
      <path d="M18 92 Q18 58 50 58 Q82 58 82 92 Z" fill="#4C7DFF" {...S} />
    </>
  ),
  people: () => (
    <>
      <circle cx={32} cy={38} r={13} fill="#FFD6A6" {...S} strokeWidth={4} />
      <path d="M10 88 Q10 60 32 60 Q54 60 54 88 Z" fill="#FF7A9A" {...S} strokeWidth={4} />
      <circle cx={66} cy={32} r={15} fill="#FFD6A6" {...S} strokeWidth={4} />
      <path d="M40 90 Q40 56 66 56 Q92 56 92 90 Z" fill="#4C7DFF" {...S} strokeWidth={4} />
    </>
  ),
  building: () => (
    <>
      <rect x={20} y={14} width={60} height={76} rx={4} fill="#C3B3FF" {...S} />
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => <rect key={`${r}${c}`} x={30 + c * 24} y={24 + r * 18} width={14} height={11} rx={2} fill="#FFFFFF" {...S} strokeWidth={3} />)
      )}
      <rect x={42} y={72} width={16} height={18} fill="#3B3852" {...S} strokeWidth={3} />
    </>
  ),
  car: () => (
    <>
      <path d="M8 68 L8 54 Q8 46 18 45 L28 44 L38 28 Q41 24 46 24 L66 24 Q72 24 75 29 L84 44 Q94 46 94 56 L94 68 Z" fill="#FF7A5C" {...S} />
      <path d="M40 44 L46 32 L60 32 L60 44 Z M64 44 L64 32 L70 32 L76 44 Z" fill="#BFE6FF" {...S} strokeWidth={3} />
      <circle cx={28} cy={70} r={10} fill="#2B2840" {...S} strokeWidth={4} />
      <circle cx={74} cy={70} r={10} fill="#2B2840" {...S} strokeWidth={4} />
    </>
  ),
  rocket: () => (
    <>
      <path d="M50 6 C66 18 70 40 66 66 L34 66 C30 40 34 18 50 6 Z" fill="#F4F4F8" {...S} />
      <circle cx={50} cy={36} r={9} fill="#7FD3F7" {...S} strokeWidth={4} />
      <path d="M34 54 L20 72 L34 70 Z M66 54 L80 72 L66 70 Z" fill="#E5484D" {...S} strokeWidth={4} />
      <path d="M40 68 L50 92 L60 68 Z" fill="#FFB020" {...S} strokeWidth={4} />
    </>
  ),
  chart: () => (
    <>
      <rect x={10} y={12} width={80} height={76} rx={8} fill="#FFFFFF" {...S} />
      <rect x={22} y={56} width={12} height={22} fill="#7FD3F7" {...S} strokeWidth={3} />
      <rect x={44} y={42} width={12} height={36} fill="#FFD23F" {...S} strokeWidth={3} />
      <rect x={66} y={26} width={12} height={52} fill="#5FBF7A" {...S} strokeWidth={3} />
    </>
  ),
  heart: () => <path d="M50 88 C20 66 8 50 8 34 C8 20 18 12 30 12 C40 12 46 18 50 26 C54 18 60 12 70 12 C82 12 92 20 92 34 C92 50 80 66 50 88 Z" fill="#FF7A9A" {...S} />,
  brain: () => (
    <>
      <path d="M50 18 C40 8 22 12 20 26 C8 30 8 48 18 54 C14 68 26 80 40 76 C44 86 56 86 60 76 C74 80 86 68 82 54 C92 48 92 30 80 26 C78 12 60 8 50 18 Z" fill="#FFB3C1" {...S} />
      {line('M50 20 L50 78', 4)}
      {line('M32 36 Q40 40 36 50 M68 36 Q60 40 64 50 M30 62 Q38 60 42 66 M70 62 Q62 60 58 66', 4)}
    </>
  ),
  search: () => (
    <>
      {line('M62 62 L88 88', 12)}
      <circle cx={42} cy={42} r={28} fill="#CDEBFF" {...S} strokeWidth={7} />
      {line('M28 38 Q32 26 44 24', 5, '#FFFFFF')}
    </>
  ),
  lock: () => (
    <>
      <path d="M30 46 L30 32 Q30 14 50 14 Q70 14 70 32 L70 46" fill="none" {...S} strokeWidth={8} />
      <rect x={20} y={44} width={60} height={46} rx={10} fill="#FFD23F" {...S} />
      <circle cx={50} cy={64} r={6} fill={INK} />
    </>
  ),
  wifi: () => (
    <>
      {line('M14 40 Q50 8 86 40', 8)}
      {line('M26 54 Q50 32 74 54', 8)}
      {line('M38 68 Q50 58 62 68', 8)}
      <circle cx={50} cy={82} r={7} fill={INK} />
    </>
  ),
  cart: () => (
    <>
      {line('M8 18 L22 18 L32 66 L80 66', 6)}
      <path d="M26 30 L88 30 L80 56 L31 56 Z" fill="#9CE0B5" {...S} />
      <circle cx={38} cy={80} r={7} fill="#2B2840" {...S} strokeWidth={3} />
      <circle cx={74} cy={80} r={7} fill="#2B2840" {...S} strokeWidth={3} />
    </>
  ),
  gift: () => (
    <>
      <rect x={14} y={40} width={72} height={50} rx={6} fill="#FF7A9A" {...S} />
      <rect x={10} y={28} width={80} height={16} rx={4} fill="#FFB3C1" {...S} />
      <rect x={44} y={28} width={12} height={62} fill="#FFD23F" {...S} strokeWidth={4} />
      <path d="M50 28 C40 10 24 14 30 26 Z M50 28 C60 10 76 14 70 26 Z" fill="#FFD23F" {...S} strokeWidth={4} />
    </>
  ),
  fire: () => (
    <>
      <path d="M50 92 C26 92 18 72 24 56 C28 46 36 42 36 30 C46 36 50 44 50 52 C54 40 62 26 58 10 C74 22 84 42 80 62 C78 80 66 92 50 92 Z" fill="#FF7A3D" {...S} />
      <path d="M50 88 C40 88 36 78 40 70 C44 64 48 62 48 56 C56 62 62 70 60 78 C58 84 54 88 50 88 Z" fill="#FFD23F" />
    </>
  ),
  star: () => <path d="M50 8 L62 36 L92 38 L69 58 L76 88 L50 72 L24 88 L31 58 L8 38 L38 36 Z" fill="#FFD23F" {...S} />,
  question: () => (
    <>
      <circle cx={50} cy={50} r={40} fill="#FFD23F" {...S} />
      <text x={50} y={68} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={56} fill={INK}>
        ?
      </text>
    </>
  ),
  home: () => (
    <>
      <path d="M14 48 L50 16 L86 48" fill="none" {...S} strokeWidth={7} />
      <path d="M22 44 L22 88 L78 88 L78 44 L50 20 Z" fill="#FFE9C9" {...S} />
      <rect x={42} y={60} width={16} height={28} fill="#7A4E2D" {...S} strokeWidth={4} />
    </>
  ),
  pin: () => (
    <>
      <path d="M50 92 C34 66 18 54 18 36 C18 18 32 8 50 8 C68 8 82 18 82 36 C82 54 66 66 50 92 Z" fill="#7B61FF" {...S} />
      <circle cx={50} cy={36} r={12} fill="#FFFFFF" {...S} strokeWidth={4} />
    </>
  ),
  battery: () => (
    <>
      <rect x={10} y={28} width={72} height={44} rx={8} fill="#FFFFFF" {...S} />
      <rect x={82} y={40} width={8} height={20} rx={3} fill={INK} />
      <rect x={18} y={36} width={34} height={28} rx={4} fill="#5FBF7A" />
    </>
  ),
  cloud: () => <path d="M26 76 C12 76 8 62 16 54 C12 40 28 32 38 38 C42 24 62 20 70 34 C84 32 94 44 88 56 C96 64 90 76 78 76 Z" fill="#FFFFFF" {...S} />,
  sun: () => (
    <>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return <line key={i} x1={50 + Math.cos(a) * 32} y1={50 + Math.sin(a) * 32} x2={50 + Math.cos(a) * 44} y2={50 + Math.sin(a) * 44} stroke={INK} strokeWidth={6} strokeLinecap="round" />;
      })}
      <circle cx={50} cy={50} r={24} fill="#FFC94A" {...S} />
    </>
  ),
  moon: () => <path d="M62 10 C40 14 26 32 28 54 C30 76 50 92 72 88 C56 80 48 64 50 48 C52 30 60 18 62 10 Z" fill="#FFF3C4" {...S} />,
  lightning: () => <path d="M58 6 L22 56 L46 56 L38 94 L78 40 L54 40 Z" fill="#FFD23F" {...S} />,
  gear: () => (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={44} y={6} width={12} height={20} rx={3} fill="#9AA4C4" {...S} strokeWidth={4} transform={`rotate(${i * 45} 50 50)`} />
      ))}
      <circle cx={50} cy={50} r={30} fill="#9AA4C4" {...S} />
      <circle cx={50} cy={50} r={11} fill="#FFFFFF" {...S} strokeWidth={4} />
    </>
  ),
  shield: () => (
    <>
      <path d="M50 8 L86 22 C86 56 72 78 50 92 C28 78 14 56 14 22 Z" fill="#7FD3F7" {...S} />
      {line('M34 50 L46 62 L68 38', 8, '#FFFFFF')}
    </>
  ),
  camera: () => (
    <>
      <rect x={8} y={28} width={84} height={58} rx={10} fill="#3B3852" {...S} />
      <rect x={32} y={16} width={30} height={16} rx={4} fill="#3B3852" {...S} strokeWidth={4} />
      <circle cx={50} cy={57} r={18} fill="#7FD3F7" {...S} />
      <circle cx={78} cy={40} r={4} fill="#FF5A5F" />
    </>
  ),
  food: () => (
    <>
      <path d="M8 48 L92 48 Q90 84 50 86 Q10 84 8 48 Z" fill="#FFFFFF" {...S} />
      <path d="M20 48 Q24 30 40 34 Q48 22 62 30 Q78 26 80 48 Z" fill="#FFB020" {...S} strokeWidth={4} />
    </>
  ),
  signal: () => (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={14 + i * 20} y={70 - i * 18} width={14} height={20 + i * 18} rx={3} fill={i < 3 ? '#5FBF7A' : '#D3D8E6'} {...S} strokeWidth={4} />
      ))}
    </>
  ),
  planet: () => (
    <>
      <circle cx={50} cy={50} r={28} fill="#FF9DB3" {...S} />
      <ellipse cx={50} cy={52} rx={46} ry={12} fill="none" stroke={INK} strokeWidth={9} transform="rotate(-18 50 52)" />
      <ellipse cx={50} cy={52} rx={46} ry={12} fill="none" stroke="#7B61FF" strokeWidth={4} transform="rotate(-18 50 52)" />
    </>
  ),
} as const;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export const Icon: React.FC<{ name: IconName; x: number; y: number; size: number; o?: number; rot?: number; s?: number }> = ({ name, x, y, size, o = 1, rot = 0, s = 1 }) => {
  const Draw = ICONS[name];
  return (
    <svg
      style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, overflow: 'visible', opacity: o, transform: `rotate(${rot}deg) scale(${s})` }}
      width={size}
      height={size}
      viewBox="0 0 100 100"
    >
      <Draw />
    </svg>
  );
};

/** Ikon di dalam lingkaran putih (untuk poin/daftar). */
export const IconBadge: React.FC<{ name: IconName; x: number; y: number; size: number; bg?: string; s?: number; o?: number }> = ({ name, x, y, size, bg = '#FFFFFF', s = 1, o = 1 }) => (
  <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `scale(${s})`, opacity: o }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: bg, border: `5px solid ${INK}` }} />
    <Icon name={name} x={size / 2} y={size / 2} size={size * 0.7} />
  </div>
);
