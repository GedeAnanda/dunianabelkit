import type React from 'react';
import type { NabelCurl, NabelExpression, NabelPose } from '../shared/Nabel';
import type { VoTimeline } from '../shared/timeline';
import type { Box, Layout, Side } from './layout';
import type { IconName } from './icons';
import type { BgDef } from './backgrounds';
import type { SegKey } from '../maps/props';

/**
 * Waktu di storyboard:
 *  - "c05"      = awal cue c05
 *  - "c05>"     = akhir cue c05
 *  - "c05@0.5"  = setengah jalan cue c05
 *  - akhiran "+6" / "-4" = geser sekian frame (30 fps), mis. "c05>+10"
 *  - angka      = frame sejak scene mulai
 */
export type Ref = string | number;

export type Tone = 'yellow' | 'white' | 'red' | 'green' | 'blue' | 'pink' | 'ink';

export type HeadingItem = { at?: Ref; text: string; tone?: Tone };

export type Mood = { at?: Ref; expr: NabelExpression; pose?: NabelPose; curl?: NabelCurl };

export type NabelDef =
  | false
  | {
      side?: Side;
      /** Pengali ukuran (1 = standar). */
      scale?: number;
      moods?: Mood[];
      /** Gelembung teks tanpa suara di atas Nabel (Nabel tidak bicara). */
      bubble?: { at: Ref; until?: Ref; text: string };
      sparkleAt?: Ref;
    };

export type SfxCue = { at: Ref; name: string; v?: number };

export type Point = { at: Ref; text: string; icon?: IconName; tone?: Tone };

export type Visual =
  | { kind: 'icon'; name: IconName; at?: Ref; tone?: Tone; label?: string }
  | { kind: 'icons'; items: Array<{ name: IconName; at?: Ref; label?: string; tone?: Tone }> }
  | { kind: 'text'; text: string; at?: Ref; tone?: Tone }
  | {
      kind: 'phoneMap';
      at?: Ref;
      seg?: Partial<Record<SegKey, string>>;
      dotT?: number;
      eta?: string;
      etaSub?: string;
      etaColor?: string;
    }
  | { kind: 'node'; render: (p: { frame: number; box: Box; L: Layout; at: (r: Ref) => number }) => React.ReactNode };

type Common = {
  /** Cue tempat scene dimulai (scene mulai 0,2 dtk sebelum cue ini). */
  from: string;
  bg?: BgDef;
  heading?: string | HeadingItem[];
  nabel?: NabelDef;
  sfx?: SfxCue[];
  /** Matikan SFX bawaan jenis scene ini. */
  noAutoSfx?: boolean;
  /** Elemen tambahan bebas di atas scene (posisi absolut, koordinat layar). */
  extra?: (p: { frame: number; L: Layout; at: (r: Ref) => number }) => React.ReactNode;
};

export type SceneDef = Common &
  (
    | { type: 'title'; kicker?: string; title: string; sub?: string }
    | { type: 'question'; text: string; at?: Ref; icon?: IconName }
    | { type: 'explain'; visual?: Visual; points?: Point[] }
    | {
        type: 'fact';
        value: string;
        at?: Ref;
        label?: string;
        sub?: string;
        tone?: Tone;
        countUp?: { from: number; to: number; decimals?: number; prefix?: string; suffix?: string; dur?: number };
      }
    | {
        type: 'compare';
        left: CompareSide;
        right: CompareSide;
        verdict?: { at: Ref; kind: 'neq' | 'vs' | 'eq' | 'gt' | 'lt'; text?: string };
      }
    | { type: 'list'; title?: string; items: Array<Point & { mark?: 'check' | 'cross' | 'num' }> }
    | { type: 'chart'; title?: string; unit?: string; bars: Array<{ label: string; value: number; at?: Ref; tone?: Tone; text?: string }>; highlight?: { index: number; at: Ref } }
    | {
        type: 'map';
        dot?: { from: number; to: number; at: Ref; until: Ref };
        segs?: Array<{ at?: Ref; seg: Partial<Record<SegKey, string>>; pulse?: SegKey }>;
        etas?: Array<{ at?: Ref; eta: string; sub?: string; color?: string }>;
        chips?: Array<{ at: Ref; until?: Ref; x: number; y: number; text: string; color: string }>;
        points?: Point[];
      }
    | { type: 'timeline'; events: Array<{ at: Ref; label: string; text: string; tone?: Tone }> }
    | { type: 'zoom'; label?: string; labelAt?: Ref; sats?: number; zoomFrom?: number }
    | { type: 'board'; lines: Array<{ at: Ref; text: string; tone?: Tone; size?: 'big' | 'normal' | 'small' }> }
    | { type: 'custom'; render: (p: { frame: number; L: Layout; at: (r: Ref) => number; start: number; dur: number }) => React.ReactNode }
  );

export type CompareSide = { title: string; tone?: Tone; icon?: IconName; value?: string; items?: string[]; at?: Ref };

export type MusicName = 'bed-ceria' | 'bed-mewah' | 'bed-futur' | 'bed-renung';

export type Storyboard = {
  id: string;
  timeline: VoTimeline;
  /** File VO di public/ (mis. 'vo-einstein.wav'). Kosongkan untuk pratinjau tanpa suara. */
  vo?: string;
  music?: MusicName | null;
  musicGain?: number;
  /** Kata yang diwarnai kuning di caption. */
  keywords?: string[];
  scenes: SceneDef[];
  /** Kotak ajakan diskusi di akhir (muncul setelah cue terakhir). */
  ask?: { line1: string; line2: string };
  outroGap?: number;
  outroLen?: number;
};
