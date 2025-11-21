document.addEventListener("DOMContentLoaded", function () {
  const addForm = document.getElementById("add-component-form");
  const productSelect = document.getElementById("product_select");

  // ⭐ ELEMEN MODAL BARU ⭐
  const successModal = document.getElementById(
    "custom-add-component-success-modal"
  );
  const successMessage = document.getElementById(
    "add-component-success-message"
  );
  const modalSuccessOkBtn = document.getElementById(
    "modal-add-component-success-ok-btn"
  );

  // --- FUNGSI UTAMA: ISI DROPDOWN PRODUK ---
  function populateProductDropdown() {
    const products = JSON.parse(localStorage.getItem("products")) || [];

    productSelect.innerHTML = '<option value="">-- Pilih Produk -</option>';

    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.nama;
      option.textContent = product.nama;
      productSelect.appendChild(option);
    });

    // Tambahkan opsi simulasi jika tidak ada produk dari localStorage
    if (products.length === 0) {
      ["Tongkat Baseball", "Bola Basket"].forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = `${name} (Simulasi)`;
        productSelect.appendChild(option);
      });
    }
  }

  populateProductDropdown();

  // --- LOGIKA SIMPAN (SUBMIT FORM) ---
  addForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const selectedProduct = productSelect.value;
    const componentName = document.getElementById("component_name").value;
    const quantity = document.getElementById("quantity").value;
    const unit = document.getElementById("unit").value;

    if (selectedProduct === "") {
      alert("Harap pilih Produk.");
      return;
    }

    // ⭐ PERBAIKAN: LOGIKA PENYIMPANAN KE LOCALSTORAGE ⭐

    // 1. Ambil data komponen yang sudah ada
    let componentsData =
      JSON.parse(localStorage.getItem("componentsData")) || [];

    // 2. Buat objek komponen baru
    const newComponent = {
      id: Date.now(), // ID unik
      product: selectedProduct,
      name: componentName,
      quantity: quantity,
      unit: unit,
    };

    // 3. Tambahkan ke array dan simpan kembali
    componentsData.push(newComponent);
    localStorage.setItem("componentsData", JSON.stringify(componentsData));

    // ⭐ TAMPILKAN MODAL SUKSES ⭐
    successMessage.innerHTML = `Komponen "<b>${componentName}</b>" berhasil ditambahkan!`;
    successModal.style.display = "flex";

    // Redirect akan ditangani oleh listener tombol OK
  });

  // ⭐ LOGIKA TOMBOL OK MODAL SUKSES (Redirect setelah OK) ⭐
  modalSuccessOkBtn.addEventListener("click", function () {
    successModal.style.display = "none";
    // Lakukan pengalihan ke halaman Manajemen Komponen
    window.location.href = "manajemen_komponen.html";
  });
});
