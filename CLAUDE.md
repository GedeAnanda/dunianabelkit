# Dunia Nabel — aturan project

Channel edukasi santai dengan maskot **Nabel**. Format tiap video: pertanyaan → Nabel "berpetualang" ke topiknya → jawaban. Bahasa santai (aku/kamu), humor ringan, punchline di akhir.

## Nabel
- JANGAN PERNAH menggambar ulang Nabel. Selalu pakai `<Nabel />` / `<PlacedNabel />` dari `src/shared/Nabel.tsx` dan `src/dejavu/scenes/common.tsx`.
- Bentuk, proporsi, warna, dan outline Nabel tidak boleh diubah di dalam scene. Warna hanya dari `src/shared/theme.ts` (`nabel.*`).
- Butuh ekspresi atau pose baru? Tambahkan ke `Nabel.tsx`, lalu render `npm run sheet` dan cek `out/nabel-sheet.png`.
- Ciri khas: jambul kuning berbentuk "?" yang jadi "!" (`expression="aha"`) saat Nabel paham, dan jadi zig-zag saat kaget.
- Ekspresi `bored` (kelopak mata setengah turun, mulut datar) ditambahkan di episode sunk cost untuk adegan bosan/ngantuk.

## Gaya video
- 1080x1920, 30 fps. Teks penting di atas y=1520 dan kiri dari x=960 (area UI Shorts/TikTok).
- Gaya flat 2D, outline tebal `#1E1B2E`, bentuk membulat. Font Fredoka (judul/caption) & Nunito, dimuat lokal dari `public/fonts`.
- Animasi hanya pakai `useCurrentFrame` / `interpolate` / `spring` (helper di `src/shared/anim.ts`). Jangan CSS animation atau setTimeout.
- Subtitle narator pakai `<Caption />`; dialog Nabel & pikiran pakai `<SpeechBubble />` di dalam scene.
- Gambar/visual dibuat sendiri (SVG/div). Jangan pakai logo brand, karakter berhak cipta, atau emoji (emoji tidak selalu ter-render).

## Timing = voiceover
- Voiceover direkam Nanda sendiri. Teks caption mengikuti apa yang diucapkan di rekaman, bukan naskah awal.
- VO TIDAK BOLEH dipotong atau diubah isinya (permintaan Nanda, berlaku mulai episode 01 rotasi): jangan buang gagap/tawa/take, jangan tambah jeda. Pakai `"raw": true` di cues JSON (timeline = waktu asli rekaman). Merapikan suara (`"clarity": true`: EQ, compressor, volume) boleh.
- `voice/cues.json` berisi potongan rekaman (detik di file asli) + teks + pembicara. Bagian rekaman yang tidak terdaftar dibuang (take ulang). Tambahkan `"cutBefore": true` di sebuah cue untuk memaksa potongan (misalnya membuang gagap di antara dua cue yang berdekatan). (`cutBefore` dan `silenceBefore` hanya untuk episode lama; episode baru pakai `raw`.)
- `python3 tools/build_vo.py [cues.json] [timeline.json] [out.wav]` → membuat voiceover bersih dan `vo-timeline.json` (default: video déjà vu). Semua scene mengambil timing dari file ini lewat `script.ts`, jadi jangan menulis angka detik manual di scene; pakai `localCue()` / `atCue()`.
- Rekaman yang aslinya sudah terang (pita 2,5–5 kHz di atas ±-17 dB relatif total) pakai `"presence": 1.0` di cues JSON supaya tidak tajam (default 3,5 dB). Contoh: `voice/maps.json`.
- Rekaman yang gelap (pita 2,5–5 kHz di bawah ±-20 dB) pakai `"presence": 5.0` dan `"air": 7.0` (high-shelf 7 kHz, default 4,5). Contoh: `voice/einstein.json`. Jangan naikkan `air` lebih jauh: yang naik cuma desis di atas 8 kHz, bukan kejelasan suara.
- VO jangan sampai terdengar mendem (permintaan Nanda). Rekaman HP 64 kbps cenderung gelap, jadi episode baru selalu pakai `"clarity": true` di cues JSON: denoise lebih ringan + EQ presence 3,5 kHz & high-shelf 7 kHz. Cek dengan analisis spektrum: pita 2,5–5 kHz sekitar -16 sampai -18 dB dan 5–8 kHz sekitar -25 sampai -31 dB relatif total (sebelumnya ±-20 dan ±-38).

## Sound design
- SFX buatan sendiri ada di `public/sfx/v2/` (dibuat ulang dengan `npm run sound`), musik latar di `public/music/bed-ceria.wav` (loop).
- Volume SFX cukup kencang (0.5–0.9). Kalau SFX jatuh saat narator bicara, volumenya otomatis 70% (`T.isSpeaking`).
- Musik di-ducking otomatis: ±0.34 saat jeda, ±0.14 saat narator bicara (`T.speechAmount`). Target: voiceover tetap ±10 dB di atas musik+SFX saat bicara.
- Jangan taruh SFX panjang tepat di atas kata penting; taruh di jeda.
- SFX berekor panjang (ding, sparkle, kaching, swell, suspense, tada, whoosh-long, slot-spin, sonar, alarm, rumble, horn, ring, drumroll, bubbles, tape-stop) otomatis turun ke 50% kalau jatuh saat narator bicara (lihat `LONG_TAIL` di `src/mewah/BarangMewah.tsx`).
- SFX episode gratis ongkir: `scooter` (motor kurir), `bike-horn` (klakson motor), `eraser` (penghapus digosok), `cart` (troli meluncur).
- SFX episode Einstein & GPS: `ratchet` (kenop diputar), `warp` (ruang-waktu melengkung).
- SFX episode Google Maps: `car-horn` (klakson mobil), `traffic` (suasana jalan padat ±2,4 dtk), `ping` (ping lokasi), `data` (aliran data), `machine` (mesin berpikir). Klakson yang jatuh dekat kalimat dibuat pelan (±0.2).
- SFX episode tinta printer: `printer` (kepala cetak bolak-balik), `low-ink` (bip tinta habis), `pour` (tinta dituang), `unroll` (struk panjang terurai). Bunyi mesin/bip yang jatuh tepat sebelum kalimat penting dibuat pelan (±0.2–0.3), karena ekornya menimpa kata pertama.
- Musik latar: `bed-ceria.wav` untuk topik sains/umum, `bed-mewah.wav` (lounge jazzy) untuk topik bisnis/barang mewah, `bed-futur.wav` (synth futuristis, rasa kagum) untuk topik teknologi/internet, `bed-renung.wav` (lo-fi santai, e-piano) untuk topik psikologi/kebiasaan sehari-hari (sedikit lebih pelan, di komponen pakai `MUSIC_GAIN = 1.25`).
- Whoosh transisi taruh di jeda: `Math.max(scene.from - 10, akhir cue sebelumnya + 1)`. Kalau jeda antar-kalimat < 10 frame, scene dimulai di tengah kalimat, atau scene dibuka bunyi lain (scan, stempel), whoosh-nya dilewati (lihat `WHOOSH_SCENES` di `src/qr/QRRusak.tsx` dan `src/kabel/KabelLaut.tsx`).
- Cek setelah render: `ffmpeg ... ebur128` (target ±-16 LUFS) dan VO ±10 dB di atas musik+SFX saat bicara.

## Gaya cerita (dari Nanda)
- Jangan mengejar durasi pendek sampai mengorbankan cerita. 35 detik kalau cukup, 60+ detik kalau ceritanya butuh.
- Struktur: hook 0–3 detik yang memancing pertanyaan → contoh yang dekat dengan penonton → satu twist di tengah → contoh/simulasi → ending yang memancing diskusi (bukan sekadar minta follow).
- Animasi mengikuti tiap bagian cerita, dengan lokasi yang jelas per scene, bukan sekadar latar suara.
- Scene hook TIDAK pakai fade dari hitam: frame 0 harus sudah menampilkan teks hook.
- Nabel yang berdiri di bawah layar: `feetY` sekitar 1340–1360, supaya badannya tidak tertutup caption dua baris (caption ±1365–1545).

## Nabel Kit (cara utama mulai sekarang — hemat token)
- Episode baru ditulis sebagai **storyboard** di `src/<topik>/storyboard.ts` memakai `src/kit/` — BACA `src/kit/README.md` dulu, jangan baca kode kit kecuali perlu.
- Satu storyboard → dua composition: `<id>` 16:9 (video panjang) dan `<id>Tall` 9:16 (Shorts; potong dengan `--frames`).
- Daftarkan dengan `<KitCompositions sb={...} />` di `src/Root.tsx`.
- Kode scene baru hanya untuk 1–3 momen khas per video, lewat scene `custom`. Kalau sebuah momen custom ternyata sering dipakai, jadikan jenis scene baru di kit (dan catat di README).
- Contoh: `src/kit/demo/einstein.ts` (Einstein & GPS versi kit), `src/kit/demo/gallery.tsx` (katalog semua jenis scene).

## Video baru (cara lama, episode sebelum kit)
1. Buat folder `src/<topik>/` dengan `script.ts` (pakai `createTimeline` dari `src/shared/timeline.ts`), komponen utama, dan scene. Contoh terbaru: `src/einstein/` (Einstein & GPS, 12 lokasi: taman kota, kamar, luar angkasa + orbit satelit, langit kota sore, layar terbelah jam satelit vs jam Bumi, kelas papan kapur, lab ukur, peta kota penuh layar, ruang bersih satelit, taman sore, kain ruang-waktu, kamar malam; musik `bed-futur`; angka relativitas: -7 µs kecepatan, +45 µs gravitasi, +38 µs/hari, 1 µs = ±300 m, factory offset 10,22999999543 MHz; font lokal hanya subset latin → pakai "µ" U+00B5, simbol seperti ≠ digambar SVG `NotEqual`), `src/maps/` (Google Maps tahu jalan macet, 9 lokasi: dalam mobil + HP di dasbor, pojok jalan + CCTV, jalan ramai samping, ruang pusat data, jalan raya dari atas yang berubah jadi peta, lab mesin machine learning, teras pagi, studio prakiraan lalu lintas, jalan macet sore; musik `bed-futur`; aplikasi peta GENERIK di `MapView`: rute biru, titik biru, pin ungu, lalu lintas hijau/oranye/merah — tanpa logo/warna merek asli), `src/ongkir/` (episode 02 gratis ongkir, 11 lokasi: kamar + HP checkout, jalan kota naik motor kurir, gudang ekspedisi, panggung kuis 3 podium pihak, kantor marketplace, ruang packing penjual, rincian ongkir, jalan checkout perspektif, teras rumah; musik `bed-mewah`; warna pihak tetap: marketplace ungu, penjual biru, pembeli pink, voucher hijau — tanpa warna/logo merek marketplace asli), `src/printer/` (tinta printer & model bisnis razor and blades, 11 lokasi: toko elektronik/kasir, kamar, barbershop, showroom, perusahaan + konveyor, laut kutub/gunung es, meja kerja tangki tinta; musik `bed-mewah`; buka & tutup di kasir yang sama), `src/sunkcost/` (sunk cost fallacy, 10 lokasi: bioskop, kelas, laut, ruang TV, ruang otak, penampang laut, jalan pagi, papan gabus; musik `bed-renung`; tidak bergantung pada `src/qr/`), `src/rotasi/` (rotasi Bumi, episode 01, 9 lokasi, zoom-out ke planet di akhir), `src/kabel/` (kabel internet bawah laut, episode 06, 13 lokasi, musik `bed-futur`), `src/harga/` (Rp199.000 vs Rp200.000, episode 04, 9 lokasi), `src/qr/` (QR code rusak, episode 03, 9 lokasi), `src/mewah/` (efek Veblen, 9 lokasi), `src/gravitasi/` (episode 4), `src/keriput/` (episode 2), `src/suara/` (episode 3).
2. Taruh rekaman di `public/`, buat `voice/cues.json` versi topik itu (transkrip + waktu tiap kalimat), jalankan `build_vo.py`.
3. Daftarkan composition baru di `src/Root.tsx`.
4. Cek per scene dengan `npx remotion still <Id> --frame=N` sebelum render penuh.
5. Caption: potong `end` caption supaya tidak bertumpuk dengan caption berikutnya (lihat `BarangMewah.tsx`). Kata yang diwarnai per episode lewat prop `keywords` di `<Caption />`; hindari kata pendek yang bisa nyangkut di kata lain (misal "rusak" di "kerusakannya").
6. Kalau videonya menampilkan benda yang bisa dicek nyata (seperti QR code), buat versi asli dan uji (contoh: `tools/qr_matrix.py` membuat QR asli level H dan mengecek versi rusak mana yang masih bisa di-scan).
