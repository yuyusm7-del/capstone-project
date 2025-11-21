document.addEventListener("DOMContentLoaded", function () {
  const addForm = document.getElementById("add-form");

  // ⭐ ELEMEN MODAL BARU ⭐
  const successModal = document.getElementById("custom-add-success-modal");
  const successMessage = document.getElementById("add-success-message");
  const modalSuccessOkBtn = document.getElementById("modal-add-success-ok-btn");

  addForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const kodeProduk = document.getElementById("kode_produk").value;
    const namaProduk = document.getElementById("nama_produk").value;
    const deskripsi = document.getElementById("deskripsi").value;

    // --- 1. AMBIL DATA LAMA & BUAT DATA BARU ---
    const products = JSON.parse(localStorage.getItem("products")) || [];

    // Cek duplikasi kode produk (Penting!)
    const isDuplicate = products.some(
      (p) => p.kode.toLowerCase() === kodeProduk.toLowerCase()
    );

    if (isDuplicate) {
      alert(`Gagal menyimpan: Kode Produk "${kodeProduk}" sudah ada!`);
      return; // Hentikan proses jika duplikat
    }

    const newProduct = {
      kode: kodeProduk,
      nama: namaProduk,
      deskripsi: deskripsi,
    };

    // --- 2. TAMBAHKAN DATA BARU KE ARRAY & SIMPAN KE LOCALSTORAGE ---
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    // ⭐ TAMPILKAN MODAL SUKSES (GANTI ALERT) ⭐
    successMessage.innerHTML = `Produk "<b>${namaProduk}</b>" berhasil ditambahkan!`;
    successModal.style.display = "flex";

    // Redirect akan ditangani oleh listener tombol OK di bawah.
  });

  // ⭐ LOGIKA TOMBOL OK MODAL SUKSES (Redirect setelah OK) ⭐
  modalSuccessOkBtn.addEventListener("click", function () {
    successModal.style.display = "none";
    // Lakukan pengalihan hanya setelah pengguna menekan OK
    window.location.href = "manajemen_produk.html";
  });
});
