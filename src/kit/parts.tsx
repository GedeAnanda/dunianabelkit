import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, INK } from '../shared/theme';
import { ease, inOut, pop } from '../shared/anim';
import { sec } from '../shared/timeline';
import { PlacedNabel, QMark } from '../dejavu/scenes/common';
import { SpeechBubble } from '../shared/SpeechBubble';
import { Sparkles } from '../mewah/props';
import type { NabelCurl, NabelExpression, NabelPose } from '../shared/Nabel';
import { Layout, Side, useLayout } from './layout';
import type { HeadingItem, Mood, NabelDef, Ref, Tone } from './types';

// ------------------------------------------------------------------ warna
export const TONE: Record<Tone, string> = {
  yellow: colors.yellow,
  white: '#FFFFFF',
  red: '#FF7A7A',
  green: '#7CF2A8',
  blue: '#7FD3F7',
  pink: '#FF9DB3',
  ink: INK,
};
/** Warna isi (untuk kartu, batang grafik, dll.) — lebih pekat daripada TONE teks. */
export const FILL: Record<Tone, string> = {
  yellow: '#FFD23F',
  white: '#FFFFFF',
  red: '#E5484D',
  green: '#1F9D63',
  blue: '#4C7DFF',
  pink: '#FF7A9A',
  ink: '#3B3852',
};

// ------------------------------------------------------------------ waktu
/** Tipe timeline dari createTimeline (cukup bagian yang dipakai kit). */
export type KitT = {
  cue: (id: string) => { start: number; end: number };
};

/** Ubah Ref storyboard jadi frame absolut. */
export const refAbs = (T: KitT, ref: Ref, sceneStart: number): number => {
  if (typeof ref === 'number') return sceneStart + ref;
  const m = /^([A-Za-z0-9_]+?)(>|@([0-9.]+))?([+-]\d+)?$/.exec(ref.trim());
  if (!m) throw new Error(`Ref waktu tidak dikenal: "${ref}"`);
  const c = T.cue(m[1]);
  const a = sec(c.start);
  const b = sec(c.end);
  let f = a;
  if (m[2] === '>') f = b;
  else if (m[3] !== undefined) f = Math.round(a + (b - a) * parseFloat(m[3]));
  if (m[4]) f += parseInt(m[4], 10);
  return f;
};

/** 0..1 pop (spring) mulai `at`, 0 sebelum itu. */
export const popAt = (frame: number, at: number, fps: number, damping = 10) => (frame >= at ? pop(frame, at, fps, damping) : 0);

// ------------------------------------------------------------------ judul besar
const BigText: React.FC<{ lines: string[]; y: number; size: number; color: string; s?: number; rot?: number; o?: number }> = ({ lines, y, size, color, s = 1, rot = -2, o = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: 40,
      right: 40,
      top: y,
      transform: `translateY(-50%) rotate(${rot}deg) scale(${s})`,
      opacity: o,
      textAlign: 'center',
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.02,
      color,
      WebkitTextStroke: `${size * 0.09}px ${INK}`,
      paintOrder: 'stroke fill',
      textShadow: `0 ${size * 0.08}px 0 ${INK}`,
      letterSpacing: 1,
    }}
  >
    {lines.map((l, i) => (
      <div key={i}>{l}</div>
    ))}
  </div>
);

/** Judul besar yang berganti di atas layar. Teks: "\n" = baris baru. Ukuran mengecil otomatis kalau barisnya panjang. */
export const Heading: React.FC<{ items: Array<{ at: number; text: string; tone?: Tone }>; L: Layout }> = ({ items, L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let idx = -1;
  items.forEach((it, i) => {
    if (frame >= it.at) idx = i;
  });
  if (idx < 0) return null;
  const it = items[idx];
  const lines = it.text.split('\n');
  const longest = Math.max(...lines.map((l) => l.length));
  const size = L.headingSize * Math.min(1, L.headingChars / Math.max(1, longest));
  const s = it.at <= 0 ? 1 : pop(frame, it.at, fps, 9);
  return <BigText lines={lines} y={L.headingY} size={size} s={s} color={TONE[it.tone ?? 'yellow']} />;
};

export const normHeading = (h: string | HeadingItem[] | undefined, at: (r: Ref) => number): Array<{ at: number; text: string; tone?: Tone }> => {
  if (!h) return [];
  if (typeof h === 'string') return [{ at: 0, text: h }];
  return h.map((x) => ({ at: x.at === undefined ? 0 : at(x.at), text: x.text, tone: x.tone }));
};

// ------------------------------------------------------------------ Nabel
export const KitNabel: React.FC<{
  def: NabelDef | undefined;
  defaultSide: Side;
  defaultMoods: Array<{ at: number; expr: NabelExpression; pose?: NabelPose; curl?: NabelCurl }>;
  at: (r: Ref) => number;
  L: Layout;
  lookTo?: { x: number; y: number };
}> = ({ def, defaultSide, defaultMoods, at, L, lookTo }) => {
  const frame = useCurrentFrame();
  if (def === false) return null;
  const d = def ?? {};
  const side = d.side ?? defaultSide;
  if (side === 'none') return null;
  const size = L.nabelSize * (d.scale ?? 1);
  const x = L.nabelX(side);
  const moods = d.moods ? d.moods.map((m: Mood) => ({ at: m.at === undefined ? 0 : at(m.at), expr: m.expr, pose: m.pose, curl: m.curl })) : defaultMoods;
  let cur = moods[0] ?? { at: 0, expr: 'curious' as NabelExpression };
  for (const m of moods) if (frame >= m.at) cur = m;
  const curl = cur.curl ?? (cur.expr === 'aha' ? 'exclaim' : undefined);
  const lx = lookTo ? Math.max(-0.8, Math.min(0.8, (lookTo.x - x) / 500)) : 0;
  const ly = lookTo ? Math.max(-0.8, Math.min(0.5, (lookTo.y - (L.nabelFeetY - size)) / 500)) : -0.2;
  const sparkle = d.sparkleAt !== undefined ? at(d.sparkleAt) : cur.expr === 'aha' ? cur.at : undefined;
  return (
    <>
      <PlacedNabel x={x} feetY={L.nabelFeetY} size={size} expression={cur.expr} pose={cur.pose} curl={curl} lookX={lx} lookY={ly} />
      {sparkle !== undefined && frame >= sparkle && frame < sparkle + 50 && <Sparkles x={x} y={L.nabelFeetY - size * 0.7} spread={size * 0.6} n={5} seed={`kn${sparkle}`} />}
      {d.bubble && (
        <SpeechBubble
          text={d.bubble.text}
          x={Math.max(20, Math.min(L.W - 360, x - 170))}
          y={L.nabelFeetY - size * 1.15 - 150}
          width={340}
          start={at(d.bubble.at)}
          end={d.bubble.until !== undefined ? at(d.bubble.until) : at(d.bubble.at) + 45}
          variant="shout"
          tailX={x - Math.max(20, Math.min(L.W - 360, x - 170)) - 170}
          tailLen={60}
          fontSize={52}
        />
      )}
    </>
  );
};

// ------------------------------------------------------------------ kartu & teks
export const Card: React.FC<{ x: number; y: number; w: number; h: number; title?: string; titleBg?: string; s?: number; o?: number; rot?: number; bg?: string; children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  title,
  titleBg = colors.purple,
  s = 1,
  o = 1,
  rot = 0,
  bg = '#FFFFFF',
  children,
}) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg) scale(${s})`, opacity: o }}>
    <div style={{ position: 'absolute', inset: 0, background: bg, border: `6px solid ${INK}`, borderRadius: 30, boxShadow: '0 10px 0 rgba(30,27,46,0.2)', overflow: 'hidden' }}>{children}</div>
    {title && (
      <div style={{ position: 'absolute', left: '50%', top: -28, transform: 'translateX(-50%)', background: titleBg, border: `5px solid ${INK}`, borderRadius: 999, padding: '6px 24px 10px', fontFamily: fonts.display, fontWeight: 700, fontSize: 36, color: '#FFFFFF', whiteSpace: 'nowrap', lineHeight: 1 }}>
        {title}
      </div>
    )}
  </div>
);

export const StrokeText: React.FC<{ text: string; x: number; y: number; size: number; color?: string; s?: number; o?: number; rot?: number; maxW?: number }> = ({ text, x, y, size, color = colors.yellow, s = 1, o = 1, rot = 0, maxW }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: maxW,
      transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`,
      opacity: o,
      textAlign: 'center',
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.05,
      color,
      WebkitTextStroke: `${size * 0.08}px ${INK}`,
      paintOrder: 'stroke fill',
      textShadow: `0 ${size * 0.07}px 0 ${INK}`,
      whiteSpace: maxW ? 'normal' : 'nowrap',
    }}
  >
    {text}
  </div>
);

/** Baris poin: ikon bulat + teks dalam pil putih. (x, y) = kiri-tengah. */
export const PointRow: React.FC<{ x: number; y: number; w: number; text: string; icon?: React.ReactNode; s: number; size?: number; tone?: Tone }> = ({ x, y, w, text, icon, s, size = 40, tone }) => (
  <div style={{ position: 'absolute', left: x, top: y - 50, width: w, height: 100, transform: `scale(${s})`, transformOrigin: 'left center', opacity: Math.min(1, s * 1.5) }}>
    <div
      style={{
        position: 'absolute',
        left: 50,
        right: 0,
        top: 12,
        bottom: 12,
        background: tone ? FILL[tone] : '#FFFFFF',
        border: `5px solid ${INK}`,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 66,
        paddingRight: 26,
        fontFamily: fonts.display,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.05,
        color: tone && tone !== 'white' && tone !== 'yellow' ? '#FFFFFF' : INK,
        boxShadow: '0 6px 0 rgba(30,27,46,0.15)',
      }}
    >
      {text}
    </div>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 100, height: 100 }}>{icon}</div>
  </div>
);

/** Teks muncul seperti ditulis dari kiri ke kanan. */
export const Reveal: React.FC<{ frame: number; at: number; dur?: number; children: React.ReactNode }> = ({ frame, at, dur = 12, children }) => {
  if (frame < at) return null;
  const p = ease(frame, [at, at + dur], [0, 1]);
  return <div style={{ position: 'absolute', inset: 0, clipPath: `inset(-60px ${(1 - p) * 100}% -60px -60px)` }}>{children}</div>;
};

export { QMark };

// ------------------------------------------------------------------ caption
const highlight = (text: string, keywords: string[]) => {
  if (!keywords.length) return text;
  const re = new RegExp(`(${keywords.map((k) => k.replace(/[-%.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return text.split(re).map((part, i) =>
    keywords.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
      <span key={i} style={{ color: colors.yellow }}>
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
};

/** Subtitle narator, responsif (16:9: lebar & satu baris; 9:16: dua baris di atas zona UI). */
export const KitCaption: React.FC<{ text: string; start: number; end: number; keywords: string[] }> = ({ text, start, end, keywords }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  if (frame < start - 2 || frame > end + 6) return null;
  const s = pop(frame, start - 2, fps, 13);
  const o = inOut(frame, start - 2, end + 6, 3, 5);
  const size = L.wide ? L.captionSize : text.length <= 34 ? 64 : text.length <= 58 ? 58 : 52;
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: L.captionY, transform: `translateY(-50%) scale(${0.88 + 0.12 * s})`, opacity: o, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          background: 'rgba(30, 27, 46, 0.9)',
          color: colors.white,
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: size,
          lineHeight: 1.18,
          padding: L.wide ? '14px 34px 16px' : '20px 34px 22px',
          borderRadius: 34,
          textAlign: 'center',
          maxWidth: L.captionMaxW,
          boxShadow: '0 8px 0 rgba(30,27,46,0.18)',
        }}
      >
        {highlight(text, keywords)}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ ajakan & outro
export const AskBox: React.FC<{ s: number; line1: string; line2: string }> = ({ s, line1, line2 }) => {
  const L = useLayout();
  return (
    <div
      style={{
        position: 'absolute',
        left: L.wide ? (L.W - 1300) / 2 : 80,
        width: L.wide ? 1300 : L.W - 160,
        top: L.wide ? L.captionY - 30 : 1445,
        transform: `translateY(-50%) scale(${s})`,
        background: colors.white,
        border: `7px solid ${INK}`,
        borderRadius: 40,
        padding: '20px 30px 24px',
        textAlign: 'center',
        fontFamily: fonts.display,
        fontWeight: 600,
        fontSize: L.wide ? 46 : 50,
        lineHeight: 1.15,
        color: INK,
        boxShadow: `0 10px 0 rgba(30,27,46,0.25)`,
      }}
    >
      {line1}
      <br />
      <span style={{ color: '#1F9C8A' }}>{line2}</span>
    </div>
  );
};

export const KitOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const t = pop(frame, 4, fps, 9);
  return (
    <AbsoluteFill style={{ background: colors.mint, overflow: 'hidden' }}>
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.18) 5px, transparent 5px)', backgroundSize: '70px 70px' }} />
      <div
        style={{
          position: 'absolute',
          left: L.wide ? 140 : 0,
          right: L.wide ? undefined : 0,
          top: L.wide ? 300 : 420,
          textAlign: L.wide ? 'left' : 'center',
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: L.wide ? 190 : 150,
          color: colors.white,
          lineHeight: 1,
          textShadow: `0 10px 0 ${INK}`,
          transform: `scale(${t})`,
          transformOrigin: L.wide ? 'left center' : 'center',
        }}
      >
        Dunia
        <br />
        Nabel
      </div>
      <PlacedNabel x={L.wide ? L.W - 520 : L.W / 2} feetY={L.wide ? 980 : 1380} size={L.wide ? 520 : 460} expression="happy" pose="wave" />
    </AbsoluteFill>
  );
};
