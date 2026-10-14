# Nabel Kit — cara pasang

Ekstrak zip ini ke folder project `dunia-nabel` (timpa file yang sama). Episode lama tidak berubah.

## Isi paket
- `src/kit/` — kit-nya: `layout.ts` (16:9 & 9:16), `types.ts` (format storyboard), `icons.tsx` (40 ikon), `backgrounds.tsx` (10 lokasi), `parts.tsx` (judul, caption, Nabel, outro), `scenes.tsx` (12 jenis scene + SFX bawaan), `Episode.tsx` (render episode + musik/SFX otomatis + `KitCompositions` + `fakeTimeline`)
- `src/kit/README.md` — panduan storyboard (ini yang dibaca Claude tiap episode baru)
- `src/kit/demo/einstein.ts` — episode Einstein & GPS versi kit; `src/kit/demo/gallery.tsx` — katalog semua jenis scene
- `CLAUDE.md` (bagian "Nabel Kit"), `tsconfig.kit.json`

Butuh file dari paket sebelumnya: episode Google Maps (`src/maps/`) dan Einstein (`src/einstein/`, termasuk `vo-timeline.json` & `public/vo-einstein.wav` untuk demo), plus `src/ongkir/props.tsx`, `src/gravitasi/props.tsx`, `src/mewah/props.tsx`, `src/dejavu/scenes/`, `src/shared/`.

## Pasang
1. Ekstrak zip ke folder `dunia-nabel`.
2. Tambahkan di `src/Root.tsx`:

```tsx
import { KitCompositions } from './kit/Episode';
import { kitGallery } from './kit/demo/gallery';
import { kitEinstein } from './kit/demo/einstein';
```

dan di dalam `RemotionRoot`:

```tsx
<KitCompositions sb={kitGallery} />
<KitCompositions sb={kitEinstein} />
```

3. Cek: `npx tsc --noEmit -p tsconfig.kit.json`, lalu buka `npm run studio` → composition `KitGallery`, `KitGalleryTall`, `KitEinstein`, `KitEinsteinTall`.
4. Render contoh:
   - 16:9: `npx remotion render KitEinstein out/kit-einstein.mp4`
   - potongan Shorts 9:16: `npx remotion render KitEinsteinTall out/kit-einstein-short.mp4 --frames=0-520`
