/* Logika Layar Detail Karya */

// 1. Inisialisasi bilah atas
pasangTombolKembali('tombol-kembali');

const tombolBagikanAtas = document.getElementById('tombol-bagikan-atas');
if (tombolBagikanAtas) {
  tombolBagikanAtas.innerHTML = ikon('bagikan', 22);
}

// 2. Baca parameter id dari alamat URL (?id=...)
const id = ambilParameter('id');
const karya = id ? cariKarya(id) : null;
const kontainer = document.getElementById('konten-detail');

// 3. Penanganan bila karya tidak ditemukan atau id kosong
if (!karya) {
  document.title = 'Karya Tidak Ditemukan · Galeri Karya STMM';
  if (tombolBagikanAtas) {
    tombolBagikanAtas.style.display = 'none';
  }

  kontainer.innerHTML = `
    <main class="konten">
      <div class="pesan-kosong">
        <strong>Karya Tidak Ditemukan</strong>
        <p class="teks-redup">Karya yang kamu cari tidak ada atau tautan tidak valid.</p>
        <a href="index.html" class="tombol tombol--utama" style="margin-top: var(--jarak-2);">Kembali ke Beranda</a>
      </div>
    </main>`;
} else {
  // 4. Data ditemukan: siapkan detail dan kreator
  const kreator = cariKreator(karya.kreatorId);
  document.title = `${karya.judul} · Galeri Karya STMM`;

  const labelKategori = karya.kategori === 'Film' ? 'Film Pendek' : karya.kategori;
  const inisialNama = kreator ? inisial(kreator.nama) : 'ST';
  const namaKreator = kreator ? kreator.nama : 'Mahasiswa STMM';
  const prodiAngkatan = kreator ? `${kreator.prodi} · Angkatan ${kreator.angkatan}` : 'Institut Seni Indonesia / STMM';
  const labelSatuan = (KATEGORI[karya.kategori] && KATEGORI[karya.kategori].satuan) || 'Durasi';

  const youtubeUrl = karya.youtubeId
    ? `https://www.youtube.com/watch?v=${karya.youtubeId}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(karya.judul + ' STMM')}`;

  // Karya lain oleh kreator yang sama (maksimal 2 kartu)
  const karyaLain = kreator
    ? karyaMilik(kreator.id).filter((k) => k.id !== karya.id).slice(0, 2)
    : [];

  const bagianKaryaLain = karyaLain.length > 0 ? `
    <section class="bagian">
      <h2 class="judul-bagian">Karya Lain dari Kreator</h2>
      <div class="grid-2">
        ${karyaLain.map((k) => kartuKarya(k, { tampilkanKreator: false })).join('')}
      </div>
    </section>` : '';

  // Render template HTML sesuai desain
  kontainer.innerHTML = `
    <!-- Pemutar Video / Hero -->
    <div class="pemutar" id="pemutar">
      ${karya.thumbnail ? `<img src="${aman(karya.thumbnail)}" alt="${aman(karya.judul)}">` : ''}
      <div class="pemutar__overlay">
        <button type="button" class="pemutar__tombol-putar" id="tombol-putar" aria-label="Putar video">
          ${IKON_PUTAR}
        </button>
      </div>
      <span class="pemutar__keterangan">Video tersemat dari YouTube</span>
    </div>

    <!-- Konten Detail -->
    <main class="konten">
      <div class="detail__header">
        <div class="detail__chips">
          <a href="cari.html?k=${encodeURIComponent(karya.kategori)}" class="label label--kategori" style="${gayaKategori(karya.kategori)}; text-decoration: none;" title="Cari karya kategori ${aman(karya.kategori)}">${aman(labelKategori)}</a>
          <a href="cari.html?q=${encodeURIComponent(karya.genre)}" class="label" style="text-decoration: none;" title="Cari karya genre ${aman(karya.genre)}">${aman(karya.genre)}</a>
        </div>
        <h2 class="detail__judul">${aman(karya.judul)}</h2>
      </div>

      <!-- Kartu Kreator -->
      <div class="kreator-kartu">
        <div class="kreator-kartu__avatar">${inisialNama}</div>
        <div class="kreator-kartu__info">
          <span class="kreator-kartu__nama">${aman(namaKreator)}</span>
          <span class="kreator-kartu__sub">${aman(prodiAngkatan)}</span>
        </div>
        <a href="kreator.html?id=${kreator ? aman(kreator.id) : ''}" class="kreator-kartu__tautan">Profil</a>
      </div>

      <!-- Sinopsis -->
      <p class="teks-isi detail__sinopsis">${aman(karya.sinopsis)}</p>

      <!-- 3 Kotak Info Meta -->
      <div class="detail__meta-grid">
        <div class="detail__meta-kotak">
          <span class="detail__meta-label">Tahun</span>
          <span class="detail__meta-nilai">${aman(karya.tahun)}</span>
        </div>
        <div class="detail__meta-kotak">
          <span class="detail__meta-label">${aman(labelSatuan)}</span>
          <span class="detail__meta-nilai">${aman(karya.durasi)}</span>
        </div>
        <div class="detail__meta-kotak">
          <span class="detail__meta-label">Mata Kuliah</span>
          <span class="detail__meta-nilai" title="${aman(karya.mataKuliah)}">${aman(karya.mataKuliah)}</span>
        </div>
      </div>

      <!-- Tombol Aksi -->
      <div class="detail__tombol-aksi">
        <button type="button" class="tombol tombol--utama tombol--penuh" id="tombol-bagikan-utama">Bagikan Karya</button>
        <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" class="tombol tombol--garis tombol--penuh" id="tombol-youtube">Buka di YouTube</a>
      </div>

      <!-- Karya Lain dari Kreator -->
      ${bagianKaryaLain}
    </main>
  `;

  // 5. Hubungkan fungsi interaktif
  // Tombol Bagikan di bilah atas
  if (tombolBagikanAtas) {
    tombolBagikanAtas.addEventListener('click', () => bagikanKarya(karya));
  }

  // Tombol Bagikan di tombol aksi
  const tombolBagikanUtama = document.getElementById('tombol-bagikan-utama');
  if (tombolBagikanUtama) {
    tombolBagikanUtama.addEventListener('click', () => bagikanKarya(karya));
  }

  // Tombol Putar Video
  const tombolPutar = document.getElementById('tombol-putar');
  if (tombolPutar) {
    tombolPutar.addEventListener('click', () => {
      const pemutarEl = document.getElementById('pemutar');
      if (karya.youtubeId) {
        pemutarEl.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${karya.youtubeId}?autoplay=1" title="${aman(karya.judul)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      } else {
        window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }
}
