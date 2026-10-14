import { useVideoConfig } from 'remotion';

/**
 * Tata letak Nabel Kit. Semua scene kit membaca ukuran dari sini, jadi storyboard yang sama
 * bisa dirender 16:9 (1920x1080, video panjang) maupun 9:16 (1080x1920, Shorts).
 */
export type Side = 'left' | 'right' | 'center' | 'none';
export type Box = { x: number; y: number; w: number; h: number; cx: number; cy: number };

const box = (x: number, y: number, w: number, h: number): Box => ({ x, y, w, h, cx: x + w / 2, cy: y + h / 2 });

export type Layout = {
  W: number;
  H: number;
  wide: boolean;
  /** Pusat vertikal judul besar di atas. */
  headingY: number;
  headingSize: number;
  /** Batas karakter per baris judul sebelum ukurannya diperkecil otomatis. */
  headingChars: number;
  /** Pusat vertikal caption. */
  captionY: number;
  captionMaxW: number;
  captionSize: number;
  nabelFeetY: number;
  nabelSize: number;
  nabelX: (side: Side) => number;
  /** Area isi utama (di luar judul, caption, dan Nabel). */
  content: (side: Side) => Box;
};

export const makeLayout = (W: number, H: number): Layout => {
  const wide = W > H;
  if (wide) {
    return {
      W,
      H,
      wide,
      headingY: 118,
      headingSize: 84,
      headingChars: 30,
      captionY: H - 108,
      captionMaxW: 1480,
      captionSize: 52,
      nabelFeetY: 878,
      nabelSize: 270,
      nabelX: (side) => (side === 'left' ? 265 : side === 'right' ? W - 265 : W / 2),
      content: (side) =>
        side === 'left' ? box(520, 262, W - 600, 588) : side === 'right' ? box(80, 262, W - 600, 588) : box(120, 262, W - 240, 588),
    };
  }
  return {
    W,
    H,
    wide,
    headingY: 232,
    headingSize: 92,
    headingChars: 16,
    captionY: 1455,
    captionMaxW: 900,
    captionSize: 58,
    nabelFeetY: 1355,
    nabelSize: 220,
    nabelX: (side) => (side === 'left' ? 210 : side === 'right' ? W - 210 : W / 2),
    content: (side) => (side === 'none' ? box(60, 410, W - 120, 900) : box(60, 410, W - 120, 690)),
  };
};

export const useLayout = (): Layout => {
  const { width, height } = useVideoConfig();
  return makeLayout(width, height);
};
