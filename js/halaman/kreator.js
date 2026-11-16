/* Logika Layar Profil Kreator */

// 1. Baca parameter id kreator dari URL (?id=...)
const id = ambilParameter('id');
const kreator = id ? cariKreator(id) : null;
const kontainer = document.getElementById('konten-kreator');

// 2. Penanganan bila kreator tidak ditemukan
if (!kreator) {
  document.title = 'Kreator Tidak Ditemukan · Galeri Karya STMM';

  kontainer.innerHTML = `
    <header class="bilah-atas bilah-atas--tengah">
      <a class="ikon-tombol" href="index.html" id="tombol-kembali" aria-label="Kembali ke Beranda"></a>
      <h1 class="bilah-atas__judul">Profil Kreator</h1>
      <div style="width: 44px;"></div>
    </header>

    <main class="konten">
      <div class="pesan-kosong">
        <strong>Kreator Tidak Ditemukan</strong>
        <p class="teks-redup">Profil kreator yang kamu cari tidak ada atau tautan tidak valid.</p>
        <a href="index.html" class="tombol tombol--utama" style="margin-top: var(--jarak-2);">Kembali ke Beranda</a>
      </div>
    </main>`;

  pasangTombolKembali('tombol-kembali');
} else {
  // 3. Data kreator ditemukan: siapkan statistik & karya
  document.title = `${kreator.nama} · Profil Kreator STMM`;

  const inisialNama = inisial(kreator.nama);
  const prodiAngkatan = `${kreator.prodi} · Angkatan ${kreator.angkatan}`;
  const daftarKarya = karyaMilik(kreator.id);

  // Hitung statistik
  const totalKarya = daftarKarya.length;
  const totalKategori = new Set(daftarKarya.map((k) => k.kategori)).size;
  const tahunBergabung = kreator.angkatan;

  // Render template HTML
  kontainer.innerHTML = `
    <!-- Hero Biru Tua -->
    <section class="kreator-hero">
      <header class="bilah-atas bilah-atas--tengah kreator-hero__bilah">
        <a class="ikon-tombol kreator-hero__kembali" href="index.html" id="tombol-kembali" aria-label="Kembali"></a>
        <h1 class="kreator-hero__judul">Profil Kreator</h1>
        <div style="width: 44px;" aria-hidden="true"></div>
      </header>

      <div class="kreator-hero__profil">
        <div class="kreator-hero__avatar">${inisialNama}</div>
        <h2 class="kreator-hero__nama">${aman(kreator.nama)}</h2>
        <span class="kreator-hero__sub">${aman(prodiAngkatan)}</span>
      </div>
    </section>

    <!-- 3 Kartu Statistik Mengambang -->
    <div class="kreator-stats">
      <div class="kreator-stats__kartu">
        <span class="kreator-stats__angka">${totalKarya}</span>
        <span class="kreator-stats__label">Karya</span>
      </div>
      <div class="kreator-stats__kartu">
        <span class="kreator-stats__angka">${totalKategori}</span>
        <span class="kreator-stats__label">Kategori</span>
      </div>
      <div class="kreator-stats__kartu">
        <span class="kreator-stats__angka">${tahunBergabung}</span>
        <span class="kreator-stats__label">Bergabung</span>
      </div>
    </div>

    <!-- Konten Utama: Tentang & Karya -->
    <main class="kreator-konten">
      <!-- Tentang Kreator -->
      <section class="bagian">
        <h3 class="judul-bagian">Tentang Kreator</h3>
        <p class="teks-isi">${aman(kreator.bio)}</p>
      </section>

      <!-- Karya Kreator -->
      <section class="bagian">
        <h3 class="judul-bagian">Karya</h3>
        <div class="grid-2">
          ${daftarKarya.map((k) => kartuKarya(k, { tampilkanKreator: false })).join('')}
        </div>
      </section>
    </main>
  `;

  // Pasang navigasi tombol kembali
  pasangTombolKembali('tombol-kembali');
}
