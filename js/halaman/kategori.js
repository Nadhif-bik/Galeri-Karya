/* Logika Layar Kategori */

const LIST_CHIP = ['Semua', ...DAFTAR_KATEGORI];

// 1. Ambil kategori awal dari query string URL (?k=...)
function validasiKategori(param) {
  if (!param) return 'Semua';
  const cocok = LIST_CHIP.find((c) => c.toLowerCase() === param.toLowerCase());
  return cocok || 'Semua';
}

let kategoriAktif = validasiKategori(ambilParameter('k'));

// 2. Render deret tombol chip filter
function renderChip() {
  const wadahChip = document.getElementById('daftar-chip');
  if (!wadahChip) return;

  wadahChip.innerHTML = LIST_CHIP.map((nama) => {
    const aktif = nama.toLowerCase() === kategoriAktif.toLowerCase();
    return `
      <button type="button" class="chip" data-kategori="${nama}" aria-pressed="${aktif}">
        ${nama}
      </button>`;
  }).join('');
}

// 3. Ambil daftar karya yang disaring dan diurutkan
function ambilKaryaTersaring() {
  let hasil = kategoriAktif.toLowerCase() === 'semua'
    ? [...KARYA]
    : KARYA.filter((k) => k.kategori.toLowerCase() === kategoriAktif.toLowerCase());

  const urutanEl = document.getElementById('pilih-urutan');
  const urutan = urutanEl ? urutanEl.value : 'terbaru';

  if (urutan === 'terbaru') {
    hasil.sort((a, b) => b.id - a.id);
  } else if (urutan === 'terlama') {
    hasil.sort((a, b) => a.id - b.id);
  } else if (urutan === 'az') {
    hasil.sort((a, b) => a.judul.localeCompare(b.judul));
  } else if (urutan === 'za') {
    hasil.sort((a, b) => b.judul.localeCompare(a.judul));
  }

  return hasil;
}

// 4. Perbarui seluruh tampilan (chip, teks ringkasan, dan kartu karya)
function perbaruiTampilan() {
  renderChip();

  const karyaTampil = ambilKaryaTersaring();
  const ringkasanEl = document.getElementById('ringkasan-karya');
  const gridEl = document.getElementById('grid-karya');

  if (ringkasanEl) {
    const infoKategori = kategoriAktif.toLowerCase() === 'semua' ? '' : ` · ${kategoriAktif}`;
    ringkasanEl.textContent = `${karyaTampil.length} karya${infoKategori}`;
  }

  if (gridEl) {
    if (karyaTampil.length === 0) {
      gridEl.innerHTML = `
        <div class="pesan-kosong" style="grid-column: 1 / -1;">
          <strong>Belum Ada Karya</strong>
          <p class="teks-redup">Belum ada karya dalam kategori ${aman(kategoriAktif)}.</p>
        </div>`;
    } else {
      gridEl.innerHTML = karyaTampil.map((k) => kartuKarya(k)).join('');
    }
  }
}

// 5. Ubah kategori aktif & sinkronkan dengan URL
function setKategori(namaBaru) {
  kategoriAktif = validasiKategori(namaBaru);

  // Perbarui parameter ?k= di URL tanpa reload halaman
  const url = new URL(window.location.href);
  if (kategoriAktif.toLowerCase() === 'semua') {
    url.searchParams.delete('k');
  } else {
    url.searchParams.set('k', kategoriAktif);
  }
  window.history.pushState({ k: kategoriAktif }, '', url);

  perbaruiTampilan();
}

// 6. Pasang event listener
// Event delegasi untuk klik chip
document.getElementById('daftar-chip').addEventListener('click', (e) => {
  const tombol = e.target.closest('.chip');
  if (!tombol) return;
  const kategori = tombol.dataset.kategori;
  if (kategori) {
    setKategori(kategori);
  }
});

// Event perubahan pengurutan
const pilihUrutan = document.getElementById('pilih-urutan');
if (pilihUrutan) {
  pilihUrutan.addEventListener('change', () => {
    perbaruiTampilan();
  });
}

// Mendukung tombol Back / Forward browser
window.addEventListener('popstate', () => {
  kategoriAktif = validasiKategori(ambilParameter('k'));
  perbaruiTampilan();
});

// Inisialisasi tampilan awal
perbaruiTampilan();
