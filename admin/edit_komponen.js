document.addEventListener("DOMContentLoaded", function () {
  const editForm = document.getElementById("edit-component-form");
  const productSelect = document.getElementById("product_select");

  // --- Elemen Modal ---
  const successModal = document.getElementById(
    "custom-edit-component-success-modal"
  );
  const successMessage = document.getElementById(
    "edit-component-success-message"
  );
  const modalSuccessOkBtn = document.getElementById(
    "modal-edit-component-success-ok-btn"
  );

  // --- 1. MUAT DATA LAMA KE FORM SAAT HALAMAN DIBUKA ---
  const urlParams = new URLSearchParams(window.location.search);

  // ⭐ PERBAIKAN TIPE DATA (PENTING) ⭐
  // Mengambil 'id' dan mengonversi ke integer agar cocok dengan tipe data di localStorage
  const componentId = parseInt(urlParams.get("id"));

  let componentsData = JSON.parse(localStorage.getItem("componentsData")) || [];
  // Mencari berdasarkan ID integer
  let currentComponent = componentsData.find((c) => c.id === componentId);

  function populateFormAndDropdown() {
    // Cek jika ID tidak valid atau data tidak ditemukan
    if (isNaN(componentId) || !currentComponent) {
      alert("ID Komponen tidak valid atau data tidak ditemukan!");
      window.location.href = "manajemen_komponen.html";
      return;
    }

    // Isi data form
    document.getElementById("component_name").value = currentComponent.name;
    document.getElementById("quantity").value = currentComponent.quantity;
    document.getElementById("unit").value = currentComponent.unit;

    // Isi dropdown (Produk yang terkait)
    productSelect.innerHTML = `<option value="${currentComponent.product}">${currentComponent.product}</option>`;

    // Disable dropdown karena produk tidak boleh diubah
    productSelect.disabled = true;
  }

  populateFormAndDropdown();

  // --- 2. LOGIKA SIMPAN (SUBMIT FORM) ---
  editForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newName = document.getElementById("component_name").value;
    const newQuantity = document.getElementById("quantity").value;
    const newUnit = document.getElementById("unit").value;

    // Cari indeks produk yang akan diubah
    // Perhatikan: componentsData di dalam scope ini adalah array yang dimuat saat halaman dibuka
    const componentIndex = componentsData.findIndex(
      (c) => c.id === componentId
    );

    if (componentIndex !== -1) {
      // GANTI DATA LAMA DENGAN DATA BARU
      componentsData[componentIndex].name = newName;
      componentsData[componentIndex].quantity = newQuantity;
      componentsData[componentIndex].unit = newUnit;

      // Simpan kembali array yang sudah diubah ke localStorage
      localStorage.setItem("componentsData", JSON.stringify(componentsData));

      // Tampilkan Modal Sukses
      successMessage.innerHTML = `Komponen "<b>${newName}</b>" berhasil diubah!`;
      successModal.style.display = "flex";
    } else {
      alert("Gagal menyimpan: Komponen tidak ditemukan.");
    }
  });

  // ⭐ LOGIKA TOMBOL OK MODAL SUKSES (Redirect setelah OK) ⭐
  modalSuccessOkBtn.addEventListener("click", function () {
    successModal.style.display = "none";
    // Lakukan pengalihan ke halaman Manajemen Komponen
    window.location.href = "manajemen_komponen.html";
  });
});
