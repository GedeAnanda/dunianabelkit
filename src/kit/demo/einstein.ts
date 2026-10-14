import timeline from '../../einstein/vo-timeline.json';
import { LANCAR, MACET } from '../../maps/props';
import type { VoTimeline } from '../../shared/timeline';
import type { Storyboard } from '../types';

/**
 * Demo Nabel Kit: episode Einstein & GPS ditulis ulang sebagai storyboard (tanpa kode scene baru).
 * Composition: KitEinstein (16:9) dan KitEinsteinTall (9:16).
 */
export const kitEinstein: Storyboard = {
  id: 'KitEinstein',
  timeline: timeline as VoTimeline,
  vo: 'vo-einstein.wav',
  music: 'bed-futur',
  outroGap: 2.4,
  keywords: ['teori Einstein', 'bisa meleset', 'hubungannya', 'posisi kamu', 'waktu di satelit', 'satelit', 'sangat presisi', 'nggak berjalan persis sama', 'kecepatan dan gravitasi', '38 mikrodetik', 'lebih cepat', 'kecil banget', 'ketepatan waktu', 'tidak dikoreksi', 'terus bertambah', 'efek relativitas Einstein', 'cari jalan', 'teori fisika paling penting', 'serumit itu', 'lokasi kita'],
  ask: { line1: 'Teknologi apa lagi yang diam-diam pakai fisika rumit?', line2: 'Tulis di komentar!' },
  scenes: [
    {
      type: 'map',
      from: 'c01',
      bg: 'park',
      heading: [{ text: 'KALAU EINSTEIN\nDIABAIKAN...' }, { at: 'c02', text: 'LOKASIMU\nBISA MELESET!', tone: 'red' }],
      dot: { from: 0.1, to: 0.1, at: 0, until: 1 },
      etas: [{ eta: 'Kamu di sini', color: LANCAR }, { at: 'c02@0.45', eta: 'Lokasi meleset!', color: MACET }],
      chips: [{ at: 'c02@0.5', x: 200, y: 262, text: 'di sungai?!', color: MACET }],
      nabel: { moods: [{ expr: 'happy' }, { at: 'c02@0.5', expr: 'shocked' }] },
      sfx: [{ at: 'c02@0.45', name: 'glitch', v: 0.4 }],
    },
    { type: 'question', from: 'c03', at: 'c03@0.2', icon: 'book', text: 'Apa hubungannya Einstein sama GPS?', heading: 'LOH?!' },
    {
      type: 'zoom',
      from: 'c04',
      sats: 4,
      label: 'posisi kamu',
      labelAt: 'c05',
      heading: [{ text: 'GPS MENENTUKAN\nPOSISIMU...', tone: 'white' }, { at: 'c06', text: 'PAKAI SINYAL\nDARI SATELIT!' }],
    },
    {
      type: 'explain',
      from: 'c07',
      bg: 'studio',
      heading: 'SINYALNYA BAWA\nWAKTU SUPER PRESISI',
      visual: {
        kind: 'icons',
        items: [
          { name: 'satellite', label: 'jam atom' },
          { name: 'clock', at: 'c07@0.3', label: 'cap waktu' },
          { name: 'phone', at: 'c07@0.6', label: 'HP kamu' },
        ],
      },
    },
    {
      type: 'compare',
      from: 'c08',
      heading: [{ text: 'MASALAHNYA...', tone: 'white' }, { at: 'c10', text: 'WAKTUNYA\nNGGAK SAMA!' }],
      left: { title: 'Jam satelit', icon: 'satellite', value: 'lebih cepat', tone: 'blue', at: 'c09' },
      right: { title: 'Jam di Bumi', icon: 'globe', value: 'normal', tone: 'green', at: 'c09@0.6' },
      verdict: { at: 'c10@0.4', kind: 'neq', text: 'nggak sama!' },
    },
    {
      type: 'chart',
      from: 'c11',
      title: 'EFEK PER HARI',
      heading: [{ text: 'KECEPATAN\n& GRAVITASI' }, { at: 'c13', text: 'TOTAL +38 µs\nPER HARI!' }],
      bars: [
        { label: 'kecepatan', value: -7, text: '-7 µs', at: 'c11@0.1' },
        { label: 'gravitasi', value: 45, text: '+45 µs', at: 'c11@0.6' },
        { label: 'total', value: 38, text: '+38 µs', tone: 'yellow', at: 'c13@0.2' },
      ],
      highlight: { index: 2, at: 'c13@0.4' },
    },
    {
      type: 'fact',
      from: 'c15',
      at: 'c15@0.2',
      value: '0,000038',
      label: 'detik per hari',
      sub: 'tapi sinyal melaju ±300 m tiap 1 µs → 38 µs = ±11 km!',
      heading: [{ text: 'KECIL BANGET,\nKAN?' }, { at: 'c16', text: 'TAPI GPS BUTUH\nWAKTU YANG TEPAT' }],
    },
    {
      type: 'map',
      from: 'c17',
      heading: [{ text: 'KALAU NGGAK\nDIKOREKSI...', tone: 'white' }, { at: 'c18', text: 'MAKIN LAMA\nMAKIN MELESET!', tone: 'red' }],
      dot: { from: 0.05, to: 0.9, at: 'c17', until: 'c18>' },
      etas: [{ eta: 'Jam 00.00', color: LANCAR }, { at: 'c18', eta: 'Jam 24.00', sub: 'meleset 11+ km', color: MACET }],
      chips: [{ at: 'c18@0.5', x: 130, y: 300, text: '11+ km', color: MACET }],
      nabel: { moods: [{ expr: 'curious' }, { at: 'c17@0.6', expr: 'shocked' }] },
    },
    {
      type: 'board',
      from: 'c19',
      heading: [{ text: 'MAKANYA...', tone: 'white' }, { at: 'c20', text: 'DIKOREKSI!' }],
      lines: [
        { at: 'c19@0.2', text: 'jam satelit disetel sebelum diluncurkan', size: 'small' },
        { at: 'c19@0.55', text: '10,23 MHz → 10,22999999543 MHz', tone: 'yellow' },
        { at: 'c20', text: 'efek relativitas', tone: 'green', size: 'big' },
      ],
    },
    {
      type: 'explain',
      from: 'c21',
      bg: { kind: 'park', time: 'dusk' },
      heading: 'JADI, TIAP KAMU\nBUKA MAPS...',
      visual: { kind: 'phoneMap', eta: 'Kamu di sini', etaSub: 'akurat', etaColor: LANCAR, dotT: 0.12 },
      points: [{ at: 'c22@0.3', text: 'Titiknya pas di posisimu', icon: 'pin' }],
    },
    { type: 'title', from: 'c23', kicker: 'TEORI RELATIVITAS', title: 'Salah satu teori fisika paling penting!', nabel: { moods: [{ expr: 'curious' }, { at: 'c24', expr: 'aha' }] } },
    {
      type: 'question',
      from: 'c25',
      at: 'c25@0.3',
      icon: 'pin',
      bg: 'night',
      text: 'Serumit itu cuma buat tahu lokasi kita?!',
      heading: 'GILA...',
      nabel: { moods: [{ expr: 'shocked' }, { at: 'c26@0.3', expr: 'cryLaugh' }] },
    },
  ],
};
