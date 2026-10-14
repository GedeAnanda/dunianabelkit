import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { INK } from '../shared/theme';
import { useLayout } from './layout';

/**
 * Lokasi latar Nabel Kit. Semua responsif (16:9 dan 9:16).
 * Pakai `bg: 'room'` atau `bg: { kind: 'city', time: 'dusk' }` di storyboard.
 */
export type BgKind = 'plain' | 'room' | 'city' | 'park' | 'lab' | 'class' | 'studio' | 'space' | 'night' | 'ocean';
export type BgDef = BgKind | { kind: BgKind; time?: 'day' | 'dusk' | 'night'; color?: string };

const SW = 6;
const SKY = {
  day: ['#8FD3FF', '#E3F6FF'],
  dusk: ['#FF9E7A', '#FFE3C2'],
  night: ['#1F2456', '#4B4F9A'],
} as const;

/** Garis lantai/tanah: sedikit di atas telapak kaki Nabel. */
export const useFloorY = () => {
  const L = useLayout();
  return L.nabelFeetY - (L.wide ? 40 : 90);
};

const Clouds: React.FC<{ W: number; top: number; n?: number }> = ({ W, top, n = 3 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: ((i * (W / n + 170) + frame * 0.5) % (W + 300)) - 220,
            top: top + (i % 2) * 70,
            width: 190,
            height: 58,
            borderRadius: 29,
            background: '#FFFFFF',
            border: `5px solid ${INK}`,
          }}
        />
      ))}
    </>
  );
};

const Stars: React.FC<{ W: number; H: number; n?: number; seed?: string }> = ({ W, H, n = 90, seed = 'ks' }) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0 }} width={W} height={H}>
      {Array.from({ length: n }, (_, i) => (
        <circle
          key={i}
          cx={random(`${seed}x${i}`) * W}
          cy={random(`${seed}y${i}`) * H}
          r={2 + random(`${seed}r${i}`) * 3.5}
          fill="#FFFFFF"
          opacity={0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame / 9 + i * 1.7))}
        />
      ))}
    </svg>
  );
};

const Floor: React.FC<{ y: number; color: string; stripes?: string }> = ({ y, color, stripes }) => (
  <div style={{ position: 'absolute', left: -20, right: -20, top: y, bottom: 0, background: color, borderTop: `${SW}px solid ${INK}` }}>
    {stripes && <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(90deg, ${stripes} 0 4px, transparent 4px 160px)` }} />}
  </div>
);

export const Bg: React.FC<{ def?: BgDef }> = ({ def = 'plain' }) => {
  const L = useLayout();
  const frame = useCurrentFrame();
  const floorY = useFloorY();
  const d = typeof def === 'string' ? { kind: def } : def;
  const { W, H } = L;
  const time = (d as { time?: 'day' | 'dusk' | 'night' }).time ?? 'day';
  const color = (d as { color?: string }).color;

  switch (d.kind) {
    case 'plain':
      return (
        <AbsoluteFill style={{ background: color ?? '#3CC8B4' }}>
          <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.18) 5px, transparent 5px)', backgroundSize: '70px 70px', backgroundPosition: `${frame * 0.4}px ${frame * 0.4}px` }} />
        </AbsoluteFill>
      );

    case 'room': {
      const winW = L.wide ? 420 : 360;
      const winX = L.wide ? W - winW - 120 : W - winW - 80;
      const winY = L.wide ? 210 : 330;
      return (
        <AbsoluteFill style={{ background: `linear-gradient(${color ?? '#FFF1DE'}, #FBE3C4)` }}>
          <div style={{ position: 'absolute', inset: 0, opacity: L.wide ? 0.65 : 0.45 }}>
          <div style={{ position: 'absolute', left: winX, top: winY, width: winW, height: winW * 1.05, background: `linear-gradient(${SKY[time][0]}, ${SKY[time][1]})`, border: `${SW}px solid ${INK}`, borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: winW / 2 - 5, top: 0, bottom: 0, width: 10, background: INK }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: winW * 0.52, height: 10, background: INK }} />
          </div>
          <div style={{ position: 'absolute', left: L.wide ? 110 : 60, top: L.wide ? 330 : 470, width: 380, height: 22, background: '#B98257', border: `5px solid ${INK}`, borderRadius: 6 }} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ position: 'absolute', left: (L.wide ? 134 : 84) + i * 52, top: (L.wide ? 330 : 470) - (110 + (i % 3) * 18), width: 42, height: 110 + (i % 3) * 18, background: ['#7FD3F7', '#FF9DB3', '#FFD23F', '#9CE0B5', '#C3B3FF'][i], border: `4px solid ${INK}`, borderRadius: 6 }} />
          ))}
          </div>
          <Floor y={floorY} color="#C98B5A" stripes="rgba(30,27,46,0.12)" />
        </AbsoluteFill>
      );
    }

    case 'night':
      return (
        <AbsoluteFill style={{ background: color ?? '#3A3F7A' }}>
          <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 6px, transparent 6px)', backgroundSize: '80px 80px' }} />
          <div style={{ position: 'absolute', left: L.wide ? W - 560 : W - 460, top: L.wide ? 190 : 300, width: 380, height: 400, background: '#1B1F4B', border: `${SW + 2}px solid ${INK}`, borderRadius: 18, overflow: 'hidden' }}>
            <Stars W={380} H={400} n={14} seed="kn" />
            <div style={{ position: 'absolute', left: 230, top: 50, width: 90, height: 90, borderRadius: 45, background: '#FFF3C4', border: `5px solid ${INK}` }} />
            <div style={{ position: 'absolute', left: 185, top: 0, width: 10, height: 400, background: INK }} />
            <div style={{ position: 'absolute', left: 0, top: 195, width: 380, height: 10, background: INK }} />
          </div>
          <Floor y={floorY} color="#6B4E8A" />
        </AbsoluteFill>
      );

    case 'city':
    case 'park': {
      const sky = SKY[time];
      const groundY = floorY - (L.wide ? 120 : 160);
      return (
        <AbsoluteFill style={{ background: `linear-gradient(${sky[0]}, ${sky[1]} ${groundY}px)` }}>
          {time === 'night' ? <Stars W={W} H={groundY} n={50} /> : <Clouds W={W} top={L.wide ? 250 : 380} n={L.wide ? 4 : 3} />}
          <svg style={{ position: 'absolute', left: 0, top: 0 }} width={W} height={H}>
            {d.kind === 'city'
              ? Array.from({ length: Math.ceil(W / 160) + 1 }, (_, i) => {
                  const w = 130 + ((i * 37) % 50);
                  const h = (L.wide ? 200 : 300) + ((i * 97) % 220);
                  const x = i * 160 - 20;
                  const fill = ['#FFD6A6', '#C3B3FF', '#9CE0B5', '#FFB3C1', '#BFD3EA'][i % 5];
                  return (
                    <g key={i}>
                      <rect x={x} y={groundY - h} width={w} height={h + 10} rx={10} fill={time === 'night' ? '#2A2650' : fill} stroke={INK} strokeWidth={SW} />
                      {Array.from({ length: Math.floor(h / 70) * 2 }, (_, j) => (
                        <rect key={j} x={x + 22 + (j % 2) * (w / 2 - 6)} y={groundY - h + 26 + Math.floor(j / 2) * 70} width={w / 2 - 40} height={36} rx={5} fill={time === 'night' ? ((i + j) % 3 ? '#FFE27A' : '#46407A') : '#FFFFFF'} stroke={INK} strokeWidth={4} />
                      ))}
                    </g>
                  );
                })
              : (
                  <>
                    <path d={`M-20 ${groundY + 10} Q${W * 0.2} ${groundY - 130} ${W * 0.45} ${groundY - 10} Q${W * 0.7} ${groundY - 120} ${W + 20} ${groundY - 20} L${W + 20} ${H} L-20 ${H} Z`} fill="#9ED36A" stroke={INK} strokeWidth={SW} />
                    {Array.from({ length: Math.ceil(W / 170) + 1 }, (_, i) => {
                      const x = 50 + i * 170;
                      const y = groundY + (i % 2) * 14;
                      return (
                        <g key={i}>
                          <rect x={x - 12} y={y - 10} width={24} height={70} fill="#8C6440" stroke={INK} strokeWidth={5} />
                          <circle cx={x} cy={y - 50} r={60} fill={i % 2 ? '#5FBF7A' : '#4FAF5A'} stroke={INK} strokeWidth={SW} />
                        </g>
                      );
                    })}
                  </>
                )}
          </svg>
          {d.kind === 'city' ? (
            <>
              <div style={{ position: 'absolute', left: -20, right: -20, top: groundY, height: floorY - groundY, background: '#5A5E7A', borderTop: `${SW}px solid ${INK}` }}>
                {Array.from({ length: Math.ceil(W / 220) + 1 }, (_, i) => (
                  <div key={i} style={{ position: 'absolute', left: i * 220 + 40, top: (floorY - groundY) / 2 - 8, width: 120, height: 16, borderRadius: 8, background: '#FFFFFF', opacity: 0.85 }} />
                ))}
              </div>
              <Floor y={floorY} color="#C9CFDD" stripes="rgba(30,27,46,0.12)" />
            </>
          ) : (
            <Floor y={floorY} color="#7CC157" />
          )}
        </AbsoluteFill>
      );
    }

    case 'lab':
      return (
        <AbsoluteFill style={{ background: 'linear-gradient(#DDE6FA, #C9D5F2)' }}>
          <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(76,125,255,0.16) 2px, transparent 2px), linear-gradient(90deg, rgba(76,125,255,0.16) 2px, transparent 2px)', backgroundSize: '96px 96px' }} />
          <div style={{ position: 'absolute', left: -20, right: -20, top: L.wide ? 170 : 350, height: 30, background: '#AEB8D6', border: `5px solid ${INK}` }} />
          {[L.wide ? 60 : 30, W - (L.wide ? 160 : 130)].map((x, i) => (
            <div key={x} style={{ position: 'absolute', left: x, top: L.wide ? 250 : 520, width: 100, height: 160, borderRadius: 16, background: '#2B2840', border: `5px solid ${INK}` }}>
              {[0, 1, 2].map((j) => (
                <div key={j} style={{ position: 'absolute', left: 18, right: 18, top: 22 + j * 44, height: 22, borderRadius: 8, background: (frame + j * 9 + i * 5) % 30 < 15 ? '#3CC8B4' : '#45406A' }} />
              ))}
            </div>
          ))}
          <Floor y={floorY} color="#AEB8D6" stripes="rgba(30,27,46,0.1)" />
        </AbsoluteFill>
      );

    case 'class':
      return (
        <AbsoluteFill style={{ background: color ?? '#F4E3C3' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: floorY - 26, height: 26, background: '#E2C79A', borderTop: `4px solid ${INK}` }} />
          <Floor y={floorY} color="#B9895A" stripes="rgba(30,27,46,0.12)" />
        </AbsoluteFill>
      );

    case 'studio':
      return (
        <AbsoluteFill style={{ background: 'linear-gradient(#1C2A5C, #2D3F80)' }}>
          {[0.15, 0.5, 0.85].map((f, i) => (
            <div
              key={f}
              style={{
                position: 'absolute',
                left: W * f - 180,
                top: 0,
                width: 360,
                height: floorY,
                background: `linear-gradient(rgba(255,240,180,${0.16 + 0.04 * Math.sin(frame / 20 + i)}), rgba(255,240,180,0))`,
                clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0 100%)',
              }}
            />
          ))}
          <Floor y={floorY} color="#25336A" />
        </AbsoluteFill>
      );

    case 'space':
      return (
        <AbsoluteFill style={{ background: color ?? '#141432' }}>
          <Stars W={W} H={H} />
        </AbsoluteFill>
      );

    case 'ocean': {
      const sea = L.wide ? 300 : 520;
      return (
        <AbsoluteFill style={{ background: `linear-gradient(${SKY[time][0]}, ${SKY[time][1]} ${sea}px)` }}>
          <div style={{ position: 'absolute', left: -20, right: -20, top: sea, bottom: 0, background: 'linear-gradient(#4FB3E8, #1B4F8A)', borderTop: `${SW}px solid ${INK}` }} />
          <svg style={{ position: 'absolute', left: 0, top: 0 }} width={W} height={H}>
            {Array.from({ length: Math.ceil(W / 160) + 2 }, (_, i) => {
              const x = ((i * 160 - frame * 1.2) % (W + 160)) - 80;
              return <path key={i} d={`M${x} ${sea + 40} q40 -18 80 0`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />;
            })}
            <path d={`M-20 ${floorY} Q${W * 0.3} ${floorY - 40} ${W * 0.6} ${floorY} T${W + 20} ${floorY} L${W + 20} ${H} L-20 ${H} Z`} fill="#E9D7B0" stroke={INK} strokeWidth={SW} />
          </svg>
        </AbsoluteFill>
      );
    }
  }
};
