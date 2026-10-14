# Nabel Kit — episode dari storyboard

Tujuan: episode baru (Shorts atau video panjang 8–10 menit) cukup ditulis sebagai **satu file storyboard**, tanpa kode scene baru. Satu storyboard otomatis jadi dua composition:

| Composition | Ukuran | Untuk |
|---|---|---|
| `<id>` | 1920×1080 (16:9) | video panjang YouTube |
| `<id>Tall` | 1080×1920 (9:16) | Shorts/TikTok/Reels — potong pakai `--frames=awal-akhir` |

Contoh lengkap: `demo/einstein.ts` (episode Einstein & GPS, 12 scene) dan `demo/gallery.tsx` (katalog semua jenis scene, tanpa VO).

## Alur per episode

1. Rekam VO → `voice/<topik>.json` (cue + `raw`/`clarity`) → `python3 tools/build_vo.py voice/<topik>.json src/<topik>/vo-timeline.json public/vo-<topik>.wav` (sama seperti sebelumnya).
2. Tulis `src/<topik>/storyboard.ts` (lihat template di bawah).
3. Daftarkan di `src/Root.tsx`: `<KitCompositions sb={storyboardTopik} />`.
4. Cek still beberapa frame → render:
   - panjang: `npx remotion render <Id> out/<topik>.mp4`
   - Shorts: `npx remotion render <Id>Tall out/<topik>-short1.mp4 --frames=0-1700`

Draf sebelum rekaman: pakai `fakeTimeline([...])` (lihat `demo/gallery.tsx`) supaya storyboard bisa dipratinjau tanpa VO.

## Template storyboard

```ts
import timeline from './vo-timeline.json';
import type { VoTimeline } from '../shared/timeline';
import type { Storyboard } from '../kit/types';

export const sbTopik: Storyboard = {
  id: 'Topik',                       // nama composition (huruf/angka, tanpa spasi)
  timeline: timeline as VoTimeline,
  vo: 'vo-topik.wav',
  music: 'bed-ceria',                // bed-ceria | bed-mewah | bed-futur | bed-renung | null
  keywords: ['kata', 'yang diwarnai'],
  ask: { line1: 'Pertanyaan diskusi?', line2: 'Tulis di komentar!' },
  scenes: [
    { type: 'question', from: 'c01', text: 'Hook-nya di sini?', icon: 'question', heading: 'JUDUL\nBESAR' },
    // ...
  ],
};
```

## Waktu (`Ref`)

| Tulis | Artinya |
|---|---|
| `'c05'` | awal cue c05 |
| `'c05>'` | akhir cue c05 |
| `'c05@0.5'` | tengah cue c05 |
| `'c05+10'`, `'c05>-6'` | geser ±frame (30 fps) |
| `12` (angka) | frame ke-12 sejak scene mulai |

Scene mulai 0,2 dtk sebelum cue `from`-nya dan berakhir saat scene berikutnya mulai.

## Field umum (semua scene)

- `from` **wajib**: id cue tempat scene mulai.
- `heading`: judul besar di atas. String, atau `[{ at?, text, tone? }]` untuk berganti. `\n` = baris baru. Ukuran mengecil sendiri kalau panjang.
- `bg`: lokasi — `plain | room | city | park | lab | class | studio | space | night | ocean`, atau `{ kind, time: 'day'|'dusk'|'night', color }`.
- `nabel`: `false` (tanpa Nabel) atau `{ side: 'left'|'right'|'center'|'none', scale, moods: [{ at?, expr, pose?, curl? }], bubble: { at, until?, text }, sparkleAt }`.
  Ekspresi: `curious happy thinking shocked confused cryLaugh aha bored`. Pose: `rest up point wave`.
- `sfx`: SFX tambahan `[{ at, name, v? }]` (nama file di `public/sfx/v2/`). `noAutoSfx: true` mematikan SFX bawaan.
- `extra`: fungsi yang menggambar elemen tambahan di atas scene.
- `tone` (warna): `yellow white red green blue pink ink`.

## Jenis scene

| `type` | Isi | Field khusus |
|---|---|---|
| `title` | kartu bab (video panjang) | `kicker`, `title`, `sub` |
| `question` | hook / pertanyaan besar + tanda tanya | `text`, `at`, `icon` |
| `explain` | visual + poin yang muncul satu-satu | `visual`, `points: [{ at, text, icon?, tone? }]` |
| `fact` | angka besar (bisa hitung naik) | `value`, `at`, `label`, `sub`, `tone`, `countUp: { from, to, decimals?, prefix?, suffix?, dur? }` |
| `compare` | dua kartu A vs B + putusan | `left`/`right: { title, tone?, icon?, value?, items?, at? }`, `verdict: { at, kind: 'neq'|'vs'|'eq'|'gt'|'lt', text? }` |
| `list` | daftar bernomor/centang | `title`, `items: [{ at, text, icon?, mark?: 'num'|'check'|'cross' }]` |
| `chart` | grafik batang (boleh negatif) | `title`, `unit`, `bars: [{ label, value, at?, tone?, text? }]`, `highlight: { index, at }` |
| `map` | HP + aplikasi peta generik | `dot: { from, to, at, until }` (0..1 sepanjang rute), `segs: [{ at?, seg: { s1,s2,s3: warna }, pulse? }]`, `etas: [{ at?, eta, sub?, color? }]`, `chips: [{ at, until?, x, y, text, color }]`, `points` |
| `timeline` | garis waktu | `events: [{ at, label, text, tone? }]` |
| `zoom` | zoom-out ke Bumi + satelit | `label`, `labelAt`, `sats`, `zoomFrom` |
| `board` | papan kapur | `lines: [{ at, text, tone?, size?: 'big'|'normal'|'small' }]` |
| `custom` | momen khas (kode bebas) | `render: ({ frame, L, at, start, dur }) => ReactNode` |

`visual` (untuk `explain`): `{ kind: 'icon', name, at?, label? }`, `{ kind: 'icons', items: [{ name, at?, label? }] }`, `{ kind: 'text', text }`, `{ kind: 'phoneMap', eta?, etaSub?, etaColor?, seg?, dotT? }`, `{ kind: 'node', render: ({ frame, box, L, at }) => ... }`.

Ikon (`icon`/`name`): phone satellite clock coin money globe book bulb warning check cross person people building car rocket chart heart brain search lock wifi cart gift fire star question home pin battery cloud sun moon lightning gear shield camera food signal planet.

Warna lalu lintas peta: `import { LANCAR, PADAT, MACET } from '../maps/props'`.

## Otomatis (tidak perlu ditulis)

- Caption dari VO + kata kunci kuning; outro "Dunia Nabel"; kotak `ask` setelah cue terakhir.
- Musik + ducking saat narator bicara.
- Whoosh di jeda antar-scene (dilewati kalau jeda < 10 frame).
- SFX bawaan per jenis scene (pop poin, ding angka, kapur di papan, stempel putusan, dll.).
- Pengaman suara: SFX saat bicara 70% (ekor panjang 50%), SFX ≤8 frame sebelum kalimat 50%.
- Scene pertama tanpa fade (frame 0 langsung tampil), scene lain fade cepat 4 frame.

## Tips video panjang (8–10 menit)

- Mulai tiap bab dengan `title` (kicker `BAB 2`), jeda antar-bab = titik iklan tengah.
- Hook ulang tiap 1–1,5 menit pakai `question`.
- Pakai ulang beberapa `bg` sebagai "markas" (mis. `room` dan `lab`) supaya dunia Nabel terasa konsisten.
- Momen khas (yang bikin episode beda) cukup 1–3 `custom` per video; sisanya scene kit.
