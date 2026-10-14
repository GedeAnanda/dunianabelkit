import { LANCAR, MACET } from '../../maps/props';
import { fakeTimeline } from '../Episode';
import type { Storyboard } from '../types';

/**
 * Katalog semua jenis scene Nabel Kit (tanpa VO). Dipakai untuk mengecek tampilan di 16:9 dan 9:16.
 * Composition: KitGallery (16:9) dan KitGalleryTall (9:16).
 */
const timeline = fakeTimeline([
  ['Kartu bab: pembuka tiap bagian video panjang.'],
  ['Pernah kepikiran nggak?', 'Kenapa langit warnanya biru?'],
  ['Cahaya matahari itu campuran banyak warna.', 'Warna biru paling gampang tersebar di udara.', 'Sebaran itulah yang sampai ke mata kita.'],
  ['Cahaya melaju sekitar tiga ratus ribu kilometer per detik.'],
  ['Siang hari jalur cahayanya pendek,', 'sore hari jalurnya jauh lebih panjang.'],
  ['Pertama, cahaya terdiri dari banyak warna.', 'Kedua, udara menyebarkan warna biru.', 'Ketiga, langit bukan pantulan laut.'],
  ['Merah paling sedikit tersebar,', 'biru paling banyak.'],
  ['Titik biru ini posisimu sekarang.', 'Garis merah artinya jalannya padat.'],
  ['Tahun 1666, Newton memecah cahaya pakai prisma.', 'Tahun 1871, Rayleigh menjelaskan hamburan cahaya.', 'Sekarang, kamu tahu jawabannya.'],
  ['Kalau dilihat dari luar angkasa,', 'Bumi dikelilingi lapisan udara tipis.'],
  ['Cahaya putih itu campuran banyak warna.', 'Dan biru paling banyak tersebar.'],
  ['Scene custom untuk momen khas tiap episode.'],
]);

export const kitGallery: Storyboard = {
  id: 'KitGallery',
  timeline,
  music: 'bed-ceria',
  keywords: ['langit', 'biru', 'cahaya'],
  ask: { line1: 'Menurutmu, kenapa awan warnanya putih?', line2: 'Tulis di komentar!' },
  scenes: [
    { type: 'title', from: 'g0_0', kicker: 'BAB 1', title: 'Kenapa Langit Biru?', sub: 'kartu bab — pembuka tiap bagian' },
    { type: 'question', from: 'g1_0', text: 'Kok langit warnanya biru?', icon: 'sun', at: 'g1_1', heading: 'PERNAH\nKEPIKIRAN?' },
    {
      type: 'explain',
      from: 'g2_0',
      heading: 'CAHAYA ITU\nCAMPURAN WARNA',
      visual: { kind: 'icon', name: 'sun', label: 'cahaya matahari' },
      points: [
        { at: 'g2_0', text: 'Cahaya putih = campuran warna', icon: 'bulb' },
        { at: 'g2_1', text: 'Biru paling gampang tersebar', icon: 'star' },
        { at: 'g2_2', text: 'Sebaran itu sampai ke mata', icon: 'search' },
      ],
    },
    { type: 'fact', from: 'g3_0', at: 'g3_0@0.2', value: '300.000', label: 'kecepatan cahaya', sub: 'kilometer per detik', countUp: { from: 0, to: 300000 }, heading: 'CEPET BANGET!' },
    {
      type: 'compare',
      from: 'g4_0',
      heading: 'SIANG VS SORE',
      left: { title: 'Siang', icon: 'sun', value: 'Biru', items: ['Matahari tinggi', 'Jalur cahaya pendek'], tone: 'blue' },
      right: { title: 'Sore', icon: 'moon', value: 'Oranye', items: ['Matahari rendah', 'Jalur cahaya panjang'], tone: 'pink', at: 'g4_1' },
      verdict: { at: 'g4_1@0.8', kind: 'neq', text: 'beda jalur!' },
    },
    {
      type: 'list',
      from: 'g5_0',
      title: 'TIGA HAL PENTING',
      heading: 'RINGKASNYA',
      items: [
        { at: 'g5_0', text: 'Cahaya terdiri dari banyak warna' },
        { at: 'g5_1', text: 'Udara menyebarkan warna biru', mark: 'check' },
        { at: 'g5_2', text: 'Langit bukan pantulan laut', mark: 'cross' },
      ],
    },
    {
      type: 'chart',
      from: 'g6_0',
      title: 'SEBARAN CAHAYA',
      heading: 'BIRU JUARANYA',
      bars: [
        { label: 'Merah', value: 1, tone: 'red', text: '1×', at: 'g6_0' },
        { label: 'Hijau', value: 2.4, tone: 'green', text: '2,4×', at: 'g6_0@0.4' },
        { label: 'Biru', value: 5.5, tone: 'blue', text: '5,5×', at: 'g6_1' },
      ],
      highlight: { index: 2, at: 'g6_1@0.4' },
    },
    {
      type: 'map',
      from: 'g7_0',
      heading: 'CONTOH PETA',
      dot: { from: 0.02, to: 0.3, at: 'g7_0', until: 'g7_1>' },
      segs: [{ seg: { s1: LANCAR, s2: LANCAR, s3: LANCAR } }, { at: 'g7_1', seg: { s1: LANCAR, s2: MACET, s3: LANCAR }, pulse: 's2' }],
      etas: [{ eta: '18 mnt', sub: 'lancar', color: LANCAR }, { at: 'g7_1', eta: '25 mnt', sub: 'macet di depan', color: MACET }],
      chips: [{ at: 'g7_1@0.3', x: 150, y: 385, text: 'macet', color: MACET }],
      points: [
        { at: 'g7_0', text: 'Titik biru = posisimu', icon: 'pin' },
        { at: 'g7_1', text: 'Merah = jalan padat', icon: 'warning' },
      ],
    },
    {
      type: 'timeline',
      from: 'g8_0',
      heading: 'SEJARAHNYA',
      events: [
        { at: 'g8_0', label: '1666', text: 'Newton memecah cahaya pakai prisma' },
        { at: 'g8_1', label: '1871', text: 'Rayleigh jelaskan hamburan cahaya' },
        { at: 'g8_2', label: 'Sekarang', text: 'Kamu tahu kenapa langit biru!', tone: 'green' },
      ],
    },
    { type: 'zoom', from: 'g9_0', label: 'Bumi & lapisan udaranya', labelAt: 'g9_1', heading: 'DARI LUAR ANGKASA' },
    {
      type: 'board',
      from: 'g10_0',
      heading: 'RUMUS SINGKAT',
      lines: [
        { at: 'g10_0', text: 'Cahaya putih', size: 'big' },
        { at: 'g10_0@0.5', text: '= merah + hijau + biru + ...', tone: 'yellow' },
        { at: 'g10_1', text: 'biru paling banyak tersebar', tone: 'green' },
      ],
    },
    {
      type: 'custom',
      from: 'g11_0',
      bg: { kind: 'plain', color: '#2D3F80' },
      heading: 'SCENE CUSTOM',
      nabel: { side: 'center', moods: [{ expr: 'cryLaugh' }] },
      render: ({ frame, L }) => {
        const r = L.wide ? 300 : 360;
        const cy = L.wide ? 520 : 760;
        return Array.from({ length: 8 }, (_, i) => {
          const a = frame * 0.03 + (i * Math.PI) / 4;
          const x = L.W / 2 + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r * 0.45;
          return <div key={i} style={{ position: 'absolute', left: x - 30, top: y - 30, width: 60, height: 60, borderRadius: 30, background: ['#FFD23F', '#FF7A9A', '#7FD3F7', '#9CE0B5'][i % 4], border: '5px solid #1E1B2E' }} />;
        });
      },
    },
  ],
};
