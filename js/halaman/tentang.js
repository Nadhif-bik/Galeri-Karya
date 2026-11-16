/* Logika Layar Tentang */

// 1. Pasang ikon panah ke baris menu
const panahSvg = ikon('panah', 18, 2.2);
['panah-kebijakan', 'panah-tim', 'panah-kontak'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.innerHTML = panahSvg;
});

// 2. Aksi tombol "Ajukan Karya"
const tombolAjukan = document.getElementById('tombol-ajukan');
if (tombolAjukan) {
  tombolAjukan.addEventListener('click', () => {
    tampilkanToast('Formulir kurasi karya akan dibuka melalui portal kampus.');
  });
}

// 3. Aksi menu informasi
const menuKebijakan = document.getElementById('menu-kebijakan');
if (menuKebijakan) {
  menuKebijakan.addEventListener('click', (e) => {
    e.preventDefault();
    tampilkanToast('Hak cipta karya sepenuhnya milik kreator mahasiswa.');
  });
}

const menuTim = document.getElementById('menu-tim');
if (menuTim) {
  menuTim.addEventListener('click', (e) => {
    e.preventDefault();
    tampilkanToast('Dikembangkan oleh tim mahasiswa Mobile Computing STMM.');
  });
}

const menuKontak = document.getElementById('menu-kontak');
if (menuKontak) {
  menuKontak.addEventListener('click', (e) => {
    e.preventDefault();
    tampilkanToast('Hubungi kami melalui lab multimedia STMM.');
  });
}
