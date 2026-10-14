import React from 'react';
import { AbsoluteFill, Audio, Composition, interpolate, Sequence, staticFile } from 'remotion';
import { createTimeline, sec, VoTimeline } from '../shared/timeline';
import { KitCaption, KitOutro, refAbs } from './parts';
import { KitScene, sceneAutoSfx } from './scenes';
import type { Ref, Storyboard } from './types';

/**
 * Nabel Kit — satu storyboard jadi satu episode utuh: scene, caption, VO, musik (ducking), SFX otomatis, outro.
 * Daftarkan dengan <KitCompositions sb={...} /> di Root: otomatis jadi dua composition,
 *   <id>      16:9 1920x1080 (video panjang)
 *   <id>Tall  9:16 1080x1920 (Shorts; potong pakai --frames=awal-akhir)
 */
export const makeKitTimeline = (sb: Storyboard) =>
  createTimeline(
    sb.timeline,
    sb.scenes.map((s, i) => ({ key: `s${i}`, firstCue: s.from })),
    { outroGap: sb.outroGap ?? 2.2, outroLen: sb.outroLen ?? 2.6 }
  );
type KT = ReturnType<typeof makeKitTimeline>;

/** SFX berekor panjang: diturunkan lebih banyak kalau jatuh saat narator bicara. */
const LONG_TAIL = new Set(['ding', 'sparkle', 'kaching', 'swell', 'suspense', 'tada', 'whoosh-long', 'slot-spin', 'shield', 'zoom-out', 'drumroll', 'bubbles', 'tape-stop', 'sonar', 'warp', 'ratchet', 'boing', 'traffic', 'machine', 'car-horn', 'data', 'scooter', 'cart', 'eraser', 'alarm', 'rumble', 'horn', 'ring']);

type Sfx = { at: number; name: string; v: number };

export const buildSfx = (sb: Storyboard, T: KT): Sfx[] => {
  const out: Sfx[] = [];
  const ends = T.CUES.map((c) => sec(c.end));
  const lastEndBefore = (f: number) => Math.max(0, ...ends.filter((e) => e <= f));
  // whoosh di jeda antar-scene (dilewati kalau jeda < 10 frame)
  T.SCENES.forEach((s, i) => {
    if (i === 0 || s.key === 'outro') return;
    const firstCue = sec(T.cue(sb.scenes[i].from).start);
    const prevEnd = lastEndBefore(s.from + 6);
    if (firstCue - prevEnd >= 10) out.push({ at: Math.max(s.from - 10, prevEnd + 1), name: 'whoosh', v: 0.24 });
  });
  sb.scenes.forEach((def, i) => {
    const st = T.SCENES[i].from;
    const at = (r: Ref) => refAbs(T, r, st) - st;
    if (!def.noAutoSfx) for (const x of sceneAutoSfx(def, at)) out.push({ at: st + x.at, name: x.name, v: x.v });
    for (const x of def.sfx ?? []) out.push({ at: refAbs(T, x.at, st), name: x.name, v: x.v ?? 0.35 });
  });
  if (sb.ask) out.push({ at: sec(T.CUES[T.CUES.length - 1].end) + 10, name: 'pop', v: 0.5 });
  out.push({ at: T.sceneStart('outro') + 4, name: 'ding', v: 0.7 });
  return out;
};

/** Aturan volume anti-nimpa-suara: saat bicara 70% (ekor panjang 50%); tepat sebelum kalimat mulai (≤8 frame) 50%. */
const sfxVolume = (T: KT, s: Sfx) => {
  const starts = T.CUES.map((c) => sec(c.start));
  const preSpeech = starts.some((a) => a > s.at && a - s.at <= 8);
  const k = T.isSpeaking(s.at) ? (LONG_TAIL.has(s.name) ? 0.5 : 0.7) : preSpeech ? (LONG_TAIL.has(s.name) ? 0.4 : 0.5) : 1;
  return s.v * k;
};

export const KitEpisode: React.FC<{ sb: Storyboard }> = ({ sb }) => {
  const T = React.useMemo(() => makeKitTimeline(sb), [sb]);
  const sfx = React.useMemo(() => buildSfx(sb, T), [sb, T]);
  const lastCue = T.CUES[T.CUES.length - 1];
  const music = sb.music === undefined ? 'bed-ceria' : sb.music;
  const gain = sb.musicGain ?? 1;
  const musicVolume = (f: number) => {
    const total = T.TOTAL_FRAMES;
    const fadeIn = interpolate(f, [0, 12], [0.4, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(f, [total - 30, total], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const duck = T.speechAmount(f, 8);
    return (0.34 - 0.21 * duck) * fadeIn * fadeOut * gain;
  };
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {T.SCENES.map((s, i) =>
        s.key === 'outro' ? (
          <Sequence key="outro" name="outro" from={s.from} durationInFrames={s.duration}>
            <KitOutro />
          </Sequence>
        ) : (
          <Sequence key={s.key} name={`${i + 1}. ${sb.scenes[i].type}`} from={s.from} durationInFrames={s.duration}>
            <KitScene
              def={sb.scenes[i]}
              T={T}
              start={s.from}
              dur={s.duration}
              first={i === 0}
              ask={i === sb.scenes.length - 1 && sb.ask ? { ...sb.ask, at: sec(lastCue.end) + 10 } : undefined}
            />
          </Sequence>
        )
      )}
      {T.CAPTION_CUES.map((c, i, all) => {
        const next = all[i + 1];
        const endF = next ? Math.min(sec(c.end) + 4, sec(next.start) - 8) : sec(c.end) + 4;
        return <KitCaption key={c.id} text={c.text} start={sec(c.start)} end={endF} keywords={sb.keywords ?? []} />;
      })}
      {sb.vo && <Audio src={staticFile(sb.vo)} />}
      {music && <Audio src={staticFile(`music/${music}.wav`)} loop volume={musicVolume} />}
      {sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.at))} durationInFrames={90} layout="none">
          <Audio src={staticFile(`sfx/v2/${s.name}.wav`)} volume={sfxVolume(T, s)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** Daftarkan episode kit sebagai dua composition: `<id>` (16:9) dan `<id>Tall` (9:16). */
export const KitCompositions: React.FC<{ sb: Storyboard }> = ({ sb }) => {
  const frames = makeKitTimeline(sb).TOTAL_FRAMES;
  const Comp = React.useCallback(() => <KitEpisode sb={sb} />, [sb]);
  return (
    <>
      <Composition id={sb.id} component={Comp} durationInFrames={frames} fps={30} width={1920} height={1080} />
      <Composition id={`${sb.id}Tall`} component={Comp} durationInFrames={frames} fps={30} width={1080} height={1920} />
    </>
  );
};

/**
 * Timeline palsu untuk pratinjau tanpa VO (galeri, draf storyboard sebelum rekaman).
 * `scenes[i]` = daftar teks caption scene i; tiap cue `durSec` detik, jeda `gapSec`. Id cue: g<scene>_<n>.
 */
export const fakeTimeline = (scenes: string[][], durSec = 1.8, gapSec = 0.5): VoTimeline => {
  const cues: VoTimeline['cues'] = [];
  let t = 0.4;
  scenes.forEach((texts, i) =>
    texts.forEach((text, j) => {
      cues.push({ id: `g${i}_${j}`, start: +t.toFixed(2), end: +(t + durSec).toFixed(2), speaker: 'narrator', text });
      t += durSec + gapSec;
    })
  );
  return { durationSec: +(t + 0.3).toFixed(2), cues };
};
