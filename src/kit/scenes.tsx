import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, INK } from '../shared/theme';
import { ease, lerp, pop } from '../shared/anim';
import type { NabelCurl, NabelExpression, NabelPose } from '../shared/Nabel';
import { Sparkles } from '../mewah/props';
import { Earth } from '../gravitasi/props';
import { BigPhone } from '../ongkir/props';
import { MapChip, MapView } from '../maps/props';
import { MiniSat } from '../einstein/props';
import { Bg, BgDef } from './backgrounds';
import { Icon, IconBadge } from './icons';
import { Box, Layout, Side, useLayout } from './layout';
import { AskBox, Card, FILL, Heading, KitNabel, KitT, normHeading, PointRow, popAt, QMark, refAbs, Reveal, StrokeText, TONE } from './parts';
import type { Point, Ref, SceneDef, Visual } from './types';

type MoodF = { at: number; expr: NabelExpression; pose?: NabelPose; curl?: NabelCurl };
type Defaults = { side: Side; moods: MoodF[]; bg: BgDef };
export type LocalSfx = { at: number; name: string; v: number };

const last = <X,>(xs: X[]) => xs[xs.length - 1];
const atOr = (at: (r: Ref) => number, r: Ref | undefined, d = 0) => (r === undefined ? d : at(r));

// ================================================================== bawaan per jenis scene
export const sceneDefaults = (def: SceneDef, L: Layout, at: (r: Ref) => number): Defaults => {
  const w = L.wide;
  switch (def.type) {
    case 'title':
      return { side: w ? 'right' : 'center', moods: [{ at: 0, expr: 'happy', pose: 'wave' }], bg: { kind: 'plain', color: '#5B47D6' } };
    case 'question':
      return { side: w ? 'left' : 'center', moods: [{ at: 0, expr: 'confused' }], bg: 'room' };
    case 'explain': {
      const pts = def.points ?? [];
      return { side: w ? 'left' : 'right', moods: [{ at: 0, expr: 'curious' }, ...(pts.length ? [{ at: at(last(pts).at) + 6, expr: 'happy' as NabelExpression }] : [])], bg: 'room' };
    }
    case 'fact': {
      const a = atOr(at, def.at);
      return { side: w ? 'right' : 'center', moods: [{ at: 0, expr: 'curious' }, { at: a + 4, expr: 'aha' }], bg: 'lab' };
    }
    case 'compare':
      return {
        side: 'center',
        moods: [
          { at: 0, expr: 'curious' },
          { at: atOr(at, def.right.at, 8), expr: 'thinking' },
          ...(def.verdict ? [{ at: at(def.verdict.at) + 2, expr: (def.verdict.kind === 'neq' ? 'shocked' : 'aha') as NabelExpression }] : []),
        ],
        bg: 'studio',
      };
    case 'list':
      return { side: w ? 'left' : 'right', moods: [{ at: 0, expr: 'curious' }, { at: at(last(def.items).at) + 6, expr: 'happy' }], bg: 'room' };
    case 'chart':
      return { side: 'right', moods: [{ at: 0, expr: 'curious' }, ...(def.highlight ? [{ at: at(def.highlight.at) + 2, expr: 'aha' as NabelExpression }] : [])], bg: 'lab' };
    case 'map':
      return { side: w ? 'right' : 'left', moods: [{ at: 0, expr: 'curious' }], bg: 'city' };
    case 'timeline':
      return { side: w ? 'left' : 'right', moods: [{ at: 0, expr: 'curious' }, { at: at(last(def.events).at) + 6, expr: 'happy' }], bg: 'room' };
    case 'zoom':
      return { side: 'right', moods: [{ at: 0, expr: 'curious' }, ...(def.labelAt !== undefined ? [{ at: at(def.labelAt) + 2, expr: 'aha' as NabelExpression }] : [])], bg: 'space' };
    case 'board':
      return { side: 'right', moods: [{ at: 0, expr: 'happy', pose: 'point' }], bg: 'class' };
    case 'custom':
      return { side: 'none', moods: [{ at: 0, expr: 'curious' }], bg: 'plain' };
  }
};

/** SFX bawaan per jenis scene (frame lokal). Volume sudah "aman" (pop pelan, ekor panjang kecil). */
export const sceneAutoSfx = (def: SceneDef, at: (r: Ref) => number): LocalSfx[] => {
  const pops = (xs: Array<{ at?: Ref }>, v = 0.35, name = 'pop') => xs.filter((x) => x.at !== undefined).map((x) => ({ at: at(x.at as Ref), name, v }));
  switch (def.type) {
    case 'title':
      return [{ at: 2, name: 'pop', v: 0.4 }, { at: 10, name: 'sparkle', v: 0.18 }];
    case 'question':
      return [{ at: atOr(at, def.at), name: 'pop-low', v: 0.4 }];
    case 'explain': {
      const v = def.visual;
      const vis = v && 'at' in v && v.at !== undefined ? [{ at: at(v.at), name: 'pop', v: 0.35 }] : v && v.kind === 'icons' ? pops(v.items, 0.3) : [];
      return [...vis, ...pops(def.points ?? [])];
    }
    case 'fact': {
      const a = atOr(at, def.at);
      return [{ at: a, name: 'pop', v: 0.3 }, { at: a + 2, name: 'ding', v: 0.28 }];
    }
    case 'compare':
      return [
        { at: atOr(at, def.left.at), name: 'pop', v: 0.35 },
        { at: atOr(at, def.right.at, 8), name: 'pop', v: 0.35 },
        ...(def.verdict ? [{ at: at(def.verdict.at), name: 'stamp', v: 0.4 }] : []),
      ];
    case 'list':
      return pops(def.items);
    case 'chart':
      return [...pops(def.bars, 0.3), ...(def.highlight ? [{ at: at(def.highlight.at), name: 'ding', v: 0.22 }] : [])];
    case 'map':
      return [...(def.segs ?? []).filter((s) => s.at !== undefined).map((s) => ({ at: at(s.at as Ref), name: 'ping', v: 0.35 })), ...pops(def.chips ?? [], 0.3), ...pops(def.points ?? [], 0.3)];
    case 'timeline':
      return pops(def.events);
    case 'zoom':
      return [{ at: 0, name: 'zoom-out', v: 0.25 }, ...(def.labelAt !== undefined ? [{ at: at(def.labelAt), name: 'pop', v: 0.35 }] : [])];
    case 'board':
      return def.lines.map((l) => ({ at: at(l.at), name: 'chalk', v: 0.22 }));
    case 'custom':
      return [];
  }
};

// ================================================================== bagian visual
const VisualView: React.FC<{ v: Visual; box: Box; at: (r: Ref) => number; L: Layout }> = ({ v, box, at, L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  switch (v.kind) {
    case 'icon': {
      const s = v.at === undefined ? 1 : popAt(frame, at(v.at), fps, 9);
      const size = Math.min(box.w, box.h) * (v.label ? 0.62 : 0.75);
      const bob = Math.sin(frame / 12) * 8;
      return (
        <>
          <Icon name={v.name} x={box.cx} y={box.cy - (v.label ? 40 : 0) + bob} size={size} s={s} />
          {v.label && s > 0 && <StrokeText text={v.label} x={box.cx} y={box.cy + size / 2 + 10} size={L.wide ? 52 : 48} color={TONE[v.tone ?? 'white']} s={s} />}
        </>
      );
    }
    case 'icons': {
      const n = v.items.length;
      const cols = !L.wide && n > 3 ? 2 : n;
      const rows = Math.ceil(n / cols);
      const cw = box.w / cols;
      const ch = box.h / rows;
      const size = Math.min(cw * 0.7, ch * 0.6);
      return (
        <>
          {v.items.map((it, i) => {
            const s = it.at === undefined ? 1 : popAt(frame, at(it.at), fps, 9);
            if (s <= 0) return null;
            const x = box.x + cw * ((i % cols) + 0.5);
            const y = box.y + ch * (Math.floor(i / cols) + 0.5) - (it.label ? 26 : 0);
            return (
              <React.Fragment key={i}>
                <Icon name={it.name} x={x} y={y + Math.sin(frame / 12 + i) * 6} size={size} s={s} />
                {it.label && <StrokeText text={it.label} x={x} y={y + size / 2 + 34} size={L.wide ? 42 : 38} color={TONE[it.tone ?? 'white']} s={s} />}
              </React.Fragment>
            );
          })}
        </>
      );
    }
    case 'text': {
      const s = v.at === undefined ? 1 : popAt(frame, at(v.at), fps, 9);
      const size = Math.min(L.wide ? 180 : 150, (box.w / Math.max(4, v.text.length)) * 1.7);
      return <StrokeText text={v.text} x={box.cx} y={box.cy} size={size} color={TONE[v.tone ?? 'yellow']} s={s} rot={-3} />;
    }
    case 'phoneMap': {
      const s = v.at === undefined ? 1 : popAt(frame, at(v.at), fps, 10);
      const w = Math.min(box.w * 0.62, (box.h / 1.9) * 0.98);
      const h = w * 1.9;
      return (
        <BigPhone x={box.cx} y={box.cy} w={w} rot={-3} s={s}>
          <MapView w={w * 0.91} h={h - w * 0.09} frame={frame} seg={v.seg} dotT={v.dotT ?? 0.1} eta={v.eta} etaSub={v.etaSub} etaColor={v.etaColor} />
        </BigPhone>
      );
    }
    case 'node':
      return <>{v.render({ frame, box, L, at })}</>;
  }
};

const PointsView: React.FC<{ points: Point[]; box: Box; at: (r: Ref) => number; L: Layout }> = ({ points, box, at, L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = points.length;
  const rowH = Math.min(L.wide ? 124 : 112, box.h / Math.max(1, n));
  const top = box.cy - (rowH * n) / 2 + rowH / 2;
  return (
    <>
      {points.map((p, i) => {
        const s = popAt(frame, at(p.at), fps, 10);
        if (s <= 0) return null;
        const size = p.text.length > 24 ? (L.wide ? 34 : 32) : L.wide ? 40 : 38;
        return (
          <PointRow
            key={i}
            x={box.x}
            y={top + i * rowH}
            w={box.w}
            text={p.text}
            s={s}
            size={size}
            tone={p.tone}
            icon={<IconBadge name={p.icon ?? 'check'} x={50} y={50} size={96} bg={p.icon ? '#FFFFFF' : '#FFFFFF'} />}
          />
        );
      })}
    </>
  );
};

/** Lencana putusan perbandingan (≠, =, VS, >, <) digambar SVG. (x, y) = tengah. */
const Verdict: React.FC<{ x: number; y: number; kind: 'neq' | 'vs' | 'eq' | 'gt' | 'lt'; s: number; p: number }> = ({ x, y, kind, s, p }) => (
  <svg style={{ position: 'absolute', left: x - 80, top: y - 80, overflow: 'visible', transform: `scale(${s})` }} width={160} height={160} viewBox="-80 -80 160 160">
    <circle r={74} fill="#FFFFFF" stroke={INK} strokeWidth={8} />
    {(kind === 'neq' || kind === 'eq') &&
      [-20, 20].map((dy) => (
        <g key={dy}>
          <line x1={-40} y1={dy} x2={40} y2={dy} stroke={INK} strokeWidth={20} strokeLinecap="round" />
          <line x1={-40} y1={dy} x2={40} y2={dy} stroke={colors.yellow} strokeWidth={9} strokeLinecap="round" />
        </g>
      ))}
    {kind === 'neq' && (
      <>
        <line x1={26} y1={-54} x2={26 - 52 * p} y2={-54 + 108 * p} stroke={INK} strokeWidth={22} strokeLinecap="round" />
        <line x1={26} y1={-54} x2={26 - 52 * p} y2={-54 + 108 * p} stroke="#E5484D" strokeWidth={11} strokeLinecap="round" />
      </>
    )}
    {(kind === 'vs' || kind === 'gt' || kind === 'lt') && (
      <text x={0} y={kind === 'vs' ? 20 : 26} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={kind === 'vs' ? 60 : 96} fill="#E5484D" stroke={INK} strokeWidth={4} paintOrder="stroke">
        {kind === 'vs' ? 'VS' : kind === 'gt' ? '>' : '<'}
      </text>
    )}
  </svg>
);

// ================================================================== isi tiap jenis scene
const Body: React.FC<{ def: SceneDef; box: Box; at: (r: Ref) => number; L: Layout; start: number; dur: number }> = ({ def, box, at, L, start, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = L.wide;
  switch (def.type) {
    // -------------------------------------------------------------- kartu bab
    case 'title': {
      const k = popAt(frame, 2, fps, 9);
      const t = popAt(frame, 6, fps, 9);
      const s2 = popAt(frame, 12, fps, 10);
      return (
        <>
          {def.kicker && k > 0 && (
            <div style={{ position: 'absolute', left: box.cx, top: box.y + (w ? 90 : 120), transform: `translate(-50%, -50%) scale(${k}) rotate(-3deg)`, background: colors.yellow, border: `6px solid ${INK}`, borderRadius: 999, padding: '8px 36px 14px', fontFamily: fonts.display, fontWeight: 700, fontSize: w ? 56 : 52, color: INK, whiteSpace: 'nowrap' }}>
              {def.kicker}
            </div>
          )}
          {t > 0 && <StrokeText text={def.title} x={box.cx} y={box.cy} size={w ? 116 : 100} color="#FFFFFF" s={t} maxW={box.w} rot={-2} />}
          {def.sub && s2 > 0 && <StrokeText text={def.sub} x={box.cx} y={box.y + box.h - (w ? 90 : 60)} size={w ? 48 : 44} color={colors.yellow} s={s2} maxW={box.w} />}
        </>
      );
    }
    // -------------------------------------------------------------- pertanyaan / hook
    case 'question': {
      const a = atOr(at, def.at);
      const s = popAt(frame, a, fps, 9);
      const hasIcon = !!def.icon;
      const size = w ? 100 : 88;
      return (
        <>
          {hasIcon && s > 0 && <Icon name={def.icon!} x={box.cx} y={box.y + (w ? 120 : 150) + Math.sin(frame / 10) * 8} size={w ? 200 : 220} s={s} />}
          {s > 0 && <StrokeText text={def.text} x={box.cx} y={hasIcon ? box.y + box.h * 0.66 : box.cy} size={size} s={s} maxW={box.w} rot={-2} />}
          <QMark x={box.x + 70} y={box.y + 60} size={110} at={a + 6} spin={0.2} />
          <QMark x={box.x + box.w - 70} y={box.y + box.h - 80} size={90} at={a + 12} />
        </>
      );
    }
    // -------------------------------------------------------------- penjelasan
    case 'explain': {
      const pts = def.points ?? [];
      const v = def.visual;
      let vb: Box = box;
      let pb: Box = box;
      if (v && pts.length) {
        if (w) {
          const vw = box.w * 0.44;
          vb = { ...box, w: vw, cx: box.x + vw / 2 };
          pb = { x: box.x + vw + 30, y: box.y, w: box.w - vw - 30, h: box.h, cx: box.x + vw + 30 + (box.w - vw - 30) / 2, cy: box.cy };
        } else {
          const vh = box.h * (pts.length <= 1 ? 0.74 : pts.length === 2 ? 0.62 : 0.52);
          vb = { ...box, h: vh, cy: box.y + vh / 2 };
          pb = { x: box.x, y: box.y + vh + 10, w: box.w, h: box.h - vh - 10, cx: box.cx, cy: box.y + vh + 10 + (box.h - vh - 10) / 2 };
        }
      }
      return (
        <>
          {v && <VisualView v={v} box={vb} at={at} L={L} />}
          {pts.length > 0 && <PointsView points={pts} box={pb} at={at} L={L} />}
        </>
      );
    }
    // -------------------------------------------------------------- angka besar
    case 'fact': {
      const a = atOr(at, def.at);
      const s = popAt(frame, a, fps, 8);
      let text = def.value;
      if (def.countUp && frame >= a) {
        const c = def.countUp;
        const val = ease(frame, [a, a + (c.dur ?? 30)], [c.from, c.to]);
        text = `${c.prefix ?? ''}${val.toLocaleString('id-ID', { minimumFractionDigits: c.decimals ?? 0, maximumFractionDigits: c.decimals ?? 0 })}${c.suffix ?? ''}`;
      }
      const base = w ? 210 : 170;
      const size = base * Math.min(1, 8 / Math.max(1, def.value.length));
      const glow = frame >= a ? lerp(frame, [a, a + 20], [1, 0.35]) : 0;
      return (
        <>
          {def.label && <StrokeText text={def.label} x={box.cx} y={box.cy - size * 0.95} size={w ? 58 : 54} color="#FFFFFF" maxW={box.w} />}
          {glow > 0 && <div style={{ position: 'absolute', left: box.cx - 300, top: box.cy - 220, width: 600, height: 440, borderRadius: '50%', background: `radial-gradient(rgba(255,210,63,${0.55 * glow}), rgba(255,210,63,0) 70%)` }} />}
          {s > 0 && <StrokeText text={text} x={box.cx} y={box.cy} size={size} color={TONE[def.tone ?? 'yellow']} s={s} rot={-3} />}
          {def.sub && s > 0 && <StrokeText text={def.sub} x={box.cx} y={box.cy + size * 0.95} size={w ? 46 : 42} color="#FFFFFF" s={Math.min(1, s)} maxW={box.w} />}
          {frame >= a && frame < a + 60 && <Sparkles x={box.cx} y={box.cy} spread={size * 1.6} n={7} seed={`f${start}`} />}
        </>
      );
    }
    // -------------------------------------------------------------- A vs B
    case 'compare': {
      const gap = w ? 260 : 70;
      const cw = (box.w - gap) / 2;
      const ch = box.h;
      const sides = [def.left, def.right].map((sd, i) => ({ sd, i, s: popAt(frame, atOr(at, sd.at, i * 8), fps, 10) }));
      return (
        <>
          {sides.map(({ sd, i, s }) =>
            s > 0 ? (
              <Card key={i} x={box.x + i * (cw + gap)} y={box.y} w={cw} h={ch} s={s} rot={i ? 1.5 : -1.5}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: w ? 100 : 92, background: FILL[sd.tone ?? (i ? 'blue' : 'pink')], borderBottom: `5px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontWeight: 700, fontSize: (w ? 50 : 40) * Math.min(1, 14 / Math.max(1, sd.title.length)), color: '#FFFFFF', padding: '0 16px', textAlign: 'center' }}>
                  {sd.title}
                </div>
                {sd.icon && <Icon name={sd.icon} x={cw / 2} y={(w ? 100 : 92) + (w ? 105 : 100)} size={w ? 170 : 150} />}
                {sd.value && (
                  <div style={{ position: 'absolute', left: 0, right: 0, top: sd.icon ? (w ? 300 : 285) : w ? 140 : 130, textAlign: 'center', fontFamily: fonts.display, fontWeight: 700, fontSize: (w ? 76 : 64) * Math.min(1, 9 / Math.max(1, sd.value.length)), color: FILL[sd.tone ?? (i ? 'blue' : 'pink')], WebkitTextStroke: `3px ${INK}`, paintOrder: 'stroke fill' }}>{sd.value}</div>
                )}
                {(sd.items ?? []).map((it, j) => (
                  <div key={j} style={{ position: 'absolute', left: 26, right: 20, top: (sd.icon ? (w ? 300 : 285) : w ? 140 : 130) + (sd.value ? (w ? 100 : 90) : 0) + j * (w ? 54 : 50), fontFamily: fonts.display, fontWeight: 600, fontSize: w ? 36 : 32, color: INK, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    • {it}
                  </div>
                ))}
              </Card>
            ) : null
          )}
          {def.verdict && frame >= at(def.verdict.at) && (
            <>
              <Verdict x={box.cx} y={box.y + (w ? 150 : 170)} kind={def.verdict.kind} s={pop(frame, at(def.verdict.at), fps, 9)} p={ease(frame, [at(def.verdict.at), at(def.verdict.at) + 10], [0, 1])} />
              {def.verdict.text && <StrokeText text={def.verdict.text} x={box.cx} y={box.y + (w ? 270 : 290)} size={w ? 44 : 40} color={colors.yellow} s={pop(frame, at(def.verdict.at) + 4, fps, 10)} />}
            </>
          )}
        </>
      );
    }
    // -------------------------------------------------------------- daftar
    case 'list': {
      const n = def.items.length;
      const pad = def.title ? 50 : 30;
      const rowH = Math.min(w ? 120 : 112, (box.h - pad * 2) / n);
      const top = box.cy - (rowH * n) / 2 + rowH / 2 + (def.title ? 14 : 0);
      return (
        <Card x={box.x} y={box.y} w={box.w} h={box.h} title={def.title}>
          {def.items.map((it, i) => {
            const s = popAt(frame, at(it.at), fps, 10);
            if (s <= 0) return null;
            const mark = it.mark ?? (it.icon ? undefined : 'num');
            const y = top - box.y + i * rowH;
            return (
              <div key={i} style={{ position: 'absolute', left: 30, right: 30, top: y - rowH / 2, height: rowH, transform: `scale(${s})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: 84, height: 84, flex: 'none' }}>
                  {mark === 'num' ? (
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: colors.yellow, border: `5px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontWeight: 700, fontSize: 46, color: INK }}>{i + 1}</div>
                  ) : (
                    <IconBadge name={mark === 'check' ? 'check' : mark === 'cross' ? 'cross' : it.icon!} x={42} y={42} size={84} />
                  )}
                </div>
                <div style={{ marginLeft: 26, fontFamily: fonts.display, fontWeight: 600, fontSize: it.text.length > 34 ? (w ? 38 : 34) : n <= 4 ? (w ? 50 : 42) : w ? 44 : 40, color: TONE[it.tone ?? 'ink'] === '#FFFFFF' ? INK : it.tone ? FILL[it.tone] : INK, lineHeight: 1.1 }}>{it.text}</div>
              </div>
            );
          })}
        </Card>
      );
    }
    // -------------------------------------------------------------- grafik batang
    case 'chart': {
      const bars = def.bars;
      const maxPos = Math.max(0, ...bars.map((b) => b.value));
      const maxNeg = Math.max(0, ...bars.map((b) => -b.value));
      const innerTop = 90;
      const innerBot = box.h - 90;
      const span = innerBot - innerTop;
      const zeroY = innerTop + (span * maxPos) / Math.max(1e-6, maxPos + maxNeg);
      const unit = (Math.max(maxPos, maxNeg) > 0 ? span / (maxPos + maxNeg) : 0);
      const n = bars.length;
      const slot = (box.w - 80) / n;
      const bw = Math.min(150, slot * 0.6);
      const hi = def.highlight && frame >= at(def.highlight.at) ? def.highlight.index : -1;
      return (
        <Card x={box.x} y={box.y} w={box.w} h={box.h} title={def.title}>
          <svg style={{ position: 'absolute', left: 0, top: 0 }} width={box.w} height={box.h}>
            <line x1={30} y1={zeroY} x2={box.w - 30} y2={zeroY} stroke={INK} strokeWidth={5} />
            {bars.map((b, i) => {
              const a = atOr(at, b.at, i * 6);
              const g = ease(frame, [a, a + 14], [0, 1]);
              const hgt = Math.abs(b.value) * unit * g;
              const x = 40 + slot * (i + 0.5) - bw / 2;
              const y = b.value >= 0 ? zeroY - hgt : zeroY;
              const fill = FILL[b.tone ?? (b.value >= 0 ? 'green' : 'red')];
              return (
                <g key={i}>
                  {hi === i && <rect x={x - 14} y={y - 14} width={bw + 28} height={hgt + 28} rx={18} fill={colors.yellow} opacity={0.5} />}
                  {hgt > 0.5 && <rect x={x} y={y} width={bw} height={hgt} rx={10} fill={fill} stroke={INK} strokeWidth={5} />}
                </g>
              );
            })}
          </svg>
          {bars.map((b, i) => {
            const a = atOr(at, b.at, i * 6);
            if (frame < a + 6) return null;
            const hgt = Math.abs(b.value) * unit;
            const cx = 40 + slot * (i + 0.5);
            const ly = b.value >= 0 ? zeroY - hgt - 34 : zeroY - 34;
            return (
              <React.Fragment key={i}>
                <div style={{ position: 'absolute', left: cx - 150, width: 300, top: ly - 26, textAlign: 'center', fontFamily: fonts.display, fontWeight: 700, fontSize: hi === i ? 50 : 42, color: INK }}>{b.text ?? `${b.value}${def.unit ?? ''}`}</div>
                <div style={{ position: 'absolute', left: cx - slot / 2, width: slot, top: box.h - 70, textAlign: 'center', fontFamily: fonts.display, fontWeight: 600, fontSize: w ? 34 : 30, color: '#5B5875', lineHeight: 1.05 }}>{b.label}</div>
              </React.Fragment>
            );
          })}
        </Card>
      );
    }
    // -------------------------------------------------------------- peta di HP
    case 'map': {
      const pts = def.points ?? [];
      const phoneW = w ? Math.min(330, (box.h / 1.9) * 0.98) : pts.length ? 330 : Math.min(380, (box.h / 1.9) * 0.98);
      const phoneH = phoneW * 1.9;
      const px = w && pts.length ? box.x + 40 + phoneW / 2 : box.cx;
      const dotT = def.dot ? ease(frame, [at(def.dot.at), at(def.dot.until)], [def.dot.from, def.dot.to]) : 0.1;
      const segE = (def.segs ?? []).map((s) => ({ ...s, f: atOr(at, s.at) })).filter((s) => frame >= s.f);
      const seg = segE.length ? last(segE) : undefined;
      const etaE = (def.etas ?? []).map((e) => ({ ...e, f: atOr(at, e.at) })).filter((e) => frame >= e.f);
      const eta = etaE.length ? last(etaE) : undefined;
      const pb: Box = { x: px + phoneW / 2 + 40, y: box.y, w: box.x + box.w - (px + phoneW / 2 + 40), h: box.h, cx: 0, cy: box.cy };
      pb.cx = pb.x + pb.w / 2;
      const ptsVisible = pts.filter((p) => frame >= at(p.at));
      return (
        <>
          <BigPhone x={px} y={box.cy} w={phoneW} rot={-2}>
            <MapView w={phoneW * 0.91} h={phoneH - phoneW * 0.09} frame={frame} dotT={dotT} seg={seg?.seg} pulse={seg?.pulse} eta={eta?.eta} etaSub={eta?.sub} etaColor={eta?.color}>
              {(def.chips ?? []).map((c, i) => {
                const a = at(c.at);
                if (frame < a || (c.until !== undefined && frame > at(c.until))) return null;
                return <MapChip key={i} x={c.x} y={c.y} text={c.text} color={c.color} s={pop(frame, a, fps, 9)} />;
              })}
            </MapView>
          </BigPhone>
          {w && pts.length > 0 && <PointsView points={pts} box={pb} at={at} L={L} />}
          {!w && ptsVisible.length > 0 && (
            <StrokeText text={last(ptsVisible).text} x={L.W / 2} y={box.y - 10} size={44} color="#FFFFFF" s={pop(frame, at(last(ptsVisible).at), fps, 10)} maxW={L.W - 120} />
          )}
        </>
      );
    }
    // -------------------------------------------------------------- garis waktu
    case 'timeline': {
      const evs = def.events;
      const n = evs.length;
      const shown = evs.filter((e) => frame >= at(e.at)).length;
      if (w) {
        const ly = box.y + box.h * 0.38;
        const step = box.w / n;
        const lineP = n ? ease(frame, [at(evs[0].at) - 6, at(evs[Math.max(0, shown - 1)].at) + 8], [0, (Math.max(1, shown) - 0.5) / n]) : 0;
        return (
          <>
            <div style={{ position: 'absolute', left: box.x, top: ly - 7, width: box.w * lineP, height: 14, borderRadius: 7, background: '#FFFFFF', border: `4px solid ${INK}` }} />
            {evs.map((e, i) => {
              const s = popAt(frame, at(e.at), fps, 9);
              if (s <= 0) return null;
              const x = box.x + step * (i + 0.5);
              return (
                <React.Fragment key={i}>
                  <div style={{ position: 'absolute', left: x, top: ly, transform: `translate(-50%, -50%) scale(${s})`, background: FILL[e.tone ?? 'yellow'], border: `6px solid ${INK}`, borderRadius: 999, padding: '6px 26px 10px', fontFamily: fonts.display, fontWeight: 700, fontSize: 48, color: e.tone && e.tone !== 'yellow' && e.tone !== 'white' ? '#FFFFFF' : INK, whiteSpace: 'nowrap' }}>{e.label}</div>
                  <Card x={x - step / 2 + 14} y={ly + 70} w={step - 28} h={box.h * 0.5} s={s}>
                    <div style={{ position: 'absolute', inset: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: fonts.display, fontWeight: 600, fontSize: e.text.length > 40 ? 30 : 36, lineHeight: 1.12, color: INK }}>{e.text}</div>
                  </Card>
                </React.Fragment>
              );
            })}
          </>
        );
      }
      const lx = box.x + 110;
      const step = box.h / n;
      const lineP = n ? ease(frame, [at(evs[0].at) - 6, at(evs[Math.max(0, shown - 1)].at) + 8], [0, (Math.max(1, shown) - 0.5) / n]) : 0;
      return (
        <>
          <div style={{ position: 'absolute', left: lx - 7, top: box.y, width: 14, height: box.h * lineP, borderRadius: 7, background: '#FFFFFF', border: `4px solid ${INK}` }} />
          {evs.map((e, i) => {
            const s = popAt(frame, at(e.at), fps, 9);
            if (s <= 0) return null;
            const y = box.y + step * (i + 0.5);
            return (
              <React.Fragment key={i}>
                <Card x={lx + 40} y={y - step * 0.4} w={box.x + box.w - lx - 40} h={step * 0.8} s={s}>
                  <div style={{ position: 'absolute', inset: '12px 20px 12px 90px', display: 'flex', alignItems: 'center', fontFamily: fonts.display, fontWeight: 600, fontSize: e.text.length > 40 ? 30 : 36, lineHeight: 1.12, color: INK }}>{e.text}</div>
                </Card>
                <div style={{ position: 'absolute', left: lx, top: y, transform: `translate(-50%, -50%) scale(${s})`, background: FILL[e.tone ?? 'yellow'], border: `6px solid ${INK}`, borderRadius: 999, padding: '4px 20px 8px', fontFamily: fonts.display, fontWeight: 700, fontSize: 42, color: e.tone && e.tone !== 'yellow' && e.tone !== 'white' ? '#FFFFFF' : INK, whiteSpace: 'nowrap' }}>{e.label}</div>
              </React.Fragment>
            );
          })}
        </>
      );
    }
    // -------------------------------------------------------------- zoom-out ke Bumi
    case 'zoom': {
      const r = Math.min(box.w, box.h) * 0.3;
      const z = lerp(frame, [0, Math.min(45, dur * 0.5)], [def.zoomFrom ?? 2.6, 1]);
      const zz = z;
      const nSat = def.sats ?? 3;
      const sats = Array.from({ length: nSat }, (_, i) => {
        const a = frame * 0.025 + (i * 2 * Math.PI) / Math.max(1, nSat);
        return { x: box.cx + Math.cos(a) * r * 1.9, y: box.cy + Math.sin(a) * r * 0.55, front: Math.sin(a) > 0 };
      });
      const ls = def.labelAt !== undefined ? popAt(frame, at(def.labelAt), fps, 10) : 0;
      return (
        <>
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${zz})`, transformOrigin: `${box.cx}px ${box.cy}px` }}>
            <svg style={{ position: 'absolute', left: 0, top: 0, opacity: Math.min(1, frame / 20) }} width={L.W} height={L.H}>
              <ellipse cx={box.cx} cy={box.cy} rx={r * 1.9} ry={r * 0.55} fill="none" stroke="#9FB2E8" strokeWidth={5} strokeDasharray="18 16" strokeDashoffset={-frame * 1.5} />
            </svg>
            {sats.filter((s) => !s.front).map((s, i) => (
              <MiniSat key={`b${i}`} x={s.x} y={s.y} s={0.8} />
            ))}
            <Earth cx={box.cx} cy={box.cy} r={r} id={`kz${start}`} spin={frame * 0.004} />
            {sats.filter((s) => s.front).map((s, i) => (
              <MiniSat key={`f${i}`} x={s.x} y={s.y} s={0.95} />
            ))}
          </div>
          {def.label && ls > 0 && (
            <div style={{ position: 'absolute', left: box.cx, top: box.cy + r + (w ? 70 : 90), transform: `translate(-50%, -50%) scale(${ls})`, background: '#FFFFFF', border: `6px solid ${INK}`, borderRadius: 999, padding: '8px 30px 12px', fontFamily: fonts.display, fontWeight: 700, fontSize: w ? 44 : 42, color: INK, whiteSpace: 'nowrap' }}>{def.label}</div>
          )}
        </>
      );
    }
    // -------------------------------------------------------------- papan kapur
    case 'board': {
      const chalk = { white: '#F4F1E8', yellow: '#FFE88A', red: '#FFB0A8', green: '#B6F0C8', blue: '#A8D8FF', pink: '#FFC2D1', ink: '#F4F1E8' } as const;
      const sz = { big: w ? 96 : 80, normal: w ? 54 : 48, small: w ? 38 : 34 };
      const hs = def.lines.map((l) => sz[l.size ?? 'normal'] * 1.35);
      const total = hs.reduce((a, b) => a + b, 0);
      let y = box.cy - total / 2;
      return (
        <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, background: '#9B6B43', border: `6px solid ${INK}`, borderRadius: 20 }}>
          <div style={{ position: 'absolute', left: 20, right: 20, top: 20, bottom: 20, background: '#2F5D50', border: `5px solid ${INK}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.08), transparent 60%)' }} />
            {def.lines.map((l, i) => {
              const h = hs[i];
              const cy = y + h / 2 - box.y - 20;
              y += h;
              return (
                <Reveal key={i} frame={frame} at={at(l.at)} dur={Math.min(18, 6 + l.text.length / 2)}>
                  <div style={{ position: 'absolute', left: 0, right: 0, top: cy, transform: 'translateY(-50%)', textAlign: 'center', fontFamily: fonts.display, fontWeight: l.size === 'big' ? 700 : 600, fontSize: sz[l.size ?? 'normal'], color: chalk[l.tone ?? 'white'], whiteSpace: 'nowrap', textShadow: '0 0 2px rgba(255,255,255,0.35)', lineHeight: 1.05 }}>{l.text}</div>
                </Reveal>
              );
            })}
          </div>
        </div>
      );
    }
    case 'custom':
      return <>{def.render({ frame, L, at, start, dur })}</>;
  }
};

// ================================================================== bungkus scene
export const KitScene: React.FC<{ def: SceneDef; T: KitT; start: number; dur: number; first: boolean; ask?: { line1: string; line2: string; at: number } }> = ({ def, T, start, dur, first, ask }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const at = (r: Ref) => refAbs(T, r, start) - start;
  const d = sceneDefaults(def, L, at);
  const side = (def.nabel && def.nabel.side) || d.side;
  const box = L.content(side);
  const o = first ? 1 : lerp(frame, [0, 4], [0, 1]);
  const sc = first ? 1 : lerp(frame, [0, 7], [1.04, 1]);
  const askS = ask ? popAt(frame, ask.at - start, fps, 10) : 0;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ opacity: o, transform: `scale(${sc})` }}>
        <Bg def={def.bg ?? d.bg} />
        <Body def={def} box={box} at={at} L={L} start={start} dur={dur} />
        <KitNabel def={def.nabel} defaultSide={d.side} defaultMoods={d.moods} at={at} L={L} lookTo={{ x: box.cx, y: box.cy }} />
        {def.extra?.({ frame, L, at })}
      </AbsoluteFill>
      <Heading items={normHeading(def.heading, at)} L={L} />
      {ask && askS > 0 && <AskBox s={askS} line1={ask.line1} line2={ask.line2} />}
    </AbsoluteFill>
  );
};
