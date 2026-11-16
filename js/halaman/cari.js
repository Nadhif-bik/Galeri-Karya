/* Logika Layar Cari Karya */

// 1. Tampilkan ikon pencarian pada bilah input
const ikonWadah = document.getElementById('ikon-cari-wadah');
if (ikonWadah) {
  ikonWadah.innerHTML = ikon('cari', 20);
}

// 2. State pencarian
let kategoriDipilih = null;
const inputCari = document.getElementById('input-cari');
const tombolBersihkan = document.getElementById('tombol-bersihkan');
const labelStatus = document.getElementById('label-status');
const daftarKaryaEl = document.getElementById('daftar-karya');
const wadahChip = document.getElementById('daftar-chip-cari');

// 3. Baca parameter URL (?q=..., ?k=..., ?id=...)
const qParam = ambilParameter('q');
const kParam = ambilParameter('k');
const idParam = ambilParameter('id');

if (kParam) {
  const cocokKat = DAFTAR_KATEGORI.find((k) => k.toLowerCase() === kParam.toLowerCase());
  if (cocokKat) kategoriDipilih = cocokKat;
}

if (qParam) {
  inputCari.value = qParam;
} else if (idParam) {
  // Jika ?id= mengarah ke karya
  const karyaId = cariKarya(idParam);
  if (karyaId) {
    inputCari.value = karyaId.judul;
  } else {
    // Jika ?id= mengarah ke kreator
    const kreatorId = cariKreator(idParam);
    if (kreatorId) {
      inputCari.value = kreatorId.nama;
    }
  }
}

// 4. Render deret chip filter garis
function renderChip() {
  if (!wadahChip) return;
  wadahChip.innerHTML = DAFTAR_KATEGORI.map((kat) => {
    const aktif = kategoriDipilih === kat;
    return `
      <button type="button" class="chip chip--garis" data-kategori="${kat}" aria-pressed="${aktif}">
        ${kat}
      </button>`;
  }).join('');
}

// 5. Fungsi filter dan pencarian
function cariDanFilter() {
  const q = inputCari.value.trim().toLowerCase();

  // Tampilkan/sembunyikan tombol silang (bersihkan)
  if (tombolBersihkan) {
    tombolBersihkan.style.display = q ? 'flex' : 'none';
  }

  // Filter karya
  let hasil = KARYA.filter((karya) => {
    // Filter kategori
    if (kategoriDipilih && karya.kategori.toLowerCase() !== kategoriDipilih.toLowerCase()) {
      return false;
    }

    // Filter teks kata kunci (judul atau nama kreator)
    if (q) {
      const judulCocok = karya.judul.toLowerCase().includes(q);
      const kreator = cariKreator(karya.kreatorId);
      const kreatorCocok = kreator && kreator.nama.toLowerCase().includes(q);
      return judulCocok || kreatorCocok;
    }

    return true;
  });

  // Urutkan karya (default: id terbaru)
  hasil.sort((a, b) => b.id - a.id);

  // Perbarui label status
  if (!q && !kategoriDipilih) {
    labelStatus.textContent = 'Karya terbaru';
  } else {
    labelStatus.textContent = `Ditemukan ${hasil.length} karya`;
  }

  // Render daftar karya vertikal
  if (hasil.length === 0) {
    daftarKaryaEl.innerHTML = `
      <div class="pesan-kosong">
        <strong>Tidak Ada Hasil</strong>
        <p class="teks-redup">Tidak ditemukan karya yang cocok dengan pencarianmu. Coba kata kunci lain atau pilih kategori yang berbeda.</p>
      </div>`;
  } else {
    daftarKaryaEl.innerHTML = hasil.map((karya) => {
      const kreator = cariKreator(karya.kreatorId);
      const namaKreator = kreator ? kreator.nama : 'Mahasiswa STMM';
      const thumbIsi = karya.thumbnail
        ? `<img src="${aman(karya.thumbnail)}" alt="">`
        : ikon(karya.kategori, 28, 1.8);

      return `
        <a class="item-karya" href="detail.html?id=${karya.id}">
          <div class="item-karya__thumb" style="${gayaKategori(karya.kategori)}">
            ${thumbIsi}
          </div>
          <div class="item-karya__info">
            <span class="item-karya__judul">${aman(karya.judul)}</span>
            <span class="item-karya__sub">${aman(namaKreator)} · ${aman(karya.kategori)}</span>
          </div>
        </a>`;
    }).join('');
  }

  // Sinkronkan URL
  const url = new URL(window.location.href);
  if (q) url.searchParams.set('q', inputCari.value.trim());
  else url.searchParams.delete('q');

  if (kategoriDipilih) url.searchParams.set('k', kategoriDipilih);
  else url.searchParams.delete('k');

  window.history.replaceState({}, '', url);
}

// 6. Pasang event listener
// Input teks pencarian
inputCari.addEventListener('input', () => {
  cariDanFilter();
});

// Tombol bersihkan input
if (tombolBersihkan) {
  tombolBersihkan.addEventListener('click', () => {
    inputCari.value = '';
    inputCari.focus();
    cariDanFilter();
  });
}

// Klik chip kategori (toggle)
if (wadahChip) {
  wadahChip.addEventListener('click', (e) => {
    const tombol = e.target.closest('.chip--garis');
    if (!tombol) return;
    const kat = tombol.dataset.kategori;

    if (kategoriDipilih === kat) {
      kategoriDipilih = null; // Toggle off jika sudah aktif
    } else {
      kategoriDipilih = kat;
    }

    renderChip();
    cariDanFilter();
  });
}

// Inisialisasi awal
renderChip();
cariDanFilter();
