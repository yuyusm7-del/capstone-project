document.addEventListener("DOMContentLoaded", function () {
  const addForm = document.getElementById("add-procurement-form");
  const componentSelect = document.getElementById("component_select");

  // ⭐ ELEMEN MODAL BARU ⭐
  const successModal = document.getElementById(
    "custom-add-procurement-success-modal"
  );
  const successMessage = document.getElementById(
    "add-procurement-success-message"
  );
  const modalSuccessOkBtn = document.getElementById(
    "modal-add-procurement-success-ok-btn"
  );

  // --- FUNGSI UTAMA: ISI DROPDOWN KOMPONEN ---
  function populateComponentDropdown() {
    // Ambil data Komponen dari localStorage
    const components = JSON.parse(localStorage.getItem("componentsData")) || [];

    componentSelect.innerHTML =
      '<option value="">-- pilih Komponen --</option>';

    // Mengambil nama-nama Komponen unik
    const uniqueNames = [...new Set(components.map((c) => c.name))];

    uniqueNames.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      componentSelect.appendChild(option);
    });

    // Tambahkan opsi simulasi jika tidak ada data Komponen
    if (uniqueNames.length === 0) {
      const optionSim = document.createElement("option");
      optionSim.value = "Kayu Maple";
      optionSim.textContent = "Kayu Maple (Simulasi)";
      componentSelect.appendChild(optionSim);
    }
  }

  populateComponentDropdown();

  // --- LOGIKA SIMPAN (SUBMIT FORM) ---
  addForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const componentName = componentSelect.value;
    const price = document.getElementById("price").value;
    const date = document.getElementById("date").value;
    const kurs = document.getElementById("kurs").value;
    const vendor = document.getElementById("vendor").value;

    // --- SIMULASI PENYIMPANAN DATA RIWAYAT ---

    // 1. Ambil data Riwayat yang sudah ada (simulasi)
    let procurementData =
      JSON.parse(localStorage.getItem("procurementData")) || [];

    // 2. Buat objek Riwayat baru
    const newRecord = {
      id: Date.now(),
      component: componentName,
      price: price,
      date: date,
      kurs: kurs,
      vendor: vendor,
    };

    // 3. Tambahkan ke array dan simpan kembali
    procurementData.push(newRecord);
    localStorage.setItem("procurementData", JSON.stringify(procurementData));

    // ⭐ TAMPILKAN MODAL SUKSES ⭐
    successMessage.innerHTML = `Riwayat untuk <b>${componentName}</b> berhasil ditambahkan!`;
    successModal.style.display = "flex";
  });

  // ⭐ LOGIKA TOMBOL OK MODAL SUKSES (Redirect setelah OK) ⭐
  modalSuccessOkBtn.addEventListener("click", function () {
    successModal.style.display = "none";
    // Lakukan pengalihan ke halaman Riwayat Pengadaan
    window.location.href = "riwayat_pengadaan.html";
  });
});
