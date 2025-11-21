document.addEventListener("DOMContentLoaded", function () {
  const editForm = document.getElementById("edit-form");

  // ⭐ ELEMEN MODAL BARU ⭐
  const successModal = document.getElementById("custom-edit-success-modal");
  const successMessage = document.getElementById("edit-success-message");
  const modalSuccessOkBtn = document.getElementById(
    "modal-edit-success-ok-btn"
  );

  // --- 1. MUAT DATA PRODUK KE FORM SAAT HALAMAN DIBUKA ---
  const urlParams = new URLSearchParams(window.location.search);
  const productCode = urlParams.get("kode");

  // Ambil data produk terbaru dari localStorage
  let products = JSON.parse(localStorage.getItem("products")) || [];
  const currentProduct = products.find((p) => p.kode === productCode);

  if (productCode && currentProduct) {
    // Tampilkan data produk yang akan diedit di form
    document.getElementById("kode_produk").value = currentProduct.kode;
    document.getElementById("nama_produk").value = currentProduct.nama;
    document.getElementById("deskripsi").value = currentProduct.deskripsi;
  } else if (productCode) {
    alert("Produk dengan kode tersebut tidak ditemukan!");
    window.location.href = "manajemen_produk.html";
    return;
  }

  // --- 2. LOGIKA SIMPAN (SUBMIT FORM) ---
  editForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newName = document.getElementById("nama_produk").value;
    const newDescription = document.getElementById("deskripsi").value;
    const kodeProdukToUpdate = document.getElementById("kode_produk").value;

    const productIndex = products.findIndex(
      (p) => p.kode === kodeProdukToUpdate
    );

    if (productIndex !== -1) {
      // GANTI DATA LAMA DENGAN DATA BARU
      products[productIndex].nama = newName;
      products[productIndex].deskripsi = newDescription;

      // Simpan kembali array yang sudah diubah ke localStorage
      localStorage.setItem("products", JSON.stringify(products));

      // ⭐ PERBAIKAN: TAMPILKAN MODAL SUKSES (GANTI ALERT) ⭐
      successMessage.innerHTML = `Produk "<b>${newName}</b>" berhasil diubah!`;
      successModal.style.display = "flex";

      // Perhatian: Redirect sekarang dilakukan setelah user menekan OK di modal
    } else {
      alert("Gagal menyimpan: Produk tidak ditemukan di data.");
    }
  });

  // ⭐ 3. LOGIKA TOMBOL OK MODAL SUKSES (Redirect setelah OK) ⭐
  modalSuccessOkBtn.addEventListener("click", function () {
    successModal.style.display = "none";
    // Lakukan pengalihan hanya setelah pengguna menekan OK
    window.location.href = "manajemen_produk.html";
  });

  // Logika tombol Batal (sudah ada di HTML)
  // window.history.back()
});
